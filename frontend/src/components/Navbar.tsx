"use client";

import React, { useState } from "react";
import { Shield, ExternalLink, Wallet, CheckCircle2 } from "lucide-react";

export function Navbar({ connectedAccount, onConnect }: { connectedAccount: string | null; onConnect: () => void }) {
  return (
    <header className="border-b border-[#202a3c] bg-[#0f141d]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#0077ff] flex items-center justify-center shadow-lg shadow-[#00f0ff]/20">
            <Shield className="w-6 h-6 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wide text-white">SLAEscrow</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#202a3c] text-[#00f0ff] font-mono border border-[#00f0ff]/30">
                StudioNet
              </span>
            </div>
            <p className="text-xs text-gray-400">GenLayer Multi-Validator Milestone Arbiter</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://explorer-studio.genlayer.com/address/0xC7e04361224f5d3336Ac3851F65E8f0d09C5B219"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center space-x-1.5 text-xs text-gray-400 hover:text-[#00f0ff] transition-colors"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onConnect}
            className="flex items-center space-x-2 bg-[#1c2433] hover:bg-[#253043] border border-[#202a3c] hover:border-[#00f0ff]/50 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Wallet className="w-4 h-4 text-[#00f0ff]" />
            <span>
              {connectedAccount
                ? `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`
                : "Connect Wallet"}
            </span>
            {connectedAccount && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
