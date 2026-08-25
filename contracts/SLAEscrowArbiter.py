# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import genlayer.gl as gl

STATUS_OPEN = "OPEN"
STATUS_CLAIMED = "CLAIMED"
STATUS_RESOLVING = "RESOLVING"
STATUS_COMPLETED = "COMPLETED"
STATUS_REFUNDED = "REFUNDED"


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
