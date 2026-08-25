# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

import json
import re
from genlayer import *
import genlayer.gl as gl

STATUS_OPEN = "OPEN"
STATUS_CLAIMED = "CLAIMED"
STATUS_RESOLVING = "RESOLVING"
STATUS_COMPLETED = "COMPLETED"
STATUS_REFUNDED = "REFUNDED"

MAX_EVIDENCE_LEN = 3000
CONFIDENCE_THRESHOLD_BPS = 7000  # 70.00% minimum confidence to approve payout


def _parse_verdict_json(raw: str) -> dict:
    """
    Defensive JSON extraction from LLM output.
    Extracts JSON substring and drops malformed trailing commas.
    """
    if isinstance(raw, dict):
        return raw
    if not isinstance(raw, str):
        return {}
    first = raw.find("{")
    last = raw.rfind("}")
    if first == -1 or last == -1 or last < first:
        return {}
    snippet = raw[first : last + 1]
    snippet = re.sub(r",(?!\s*?[\{\[\"\'\w])", "", snippet)
    try:
        return json.loads(snippet)
    except (json.JSONDecodeError, ValueError):
        return {}


def _to_address(val) -> Address:
    """Safely coerces Address, string, or hex int into a valid GenLayer Address object."""
    if isinstance(val, Address):
        return val
    if isinstance(val, str):
        return Address(val)
    if isinstance(val, int):
        hex_str = hex(val)
        # Pad to 40 hex chars if needed
        hex_body = hex_str[2:].rjust(40, "0")
        return Address("0x" + hex_body)
    return Address(str(val))


def _normalize_address(addr: str) -> str:
    """Normalize addresses to prevent casing/EIP-55 comparison mismatches."""
    return addr.strip().lower()


