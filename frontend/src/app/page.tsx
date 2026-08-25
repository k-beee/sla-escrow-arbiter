"use client";

import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import {
  ShieldCheck,
  Send,
  Cpu,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileCode2,
  Lock,
  Sparkles,
  ArrowRight,
  Globe,
  Check,
  Copy,
  Layers,
  TerminalSquare,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const [role, setRole] = useState<"client" | "contractor">("client");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Accounts
  const clientAddr = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
  const contractorAddr = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const arbiterAddress = "0xC7e04361224f5d3336Ac3851F65E8f0d09C5B219";
  const factoryAddress = "0x98216F20cb9C01d65fe9671F1C6ee19595F2711B";

  const currentAccount = role === "client" ? clientAddr : contractorAddr;

  // Escrow state representation
  const [escrowState, setEscrowState] = useState({
    client: clientAddr,
    contractor: contractorAddr,
    escrowAmount: "1.00",
    criteria: "The pull request must pass all unit tests and contain complete architectural documentation in docs/.",
    evidenceUrl: "https://github.com/torvalds/linux",
    status: "CLAIMED",
    verdict: "APPROVE",
    confidenceBps: 8850,
    reasoning: "PR contains full test suite passing with 100% coverage and comprehensive architectural spec.",
    resolvedAt: "2026-08-25T10:45:00Z",
  });

  // Action states
  const [activeTab, setActiveTab] = useState<"resolve" | "submit" | "fund">("resolve");
  const [depositAmount, setDepositAmount] = useState("1.0");
  const [evidenceInput, setEvidenceInput] = useState("https://github.com/torvalds/linux");
  const [txStep, setTxStep] = useState<"idle" | "signing" | "pending" | "FINALIZED">("idle");
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [txLog, setTxLog] = useState<Array<{ time: string; text: string; type: "info" | "success" | "warn" }>>([
    {
      time: "10:44:12",
      text: "SLAEscrowArbiter state initialized on StudioNet.",
      type: "info",
    },
    {
      time: "10:44:30",
      text: "Escrow funded with 1.00 GEN by client 0x5B38...ddC4.",
      type: "success",
    },
  ]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleToggleRole = () => {
    setRole((prev) => (prev === "client" ? "contractor" : "client"));
  };

  const runAction = async (actionName: "fund" | "submit" | "resolve") => {
    setTxStep("signing");
    const now = () => new Date().toLocaleTimeString();

    setTxLog((prev) => [{ time: now(), text: `Requesting signature for ${actionName}()...`, type: "info" }, ...prev]);

    setTimeout(() => {
      setTxStep("pending");
      setActivePipelineStep(1);

      if (actionName === "resolve") {
        setTxLog((prev) => [
          { time: now(), text: "Validators executing gl.nondet.web.render on target URL...", type: "info" },
          ...prev,
        ]);

        setTimeout(() => {
          setActivePipelineStep(2);
          setTxLog((prev) => [
            { time: now(), text: "Independent LLM deliberation against deliverable criteria...", type: "info" },
            ...prev,
          ]);

          setTimeout(() => {
            setActivePipelineStep(3);
            setTxLog((prev) => [
              { time: now(), text: "Equivalence Principle validation: Outcome APPROVE, confidence Δ 350 bps (≤ 1500 bps tolerance).", type: "success" },
              ...prev,
            ]);

            setTimeout(() => {
              setActivePipelineStep(4);
              setTxStep("FINALIZED");
              setEscrowState((prev) => ({ ...prev, status: "COMPLETED" }));
              setTxLog((prev) => [
                { time: now(), text: "Payout executed: 1.00 GEN transferred to contractor via emit_transfer.", type: "success" },
                ...prev,
              ]);
            }, 1000);
          }, 1200);
        }, 1200);
      } else if (actionName === "fund") {
        setTimeout(() => {
          setTxStep("FINALIZED");
          setEscrowState((prev) => ({ ...prev, status: "CLAIMED", escrowAmount: depositAmount }));
          setTxLog((prev) => [
            { time: now(), text: `Deposit of ${depositAmount} GEN confirmed and locked in escrow.`, type: "success" },
            ...prev,
          ]);
        }, 1200);
      } else if (actionName === "submit") {
        setTimeout(() => {
          setTxStep("FINALIZED");
          setEscrowState((prev) => ({ ...prev, evidenceUrl: evidenceInput }));
          setTxLog((prev) => [
            { time: now(), text: `Evidence URL registered: ${evidenceInput}`, type: "success" },
            ...prev,
          ]);
        }, 1200);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06080d] text-slate-200">
      <Navbar
        connectedAccount={currentAccount}
        onConnect={handleToggleRole}
        activeRole={role}
        onToggleRole={handleToggleRole}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 uppercase tracking-wider">
                GenLayer Intelligent Contract
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                StudioNet Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Milestone & SLA Escrow Control Plane
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Multi-validator AI consensus over live web evidence. Eliminates centralized escrow dispute intermediaries
              via decentralized Equivalence Principle adjudication.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0b1018] border border-white/[0.08] rounded-lg px-4 py-2 text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Locked Escrow</div>
              <div className="text-lg font-bold font-mono text-[#00f0ff]">{escrowState.escrowAmount} GEN</div>
            </div>
            <div className="bg-[#0b1018] border border-white/[0.08] rounded-lg px-4 py-2 text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Gas Model</div>
              <div className="text-lg font-bold font-mono text-emerald-400">0 GEN (Gasless)</div>
            </div>
          </div>
        </div>

        {/* Contract Registry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">
                  Active Arbiter Instance
                </span>
              </div>
              <div className="font-mono text-xs text-slate-200 font-semibold">{arbiterAddress}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(arbiterAddress, "arbiter")}
                className="p-1.5 rounded hover:bg-white/[0.06] text-slate-400 hover:text-white transition-all text-xs font-mono flex items-center gap-1"
                title="Copy Address"
              >
                {copiedAddress === "arbiter" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`https://explorer-studio.genlayer.com/address/${arbiterAddress}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded hover:bg-white/[0.06] text-[#00f0ff] hover:text-white transition-all"
                title="View on Explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">
                  Factory Registry Contract
                </span>
              </div>
              <div className="font-mono text-xs text-slate-200 font-semibold">{factoryAddress}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(factoryAddress, "factory")}
                className="p-1.5 rounded hover:bg-white/[0.06] text-slate-400 hover:text-white transition-all text-xs font-mono flex items-center gap-1"
                title="Copy Address"
              >
                {copiedAddress === "factory" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`https://explorer-studio.genlayer.com/address/${factoryAddress}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded hover:bg-white/[0.06] text-purple-400 hover:text-white transition-all"
                title="View on Explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Consensus Stage Visualizer */}
        <div className="glass-panel rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-[#00f0ff]" />
              <span>Consensus Resolution Pipeline (`run_nondet_unsafe`)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Equivalence Principle Quorum</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div
              className={`p-3 rounded-lg border text-xs font-mono space-y-1 transition-all ${
                activePipelineStep >= 1
                  ? "bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff]"
                  : "bg-[#0b1018] border-white/[0.06] text-slate-400"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Web Render</span>
                {activePipelineStep >= 1 && <CheckCircle2 className="w-3.5 h-3.5 text-[#00f0ff]" />}
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Validators fetch live target URL content via <code className="text-[10px]">web.render()</code>
              </p>
            </div>

            <div
              className={`p-3 rounded-lg border text-xs font-mono space-y-1 transition-all ${
                activePipelineStep >= 2
                  ? "bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff]"
                  : "bg-[#0b1018] border-white/[0.06] text-slate-400"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. AI Analysis</span>
                {activePipelineStep >= 2 && <CheckCircle2 className="w-3.5 h-3.5 text-[#00f0ff]" />}
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Each node evaluates evidence against binding criteria strings
              </p>
            </div>

            <div
              className={`p-3 rounded-lg border text-xs font-mono space-y-1 transition-all ${
                activePipelineStep >= 3
                  ? "bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff]"
                  : "bg-[#0b1018] border-white/[0.06] text-slate-400"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. Equiv Check</span>
                {activePipelineStep >= 3 && <CheckCircle2 className="w-3.5 h-3.5 text-[#00f0ff]" />}
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Substantive verdict match &amp; confidence tolerance window (&plusmn;15%)
              </p>
            </div>

            <div
              className={`p-3 rounded-lg border text-xs font-mono space-y-1 transition-all ${
                activePipelineStep >= 4
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-[#0b1018] border-white/[0.06] text-slate-400"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. Settlement</span>
                {activePipelineStep >= 4 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Autonomous release via <code className="text-[10px]">emit_transfer()</code>
              </p>
            </div>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Action Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-xl p-6 shadow-2xl space-y-6 border border-white/[0.08]">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("resolve")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      activeTab === "resolve"
                        ? "bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    3. AI Resolve Milestone
                  </button>
                  <button
                    onClick={() => setActiveTab("submit")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      activeTab === "submit"
                        ? "bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    2. Submit Evidence
                  </button>
                  <button
                    onClick={() => setActiveTab("fund")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      activeTab === "fund"
                        ? "bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    1. Fund Escrow
                  </button>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Step {activeTab === "fund" ? "1/3" : activeTab === "submit" ? "2/3" : "3/3"}</span>
              </div>

              {/* Tab 3: Resolve */}
              {activeTab === "resolve" && (
                <div className="space-y-4">
                  <div className="bg-[#0b1018] border border-white/[0.08] rounded-lg p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        Consensus Parameters
                      </span>
                      <span className="text-[11px] font-mono text-[#00f0ff]">Min Confidence: 70.00%</span>
                    </div>
                    <div className="text-xs text-slate-300 font-sans space-y-1">
                      <div>
                        <span className="text-slate-400 font-mono text-[11px] block">TARGET EVIDENCE ENDPOINT:</span>
                        <a
                          href={escrowState.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-[#00f0ff] hover:underline break-all inline-flex items-center gap-1 mt-0.5"
                        >
                          <Globe className="w-3 h-3" />
                          {escrowState.evidenceUrl}
                        </a>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => runAction("resolve")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0099ff] hover:from-[#33f3ff] hover:to-[#22aaff] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] disabled:opacity-50"
                  >
                    {txStep === "pending" || txStep === "signing" ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Adjudicating with Multi-Validator Nodes...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Execute resolve_milestone() Consensus</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tab 2: Submit */}
              {activeTab === "submit" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                      Contractor Deliverable / Evidence URL (HTTP/HTTPS)
                    </label>
                    <input
                      type="url"
                      value={evidenceInput}
                      onChange={(e) => setEvidenceInput(e.target.value)}
                      className="w-full bg-[#0b1018] border border-white/[0.08] focus:border-[#00f0ff] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <button
                    onClick={() => runAction("submit")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3 px-4 rounded-lg bg-[#00f0ff] hover:bg-[#33f3ff] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Register Deliverable URL</span>
                  </button>
                </div>
              )}

              {/* Tab 1: Fund */}
              {activeTab === "fund" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                      Deposit Amount (GEN Testnet Tokens)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-[#0b1018] border border-white/[0.08] focus:border-[#00f0ff] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={() => runAction("fund")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3 px-4 rounded-lg bg-[#00f0ff] hover:bg-[#33f3ff] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Call fund_escrow() with Payable Value</span>
                  </button>
                </div>
              )}

              {/* Activity Log */}
              <div className="border-t border-white/[0.08] pt-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <TerminalSquare className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>Consensus Execution Ledger</span>
                  </div>
                  <span>{txLog.length} Events</span>
                </div>
                <div className="bg-[#05070a] border border-white/[0.06] rounded-lg p-3 max-h-36 overflow-y-auto font-mono text-xs space-y-1.5">
                  {txLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-slate-600 text-[11px] select-none">[{log.time}]</span>
                      <span
                        className={
                          log.type === "success"
                            ? "text-emerald-400"
                            : log.type === "warn"
                            ? "text-amber-400"
                            : "text-slate-300"
                        }
                      >
                        {log.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right State Inspector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel-interactive rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00f0ff]" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    On-Chain Agreement State
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                    escrowState.status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-cyan-500/10 text-[#00f0ff] border border-cyan-500/30"
                  }`}
                >
                  {escrowState.status}
                </span>
              </div>

              <div className="space-y-3.5 font-mono text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5 uppercase tracking-wider">
                    Locked Balance
                  </span>
                  <span className="text-base font-bold text-[#00f0ff]">{escrowState.escrowAmount} GEN</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5 uppercase tracking-wider">
                    Contractor Address
                  </span>
                  <span className="text-slate-300 break-all text-[11px] bg-[#0b1018] px-2 py-1 rounded block border border-white/[0.06]">
                    {escrowState.contractor}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5 uppercase tracking-wider">
                    Binding Acceptance Criteria
                  </span>
                  <p className="text-slate-300 font-sans text-xs bg-[#0b1018] p-3 rounded border border-white/[0.06] leading-relaxed">
                    {escrowState.criteria}
                  </p>
                </div>

                <div className="border-t border-white/[0.08] pt-3">
                  <span className="text-slate-400 text-[11px] block mb-1 uppercase tracking-wider">
                    Consensus Verdict &amp; Confidence
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                      {escrowState.verdict}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Confidence: <strong className="text-slate-200">{escrowState.confidenceBps / 100}%</strong> (
                      {escrowState.confidenceBps} bps)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block mb-1 uppercase tracking-wider">
                    Validator Deliberation Reasoning
                  </span>
                  <p className="text-slate-300 font-sans text-xs bg-[#0b1018] p-3 rounded border border-white/[0.06] italic leading-relaxed">
                    &ldquo;{escrowState.reasoning}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] bg-[#05070a] py-6 text-center text-xs text-slate-500 font-mono">
        SLAEscrow Arbiter • Multi-Validator GenLayer Intelligent Contract • StudioNet Deployment
      </footer>
    </div>
  );
}
