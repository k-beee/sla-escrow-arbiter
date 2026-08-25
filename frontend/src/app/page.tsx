"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  ShieldCheck,
  Send,
  Cpu,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCode2,
  Lock,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [account, setAccount] = useState<string>("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
  const [arbiterAddress] = useState<string>("0xC7e04361224f5d3336Ac3851F65E8f0d09C5B219");
  const [factoryAddress] = useState<string>("0x98216F20cb9C01d65fe9671F1C6ee19595F2711B");

  // Escrow state representation
  const [escrowState, setEscrowState] = useState({
    client: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    contractor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    escrowAmount: "1.00 GEN",
    criteria: "The pull request must pass all unit tests and contain complete documentation.",
    evidenceUrl: "https://github.com/torvalds/linux",
    status: "CLAIMED",
    verdict: "APPROVE",
    confidenceBps: "8850 (88.50%)",
    reasoning: "PR contains full test suite passing with 100% coverage and architectural specification.",
  });

  // Action states
  const [activeTab, setActiveTab] = useState<"fund" | "submit" | "resolve">("resolve");
  const [depositAmount, setDepositAmount] = useState("1.0");
  const [evidenceInput, setEvidenceInput] = useState("https://github.com/torvalds/linux");
  const [txStep, setTxStep] = useState<"idle" | "signing" | "pending" | "FINALIZED">("idle");
  const [txLog, setTxLog] = useState<string[]>([]);

  const handleConnect = () => {
    // Toggle accounts for demo testing
    if (account === "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4") {
      setAccount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    } else {
      setAccount("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
    }
  };

  const runAction = async (actionName: string) => {
    setTxStep("signing");
    setTxLog((prev) => [`[${new Date().toLocaleTimeString()}] Initiating ${actionName} transaction...`, ...prev]);

    setTimeout(() => {
      setTxStep("pending");
      setTxLog((prev) => [
        `[${new Date().toLocaleTimeString()}] Broadcasted to StudioNet. Multi-validator consensus running...`,
        ...prev,
      ]);

      setTimeout(() => {
        setTxStep("FINALIZED");
        setTxLog((prev) => [
          `[${new Date().toLocaleTimeString()}] Transaction FINALIZED on-chain. State committed!`,
          ...prev,
        ]);
        if (actionName === "resolve") {
          setEscrowState((prev) => ({ ...prev, status: "COMPLETED" }));
        } else if (actionName === "fund") {
          setEscrowState((prev) => ({ ...prev, status: "CLAIMED", escrowAmount: `${depositAmount} GEN` }));
        } else if (actionName === "submit") {
          setEscrowState((prev) => ({ ...prev, evidenceUrl: evidenceInput }));
        }
      }, 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b10]">
      <Navbar connectedAccount={account} onConnect={handleConnect} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Top Banner / Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0f141d] border border-[#202a3c] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00f0ff]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center space-x-3 text-gray-400 text-xs font-mono mb-2">
              <Lock className="w-4 h-4 text-[#00f0ff]" />
              <span>CORE ARBITER CONTRACT</span>
            </div>
            <div className="text-sm font-mono text-white truncate">{arbiterAddress}</div>
            <div className="mt-3 flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                StudioNet Verified
              </span>
              <a
                href={`https://explorer-studio.genlayer.com/address/${arbiterAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#00f0ff] hover:underline flex items-center"
              >
                Explorer <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          <div className="bg-[#0f141d] border border-[#202a3c] rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center space-x-3 text-gray-400 text-xs font-mono mb-2">
              <FileCode2 className="w-4 h-4 text-purple-400" />
              <span>FACTORY REGISTRY</span>
            </div>
            <div className="text-sm font-mono text-white truncate">{factoryAddress}</div>
            <div className="mt-3 flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Multi-Contract Indexed
              </span>
              <a
                href={`https://explorer-studio.genlayer.com/address/${factoryAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-purple-400 hover:underline flex items-center"
              >
                Explorer <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          <div className="bg-[#0f141d] border border-[#202a3c] rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center space-x-3 text-gray-400 text-xs font-mono mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>CONSENSUS ENGINE</span>
            </div>
            <div className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Equivalence Principle</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Live Web Fetch (<code className="text-[#00f0ff]">gl.nondet.web.render</code>) + Validator Consensus
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Action Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0f141d] border border-[#202a3c] rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#202a3c] pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab("resolve")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "resolve"
                        ? "bg-[#00f0ff] text-black shadow-lg shadow-[#00f0ff]/20 font-semibold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    3. AI Resolve Milestone
                  </button>
                  <button
                    onClick={() => setActiveTab("submit")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "submit"
                        ? "bg-[#00f0ff] text-black shadow-lg shadow-[#00f0ff]/20 font-semibold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    2. Submit Evidence
                  </button>
                  <button
                    onClick={() => setActiveTab("fund")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "fund"
                        ? "bg-[#00f0ff] text-black shadow-lg shadow-[#00f0ff]/20 font-semibold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    1. Fund Escrow
                  </button>
                </div>
                <div className="text-xs text-gray-400 font-mono">Status: {escrowState.status}</div>
              </div>

              {/* Tab: Resolve */}
              {activeTab === "resolve" && (
                <div className="space-y-4">
                  <div className="bg-[#151b27] border border-[#202a3c] rounded-lg p-4 space-y-2">
                    <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                      Validator Consensus Flow
                    </div>
                    <p className="text-sm text-gray-300">
                      Calling <code className="text-[#00f0ff]">resolve_milestone()</code> triggers independent GenLayer
                      nodes to render the live URL, test evidence against criteria, and agree on outcome.
                    </p>
                    <div className="text-xs font-mono bg-[#080b10] p-3 rounded border border-[#202a3c] text-gray-300">
                      Target: {escrowState.evidenceUrl || "No URL submitted yet"}
                    </div>
                  </div>

                  <button
                    onClick={() => runAction("resolve")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0088ff] hover:from-[#33f3ff] hover:to-[#1a94ff] text-black font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00f0ff]/25 disabled:opacity-50"
                  >
                    {txStep === "pending" || txStep === "signing" ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Running AI Consensus...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Trigger Equivalence Principle Consensus</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tab: Submit */}
              {activeTab === "submit" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      DELIVERABLE / REPOSITORY / API URL
                    </label>
                    <input
                      type="url"
                      value={evidenceInput}
                      onChange={(e) => setEvidenceInput(e.target.value)}
                      className="w-full bg-[#151b27] border border-[#202a3c] focus:border-[#00f0ff] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <button
                    onClick={() => runAction("submit")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3 px-4 rounded-lg bg-[#00f0ff] hover:bg-[#33f3ff] text-black font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00f0ff]/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Deliverable URL</span>
                  </button>
                </div>
              )}

              {/* Tab: Fund */}
              {activeTab === "fund" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">DEPOSIT VALUE (GEN)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-[#151b27] border border-[#202a3c] focus:border-[#00f0ff] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={() => runAction("fund")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3 px-4 rounded-lg bg-[#00f0ff] hover:bg-[#33f3ff] text-black font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00f0ff]/20"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Deposit & Lock Native GEN</span>
                  </button>
                </div>
              )}

              {/* Transaction State Machine Feed */}
              {txLog.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#202a3c] space-y-2">
                  <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
                    <span>TRANSACTION LIFECYCLE</span>
                    <span className="text-[#00f0ff] uppercase">{txStep}</span>
                  </div>
                  <div className="bg-[#080b10] border border-[#202a3c] rounded-lg p-3 max-h-32 overflow-y-auto font-mono text-xs text-gray-400 space-y-1">
                    {txLog.map((log, idx) => (
                      <div key={idx} className="text-emerald-400/90">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live State Inspector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f141d] border border-[#202a3c] rounded-xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#202a3c] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-[#00f0ff]" />
                  <span>On-Chain Escrow State</span>
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    escrowState.status === "COMPLETED"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  {escrowState.status}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Escrow Locked Balance:</span>
                  <span className="text-white font-bold text-sm text-[#00f0ff]">{escrowState.escrowAmount}</span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">Client (Deployer):</span>
                  <span className="text-gray-300 break-all">{escrowState.client}</span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">Contractor:</span>
                  <span className="text-gray-300 break-all">{escrowState.contractor}</span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">Acceptance Criteria:</span>
                  <p className="text-gray-300 font-sans text-xs bg-[#151b27] p-2.5 rounded border border-[#202a3c]">
                    {escrowState.criteria}
                  </p>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">Latest Consensus Verdict:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                      {escrowState.verdict}
                    </span>
                    <span className="text-gray-400 text-xs">Confidence: {escrowState.confidenceBps}</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">AI Reasoning Summary:</span>
                  <p className="text-gray-300 font-sans text-xs bg-[#151b27] p-2.5 rounded border border-[#202a3c] italic">
                    "{escrowState.reasoning}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#202a3c] bg-[#0f141d] py-6 text-center text-xs text-gray-500 font-mono">
        SLAEscrow Arbiter • Built for GenLayer StudioNet • Multi-Validator Trustless Consensus
      </footer>
    </div>
  );
}
