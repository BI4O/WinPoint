'use client';

import { Wallet } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function BalanceDisplay() {
  const { earnings, rwa } = useStore(state => state.user);

  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-md-surface-container/80 backdrop-blur-sm rounded-full border border-md-outline-variant/20">
      <Wallet className="w-5 h-5 text-md-primary" />
      <div className="flex items-center gap-4 font-mono text-sm">
        <span className="text-md-on-surface">
          <span className="text-md-on-surface-variant">USDT:</span>{' '}
          <span className="font-semibold">{earnings.toFixed(4)}</span>
        </span>
        <span className="text-md-outline-variant">|</span>
        <span className="text-md-on-surface">
          <span className="text-md-on-surface-variant">RWA:</span>{' '}
          <span className="font-semibold">{rwa.toFixed(4)}</span>
        </span>
      </div>
    </div>
  );
}
