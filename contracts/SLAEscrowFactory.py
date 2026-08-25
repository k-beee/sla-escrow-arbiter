# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import genlayer.gl as gl


def _to_address(val) -> Address:
    """Safely coerces Address, string, or hex int into a valid GenLayer Address object."""
    if isinstance(val, Address):
        return val
    if isinstance(val, str):
        return Address(val)
    if isinstance(val, int):
        hex_str = hex(val)
        hex_body = hex_str[2:].rjust(40, "0")
        return Address("0x" + hex_body)
    return Address(str(val))


class SLAEscrowFactory(gl.Contract):
    """
    Registry and Factory for deploying and tracking SLAEscrow contracts.
    Storage collections like DynArray and TreeMap are automatically
    managed by GenVM and do not need constructor initialization.
    """
    escrows: DynArray[Address]
    owner: Address

    def __init__(self):
        self.owner = gl.message.sender_address
        # Note: self.escrows is automatically initialized by GenVM storage

    @gl.public.write
    def register_escrow(self, escrow_address: Address) -> None:
        """Register a newly deployed escrow contract address."""
        self.escrows.append(_to_address(escrow_address))

    @gl.public.view
    def get_all_escrows(self) -> list:
        """Return all registered escrow addresses as hex strings."""
        result = []
        for i in range(len(self.escrows)):
            result.append(self.escrows[i].as_hex)
        return result

    @gl.public.view
    def get_escrow_count(self) -> int:
        """Return total number of registered escrows."""
        return len(self.escrows)
