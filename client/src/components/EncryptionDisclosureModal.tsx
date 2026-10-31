// client/src/components/EncryptionDisclosureModal.tsx
// Transparent Privacy & Encryption Architecture Disclosure Modal
// Explains Client-Side Zero-Knowledge E2EE vs TLS Envelope Encryption at Rest

import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, KeyRound, Server, EyeOff, X, CheckCircle2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EncryptionDisclosureModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                EXAMVERSE Privacy & Encryption Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Transparent cryptographic disclosures & zero-knowledge guarantees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-slate-600 leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Important Loss Warning */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Zero-Knowledge Passphrase Warning</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your Doubt Notebook encryption key is derived entirely inside your browser using the <strong>WebCrypto API</strong>.
              EXAMVERSE servers and databases <strong>never see or store your passphrase</strong>.
              If you lose your passphrase, your encrypted notes <strong>cannot be recovered by any administrator or engineer</strong>.
            </p>
          </div>

          {/* Architecture Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zone 1: E2EE */}
            <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Lock className="w-5 h-5 text-emerald-600" />
                <span>Zone 1: Client E2EE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider block w-fit">
                Zero-Knowledge Encrypted
              </span>
              <ul className="space-y-2 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Student Doubt Notebook:</strong> Encrypted locally with AES-256-GCM before leaving browser.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Private Formulas & Revision Notes:</strong> Plaintext never exists on server disk.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Key Derivation:</strong> PBKDF2-HMAC-SHA256 with 100,000 iterations and 16-byte random salt.</span>
                </li>
              </ul>
            </div>

            {/* Zone 2: Transport TLS + Envelope Encryption at Rest */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <Server className="w-5 h-5 text-indigo-600" />
                <span>Zone 2: TLS + Envelope</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider block w-fit">
                Statutory At-Rest Protection
              </span>
              <ul className="space-y-2 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Student Profile & Domicile:</strong> AES-256-GCM envelope encryption at rest.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Searchable Blind Indexing:</strong> HMAC-SHA256 irreversible blind indexes for phone and state.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span><strong>CBT Telemetry & Scores:</strong> Stored under student profile tenant isolation with RLS policies.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cryptographic Primitives Checklist */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 space-y-2 font-mono text-[11px]">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Cryptographic Primitives In Use:
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>• Cipher: AES-256-GCM (Authenticated)</div>
              <div>• KDF: PBKDF2-HMAC-SHA256 (100k)</div>
              <div>• IV: 96-bit (12 bytes) Unique / Note</div>
              <div>• Salt: 128-bit (16 bytes) Cryptographic</div>
              <div>• Transport: TLS 1.3 Strict HTTPS</div>
              <div>• Hashing: SHA-256 Merkle Audit Chain</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            I Understand My Security Responsibilities
          </button>
        </div>
      </div>
    </div>
  );
};
