import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AddressCopyProps {
  address: string;
  truncate?: boolean;
  linkToProfile?: boolean;
  className?: string;
}

export const AddressCopy: React.FC<AddressCopyProps> = ({
  address,
  truncate = true,
  linkToProfile = true,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const formattedAddress = truncate
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-slate-300 ${className}`}>
      {linkToProfile ? (
        <Link
          to={`/wallet/${encodeURIComponent(address)}`}
          className="hover:text-cyber-blue hover:underline transition-colors flex items-center gap-1"
          title={`View Profile: ${address}`}
        >
          <span>{formattedAddress}</span>
          <ExternalLink className="w-3 h-3 opacity-60 hover:opacity-100" />
        </Link>
      ) : (
        <span>{formattedAddress}</span>
      )}
      <button
        onClick={handleCopy}
        className="p-1 text-slate-400 hover:text-slate-200 hover:bg-navy-800 rounded transition-colors"
        title="Copy address to clipboard"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </span>
  );
};
