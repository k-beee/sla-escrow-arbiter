# GenLayer StudioNet Deployment & Testing Guide

This guide walks through deploying and testing **SLAEscrowArbiter** on GenLayer StudioNet (the official gasless in-browser IDE simulation network).

## Prerequisites

- Access to [GenLayer Studio](https://studio.genlayer.com).
- Ensure the network dropdown at the top is set to **StudioNet**.

## Step-by-Step Deployment

1. **Open Studio**: Navigate to `studio.genlayer.com`.
2. **Create Contract**: Create a new file named `SLAEscrowArbiter.py` under the contracts workspace.
3. **Paste Source**: Copy the contents of `contracts/SLAEscrowArbiter.py` into the editor.
4. **Compile & Deploy**:
   - In the constructor parameters:
     - `contractor`: Enter Account 1 address (e.g. `0x...`).
     - `deliverable_criteria`: `"The pull request must implement all required acceptance criteria with 100% test coverage."`
   - Click **Deploy**.

## Running the Lifecycle

1. **Fund Escrow**:
   - As Account 0 (Client), call `fund_escrow()` with `Value` set to `1000000000000000000` (1 GEN).
   - Verify that `get_escrow_details()` shows status `"CLAIMED"` and `escrow_amount = "1000000000000000000"`.

2. **Submit Deliverable**:
   - Switch to Account 1 (Contractor).
   - Call `submit_deliverable(evidence_url="https://github.com/torvalds/linux")`.
   - Verify `evidence_url` is recorded in state.

3. **Resolve Milestone**:
   - Call `resolve_milestone()`.
   - StudioNet will execute validator consensus with `gl.nondet.web.render` and `gl.nondet.exec_prompt`.
   - The contract updates to `"COMPLETED"` or `"REFUNDED"` and transfers funds via `emit_transfer`.

4. **Verify Settlement**:
   - Call `get_escrow_details()` to inspect the finalized verdict, reasoning, and confidence basis points.
