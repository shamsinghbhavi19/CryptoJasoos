import { isAddress } from 'ethers';

export const isValidEthAddress = (address) => {
  if (typeof address !== 'string') return false;
  const clean = address.trim();
  // Validates standard 42-char hex Ethereum addresses (case-insensitive) as well as Bitcoin/Multi-chain addresses
  return (
    isAddress(clean.toLowerCase()) ||
    /^0x[0-9a-fA-F]{40}$/.test(clean) ||
    /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(clean)
  );
};

export const isValidTxHash = (hash) => {
  if (typeof hash !== 'string') return false;
  return /^0x([A-Fa-f0-9]{64})$/.test(hash.trim());
};

export const normalizeAddress = (address) => {
  if (!address || typeof address !== 'string') return '';
  return address.trim().toLowerCase();
};

export const normalizeTxHash = (hash) => {
  if (!hash || typeof hash !== 'string') return '';
  return hash.trim().toLowerCase();
};
