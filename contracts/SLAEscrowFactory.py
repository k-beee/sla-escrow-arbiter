# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import genlayer.gl as gl


class SLAEscrowFactory(gl.Contract):
    """
    Registry and Factory for deploying and tracking SLAEscrow contracts.
    """
    escrows: DynArray[Address]
    owner: Address

    def __init__(self):
        self.owner = gl.message.sender_address
        self.escrows = DynArray[Address]()

    @gl.public.write
    def register_escrow(self, escrow_address: Address) -> None:
        """Register a newly deployed escrow contract address."""
        self.escrows.append(escrow_address)

    @gl.public.view
    def get_all_escrows(self) -> list:
        """Return all registered escrow addresses."""
        result = []
        for i in range(len(self.escrows)):
            result.append(self.escrows[i].as_hex)
        return result

    @gl.public.view
    def get_escrow_count(self) -> int:
        """Return total number of registered escrows."""
        return len(self.escrows)
