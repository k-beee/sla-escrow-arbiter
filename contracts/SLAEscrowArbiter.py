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


def _parse_verdict_json(raw: str) -> dict:
    """Defensive JSON extraction from LLM output."""
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


def _normalize_address(addr: str) -> str:
    """Normalize addresses to prevent casing/EIP-55 comparison mismatches."""
    return addr.strip().lower()


class SLAEscrowArbiter(gl.Contract):
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
        self.client = gl.message.sender_address
        self.contractor = contractor
        self.deliverable_criteria = deliverable_criteria
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
