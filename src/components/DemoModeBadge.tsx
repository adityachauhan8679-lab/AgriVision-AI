import React from 'react';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  text?: string;
  subtext?: string;
}

export const DemoModeBadge: React.FC<Props> = ({
  text = 'DEMO MODE ACTIVE',
  subtext = 'Real-time IoT simulation & Sentinel-2 remote sensing algorithms enabled'
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium shadow-xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-semibold tracking-wider text-[10px] uppercase text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded">
        {text}
      </span>
      <span className="hidden sm:inline text-emerald-700 font-normal">
        {subtext}
      </span>
    </div>
  );
};
