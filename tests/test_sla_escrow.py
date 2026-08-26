import pytest
import json
import re


def _parse_verdict_json(raw: str) -> dict:
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
    return addr.strip().lower()


class TestParsingAndNormalization:
    def test_clean_json_parsing(self):
        valid = '{"verdict": "APPROVE", "confidence_bps": 8500, "reasoning": "Criteria met"}'
        parsed = _parse_verdict_json(valid)
        assert parsed.get("verdict") == "APPROVE"
        assert parsed.get("confidence_bps") == 8500

    def test_json_with_markdown_fence(self):
        fenced = '```json\n{"verdict": "REJECT", "confidence_bps": 4000, "reasoning": "Missing tests"}\n```'
        parsed = _parse_verdict_json(fenced)
        assert parsed.get("verdict") == "REJECT"
        assert parsed.get("confidence_bps") == 4000

    def test_json_with_trailing_comma(self):
        trailing = '{"verdict": "APPROVE", "confidence_bps": 9000, "reasoning": "All passed",}'
        parsed = _parse_verdict_json(trailing)
        assert parsed.get("verdict") == "APPROVE"
        assert parsed.get("confidence_bps") == 9000

    def test_invalid_json_fallback(self):
        assert _parse_verdict_json("No json here") == {}
        assert _parse_verdict_json("") == {}
        assert _parse_verdict_json(None) == {}

    def test_address_normalization(self):
        eip55_1 = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
        eip55_2 = "0x5b38da6a701c568545dcfcb03fcb875f56beddc4"
        assert _normalize_address(eip55_1) == _normalize_address(eip55_2)


class TestEscrowLogicSimulation:
    def test_verdict_tolerance_check(self):
        def check_agreement(leader: dict, validator: dict) -> bool:
            if leader.get("verdict") != validator.get("verdict"):
                return False
            return abs(leader.get("confidence_bps", 0) - validator.get("confidence_bps", 0)) <= 1500

        l1 = {"verdict": "APPROVE", "confidence_bps": 8500}
        v1 = {"verdict": "APPROVE", "confidence_bps": 8000}
        assert check_agreement(l1, v1) is True

        l2 = {"verdict": "APPROVE", "confidence_bps": 8500}
        v2 = {"verdict": "REJECT", "confidence_bps": 8500}
        assert check_agreement(l2, v2) is False

        l3 = {"verdict": "APPROVE", "confidence_bps": 9000}
        v3 = {"verdict": "APPROVE", "confidence_bps": 7000}
        assert check_agreement(l3, v3) is False


class TestEscrowTerminalGuards:
    def test_cannot_resolve_completed_or_refunded(self):
        def can_resolve(status: str, escrow_amount: int) -> bool:
            if status in ["COMPLETED", "REFUNDED", "RESOLVING"]:
                return False
            if status != "CLAIMED":
                return False
            if escrow_amount <= 0:
                return False
            return True

        assert can_resolve("COMPLETED", 0) is False
        assert can_resolve("REFUNDED", 0) is False
        assert can_resolve("RESOLVING", 1000) is False
        assert can_resolve("OPEN", 1000) is False
        assert can_resolve("CLAIMED", 1000) is True
