import { JsonRpcProvider, formatEther, isAddress } from 'ethers';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { DOCUMENTED_RISK_REGISTRY } from '../config/riskRules.js';

class BlockchainProviderService {
  constructor() {
    this.provider = null;
    this.initProvider();
  }

  initProvider() {
    try {
      if (config.alchemyApiKey) {
        this.provider = new JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`);
        logger.info('[BlockchainProvider] Configured with Alchemy Provider');
      } else {
        // Public resilient Ethereum RPC
        this.provider = new JsonRpcProvider('https://cloudflare-eth.com');
        logger.info('[BlockchainProvider] Configured with Public Ethereum JSON-RPC');
      }
    } catch (err) {
      logger.error(`[BlockchainProvider] Initialization error: ${err.message}`);
    }
  }

  async getWalletBalance(address) {
    if (!isAddress(address)) {
      throw new Error(`Invalid Ethereum address: ${address}`);
    }

    try {
      const balanceWei = await this.provider.getBalance(address);
      const ethBalance = formatEther(balanceWei);
      const ethPriceUSD = 2600; // Benchmark reference price for USD estimation
      const valueUSD = Math.round(parseFloat(ethBalance) * ethPriceUSD);

      return {
        balanceWei: balanceWei.toString(),
        balanceEth: parseFloat(ethBalance),
        valueUSD,
        provider: config.alchemyApiKey ? 'Alchemy' : 'Ethereum Public RPC'
      };
    } catch (err) {
      logger.warn(`[BlockchainProvider] getWalletBalance failed for ${address}: ${err.message}`);
      // Fallback for demo addresses if offline/limited
      const clean = address.toLowerCase();
      if (DOCUMENTED_RISK_REGISTRY[clean]) {
        return {
          balanceWei: '3500000000000000000',
          balanceEth: 3.5,
          valueUSD: 9100,
          provider: 'Simulated Demo Registry'
        };
      }
      throw new Error(`Failed to retrieve on-chain balance: ${err.message}`);
    }
  }

  async getTransactionDetails(txHash) {
    try {
      const [tx, receipt] = await Promise.all([
        this.provider.getTransaction(txHash),
        this.provider.getTransactionReceipt(txHash)
      ]);

      if (!tx) {
        return null;
      }

      const ethPriceUSD = 2600;
      const amountCrypto = parseFloat(formatEther(tx.value || 0));

      return {
        hash: tx.hash,
        fromAddress: tx.from,
        toAddress: tx.to || '0x0000000000000000000000000000000000000000 (Contract Creation)',
        blockNumber: tx.blockNumber,
        amountCrypto,
        symbol: 'ETH',
        amountUSD: Math.round(amountCrypto * ethPriceUSD),
        gasLimit: tx.gasLimit?.toString(),
        gasUsed: receipt?.gasUsed?.toString() || '0',
        status: receipt ? (receipt.status === 1 ? 'Confirmed' : 'Failed') : 'Pending',
        timestamp: new Date().toISOString(),
        network: 'Ethereum Mainnet'
      };
    } catch (err) {
      logger.warn(`[BlockchainProvider] getTransactionDetails failed for ${txHash}: ${err.message}`);
      throw new Error(`Failed to retrieve on-chain transaction: ${err.message}`);
    }
  }

  async getWalletTransactions(address, limit = 25) {
    if (!isAddress(address)) {
      throw new Error(`Invalid Ethereum address: ${address}`);
    }

    // If Etherscan API key is provided, query account txlist
    if (config.etherscanApiKey) {
      try {
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${config.etherscanApiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === '1' && Array.isArray(data.result)) {
          const ethPriceUSD = 2600;
          return {
            transactions: data.result.map((tx) => {
              const amountCrypto = parseFloat(formatEther(tx.value || 0));
              return {
                hash: tx.hash,
                chain: 'ETH',
                fromAddress: tx.from,
                toAddress: tx.to,
                amountCrypto,
                symbol: 'ETH',
                amountUSD: Math.round(amountCrypto * ethPriceUSD),
                blockNumber: parseInt(tx.blockNumber, 10),
                timestamp: new Date(parseInt(tx.timeStamp, 10) * 1000).toISOString(),
                gasUsed: tx.gasUsed,
                status: tx.isError === '0' ? 'Confirmed' : 'Failed'
              };
            }),
            completeness: 'complete',
            provider: 'Etherscan API'
          };
        }
      } catch (err) {
        logger.warn(`[BlockchainProvider] Etherscan query failed: ${err.message}`);
      }
    }

    // When no indexing API key is provided, standard JSON-RPC nodes cannot reverse-index account txlist.
    // Transparently return data limitation status.
    return {
      transactions: [],
      completeness: 'rpc_limited',
      limitations: 'Historical account transactions require Etherscan or Alchemy Transfers API key. Standard JSON-RPC does not index transaction history by address.',
      provider: config.alchemyApiKey ? 'Alchemy' : 'Ethereum Public RPC'
    };
  }
}

export const blockchainProvider = new BlockchainProviderService();