class SLAEscrowArbiter(gl.Contract):
    """
    Intelligent Escrow Arbiter for Deliverable & SLA Verification.
    Locks real GEN into escrow and uses multi-validator consensus over live
    web-fetched evidence to adjudicate whether deliverables meet criteria.
    """
    client: Address
    contractor: Address
    escrow_amount: u256
    deliverable_criteria: str
    evidence_url: str
    status: str
    created_at: str
    resolved_at: str
    resolution_verdict: str
    resolution_reasoning: str
    confidence_bps: u256

    def __init__(self, contractor: Address, deliverable_criteria: str):
        """Initializes the escrow contract with terms and assigned contractor."""
        self.client = gl.message.sender_address
        self.contractor = _to_address(contractor)
        self.deliverable_criteria = str(deliverable_criteria)
        self.evidence_url = ""
        self.escrow_amount = u256(0)
        self.status = STATUS_OPEN
        self.created_at = gl.message_raw.get("datetime", "")
        self.resolved_at = ""
        self.resolution_verdict = ""
        self.resolution_reasoning = ""
        self.confidence_bps = u256(0)

    @gl.public.write.payable
    def fund_escrow(self) -> None:
        """Client deposits native GEN into the escrow."""
        if _normalize_address(gl.message.sender_address.as_hex) != _normalize_address(self.client.as_hex):
            gl.vm.UserError("Only the client can fund the escrow")
        if self.status != STATUS_OPEN:
            gl.vm.UserError(f"Cannot fund escrow in status: {self.status}")
        if gl.message.value <= 0:
            gl.vm.UserError("Deposit value must be greater than 0")

        self.escrow_amount = gl.message.value
        self.status = STATUS_CLAIMED

    @gl.public.write
    def submit_deliverable(self, evidence_url: str) -> None:
        """Contractor submits evidence URL for verification."""
        if _normalize_address(gl.message.sender_address.as_hex) != _normalize_address(self.contractor.as_hex):
            gl.vm.UserError("Only the contractor can submit deliverable")
        if self.status != STATUS_CLAIMED:
            gl.vm.UserError("Escrow must be funded before deliverable submission")
        if not evidence_url.startswith("http://") and not evidence_url.startswith("https://"):
            gl.vm.UserError("Evidence URL must be a valid HTTP/HTTPS endpoint")

        self.evidence_url = evidence_url

    @gl.public.write
    def resolve_milestone(self) -> None:
        """
        Validators fetch live evidence from the evidence URL, evaluate against
        deliverable criteria, and agree on whether to release funds or refund.
        """
        if self.status != STATUS_CLAIMED:
            gl.vm.UserError("Escrow not ready for resolution")
        if len(self.evidence_url) == 0:
            gl.vm.UserError("No evidence URL submitted")

        self.status = STATUS_RESOLVING
        evidence_url = self.evidence_url
        criteria = self.deliverable_criteria

        def eval_task() -> dict:
            # 1. Fetch live web content via GenLayer non-deterministic web renderer
            web_evidence = ""
            try:
                web_evidence = gl.nondet.web.render(evidence_url, mode="text")[:MAX_EVIDENCE_LEN]
            except Exception:
                web_evidence = "FAILED_TO_FETCH_LIVE_URL"

            # 2. Instruct LLM to analyze the evidence against binding criteria
            prompt = f"""You are a neutral decentralized escrow validator adjudicating milestone completion.
Binding Acceptance Criteria:
{criteria}

Live Evidence Fetched from Deliverable URL ({evidence_url}):
{web_evidence}

Task:
Determine if the evidence proves that the acceptance criteria have been satisfied.
Respond ONLY with a JSON object in this exact schema:
{{
    "verdict": "APPROVE" or "REJECT",
    "confidence_bps": integer between 0 and 10000 (e.g. 8500 = 85.00%),
    "reasoning": "Concise summary of findings (max 200 chars)"
}}"""
            raw_response = gl.nondet.exec_prompt(prompt)
            parsed = _parse_verdict_json(raw_response)
            verdict = parsed.get("verdict", "REJECT").upper()
            if verdict not in ["APPROVE", "REJECT"]:
                verdict = "REJECT"

            conf = parsed.get("confidence_bps", 0)
            if not isinstance(conf, int):
                try:
                    conf = int(conf)
                except (ValueError, TypeError):
                    conf = 0
            conf = max(0, min(10000, conf))

            reasoning = str(parsed.get("reasoning", "No reasoning provided"))[:200]
            return {
                "verdict": verdict,
                "confidence_bps": conf,
                "reasoning": reasoning
            }

        def validate_verdict(leader_out: dict) -> bool:
            # Validator independently checks if leader's verdict matches its evaluation
            my_out = eval_task()
            if leader_out.get("verdict") != my_out.get("verdict"):
                return False
            # Confidence must match within a 15% tolerance window
            leader_conf = leader_out.get("confidence_bps", 0)
            my_conf = my_out.get("confidence_bps", 0)
            return abs(leader_conf - my_conf) <= 1500

        # Run custom Equivalence Principle consensus
        result = gl.vm.run_nondet_unsafe(eval_task, validate_verdict)

        verdict = result.get("verdict", "REJECT")
        conf = result.get("confidence_bps", 0)
        reasoning = result.get("reasoning", "")

        self.resolution_verdict = verdict
        self.confidence_bps = u256(conf)
        self.resolution_reasoning = reasoning
        self.resolved_at = gl.message_raw.get("datetime", "")

        # Execute payout or refund based on consensus verdict
        if verdict == "APPROVE" and conf >= CONFIDENCE_THRESHOLD_BPS:
            self.status = STATUS_COMPLETED
            payout_val = self.escrow_amount
            self.escrow_amount = u256(0)
            gl.chain.Account(self.contractor).emit_transfer(payout_val)
        else:
            self.status = STATUS_REFUNDED
            refund_val = self.escrow_amount
            self.escrow_amount = u256(0)
            gl.chain.Account(self.client).emit_transfer(refund_val)

    @gl.public.view
    def get_escrow_details(self) -> dict:
        """Returns comprehensive state details."""
        return {
            "client": self.client.as_hex,
            "contractor": self.contractor.as_hex,
            "escrow_amount": str(self.escrow_amount),
            "deliverable_criteria": self.deliverable_criteria,
            "evidence_url": self.evidence_url,
            "status": self.status,
            "created_at": self.created_at,
            "resolved_at": self.resolved_at,
            "verdict": self.resolution_verdict,
            "confidence_bps": str(self.confidence_bps),
            "reasoning": self.resolution_reasoning,
        }
