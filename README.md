# SLAEscrowArbiter

[![GenLayer StudioNet](https://img.shields.io/badge/GenLayer-StudioNet%20Compatible-blue)](https://studio.genlayer.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SLAEscrowArbiter** is an Intelligent Contract protocol built for GenLayer that automates milestone and SLA escrow settlement. It replaces centralized dispute middlemen with decentralized AI validator consensus over live web evidence (e.g. GitHub repositories, PRs, or API endpoints).

---

## Why GenLayer?

In decentralized finance and freelance work, judging whether deliverable criteria were met has traditionally required trusted third parties or multisigs. 

SLAEscrowArbiter solves this by:
1. **Holding Native GEN Deposits**: Escrows real value via `@gl.public.write.payable`.
2. **Fetching Real-Time Evidence**: Validators independently render live web evidence via `gl.nondet.web.render`.
3. **Substantive Consensus**: Custom Equivalence Principle validators (`gl.vm.run_nondet_unsafe`) evaluate qualitative satisfaction and agree on both outcome and confidence within strict bounds.
4. **Autonomous Payouts**: Automatically triggers native token transfers (`gl.chain.Account(addr).emit_transfer`) upon consensus.

---

## Architecture Overview

```mermaid
flowchart LR
    Client -->|fund_escrow| Contract[SLAEscrowArbiter]
    Contractor -->|submit_deliverable| Contract
    Contract -->|resolve_milestone| Validators[GenLayer Consensus]
    Validators -->|gl.nondet.web.render| WebEvidence[Live Evidence URL]
    Validators -->|Equivalence Principle| Settlement{Consensus Verdict}
    Settlement -->|APPROVE| Contractor
    Settlement -->|REJECT| Client
```

---

## Repository Structure

```
sla-escrow-arbiter/
├── contracts/
│   ├── SLAEscrowArbiter.py    # Core Intelligent Contract
│   └── SLAEscrowFactory.py    # Escrow instance registry
├── tests/
│   └── test_sla_escrow.py     # Comprehensive unit tests
├── scripts/
│   └── deploy.mjs             # Deployment script using genlayer-js
├── docs/
│   ├── ARCHITECTURE.md        # Deep architecture & threat model
│   └── STUDIONET_GUIDE.md     # StudioNet step-by-step instructions
├── pyproject.toml
├── pytest.ini
└── README.md
```

---

## Quickstart & Testing

### Running Tests Locally

```bash
# Install dependencies
pip install pytest

# Run tests
pytest tests/ -v
```

### Deploying on StudioNet

1. Open [GenLayer Studio](https://studio.genlayer.com).
2. Create a file named `SLAEscrowArbiter.py` and paste `contracts/SLAEscrowArbiter.py`.
3. Set contractor address and criteria, then click **Deploy**.
4. Refer to [`docs/STUDIONET_GUIDE.md`](docs/STUDIONET_GUIDE.md) for full interactive testing instructions.

---

## Deployed Contracts

- **Network**: GenLayer StudioNet
- **Contract Address**: [`0xC7e04361224f5d3336Ac3851F65E8f0d09C5B219`](https://explorer-studio.genlayer.com/address/0xC7e04361224f5d3336Ac3851F65E8f0d09C5B219)
- **Contract Type**: `SLAEscrowArbiter`

---

## License

MIT License. See [LICENSE](LICENSE) for details.
