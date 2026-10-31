// client/src/components/AntiScamBanner.tsx
// Statutory Anti-Scam & Official Domain Verification Banner
// Warns students to verify official domains and confirms EXAMVERSE never collects fees.

import React from 'react';
import { ShieldAlert, ExternalLink, CheckCircle } from 'lucide-react';
import { LanguageCode, getTranslation } from '../services/i18n';

interface AntiScamBannerProps {
  language?: LanguageCode;
  officialDomain?: string;
}

export const AntiScamBanner: React.FC<AntiScamBannerProps> = ({
  language = 'en',
  officialDomain
}) => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-950 font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Official Verification Notice:</strong> {getTranslation(language, 'antiScamWarning')}
          </span>
        </div>

        {officialDomain ? (
          <div className="flex items-center space-x-1.5 bg-amber-100/80 px-2.5 py-0.5 rounded text-[11px] font-semibold text-amber-900 border border-amber-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Verified Board Domain: <strong>{officialDomain}</strong></span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-[11px] text-amber-800">
            <span className="font-semibold">Allowlisted Domains:</span>
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-[10px] font-bold">.gov.in</code>
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-[10px] font-bold">.nic.in</code>
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-[10px] font-bold">.ac.in</code>
          </div>
        )}
      </div>
    </div>
  );
};
