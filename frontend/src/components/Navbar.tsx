"use client";

import React from "react";
import { Shield, ExternalLink, Wallet, CheckCircle2, GitBranch, Terminal } from "lucide-react";

interface NavbarProps {
  connectedAccount: string | null;
  onConnect: () => void;
  activeRole: "client" | "contractor";
  onToggleRole: () => void;
}

export function Navbar({ connectedAccount, onConnect, activeRole, onToggleRole }: NavbarProps) {
  return (
    <header className="border-b border-white/[0.08] bg-[#06080d]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-[#0d1522] border border-[#00f0ff]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Shield className="w-5 h-5 text-[#00f0ff]" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#06080d] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wider text-white uppercase font-mono">
                SLA<span className="text-[#00f0ff]">Escrow</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0f172a] text-[#00f0ff] font-mono border border-[#00f0ff]/30 tracking-tight">
                STUDIONET
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-tight flex items-center gap-1">
              <Terminal className="w-3 h-3 text-[#00f0ff]" />
              <span>Multi-Validator AI Arbiter</span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-3">
          {/* Role switcher toggle */}
          <div className="hidden sm:flex items-center bg-[#0d1420] p-1 rounded-lg border border-white/[0.08] text-xs font-mono">
            <button
              onClick={onToggleRole}
              className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeRole === "client"
                  ? "bg-[#00f0ff] text-black font-semibold shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>Client Mode</span>
            </button>
            <button
              onClick={onToggleRole}
              className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeRole === "contractor"
                  ? "bg-[#00f0ff] text-black font-semibold shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>Contractor Mode</span>
            </button>
          </div>

          <a
            href="https://github.com/k-beee/sla-escrow-arbiter"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center space-x-1 text-xs text-gray-400 hover:text-[#00f0ff] font-mono px-2.5 py-1.5 rounded border border-transparent hover:border-white/[0.08] transition-all"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <a
            href="https://explorer-studio.genlayer.com/address/0xC7e04361224f5d3336Ac3851F65E8f0d09C5B219"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center space-x-1 text-xs text-gray-400 hover:text-[#00f0ff] font-mono px-2.5 py-1.5 rounded border border-transparent hover:border-white/[0.08] transition-all"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Wallet button */}
          <button
            onClick={onConnect}
            className="flex items-center space-x-2 bg-[#0e1626] hover:bg-[#152238] border border-[#00f0ff]/30 hover:border-[#00f0ff]/60 px-3.5 py-1.5 rounded-lg text-xs font-mono text-white transition-all shadow-[0_0_12px_rgba(0,240,255,0.08)]"
          >
            <Wallet className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>
              {connectedAccount
                ? `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`
                : "Connect Wallet"}
            </span>
            {connectedAccount && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
