import pytest


class TestFactoryLogic:
    def test_factory_registration_simulation(self):
        escrows = []
        def register(addr: str):
            escrows.append(addr)

        register("0x1111111111111111111111111111111111111111")
        register("0x2222222222222222222222222222222222222222")

        assert len(escrows) == 2
        assert escrows[0] == "0x1111111111111111111111111111111111111111"
