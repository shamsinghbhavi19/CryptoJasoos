# CryptoJasoos — Blockchain Forensics & Crypto Transaction Investigation Platform

> **"Tracing Crypto Flows for Smarter Cyber Investigations."**  
> A professional digital-forensics investigation workstation engineered for cyber-crime units, AML/CFT compliance officers, and blockchain forensic analysts to trace cryptocurrency fund flows, evaluate explainable risk patterns, and manage investigation cases.

---

## 🏛️ System Architecture

CryptoJasoos is structured as a decoupled, modular full-stack application:

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, React Flow (graph visualization), Lucide icons.
- **Backend**: Node.js (v18+), Express.js REST API under `/api`.
- **Database & ODM**: MongoDB Atlas with Mongoose schemas (resilient in-memory fallback for local dev).
- **Blockchain Core**: Ethers.js v6 with Ethereum Mainnet provider resilience (Alchemy, Etherscan API, and public JSON-RPC nodes).
- **Explainable Risk Engine**: Transparent heuristic detection (Rapid Movement, Fan-Out, Fan-In, Multi-Hop Peeling, Circular Flow, Velocity Bursts, OFAC SDN / Mixer watchlists).
- **AI Forensic Copilot**: Google Gemini API (`gemini-1.5-flash`) with strictly grounded investigative safety prompts.
- **Security & Reliability**: Helmet, CORS restriction, Zod request validation, rate limiting, and centralized error logging.
- **Testing**: Automated test suite with Vitest and Supertest.

```
CryptoJasoos/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment, MongoDB, and Risk rule definitions
│   │   ├── controllers/    # Health, Case, Investigation, Flow, Risk, Alert, AI, Report
│   │   ├── middleware/     # Zod validation, error handler, rate limiters
│   │   ├── models/         # Mongoose models: Case, Investigation, Alert, Transaction
│   │   ├── routes/         # Express REST API routes mounted under /api
│   │   ├── services/       # Ethers.js provider, Normalizer, Risk engine, Graph service, Gemini
│   │   ├── utils/          # Address validators, Logger, Response formatters, Seed data
│   │   ├── app.js          # Express application setup
│   │   └── server.js       # Server bootstrap with graceful shutdown
│   ├── tests/              # Automated Vitest + Supertest integration tests
│   ├── .env.example        # Backend environment template
│   └── package.json        # Backend dependencies & test scripts
├── src/                    # Frontend React source code
│   ├── components/         # Top navbar, 3D Canvas hero, Stat cards, Drawers, Modals
│   ├── pages/              # Dashboard, Cases, WalletAnalyzer, WalletProfile, Alerts, AI, Reports
│   ├── services/           # api.ts (HTTP client) & blockchainService.ts (API integration + fallback)
│   └── types/              # Forensic TypeScript interfaces
├── package.json            # Root scripts for frontend and backend
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Optional: MongoDB Atlas account, Alchemy API key, Google Gemini API key

---

### 2. Run the Backend API

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (already executed)
npm install

# Configure environment variables
cp .env.example .env

# Run automated backend test suite
npm test

# Start the backend server
npm start
# or for live reload during development:
npm run dev
```

The backend starts at: **`http://localhost:5000`**  
Verify health check: **`http://localhost:5000/api/health`**

---

### 3. Run the Frontend

In a separate terminal at the project root:

```bash
# From root directory
npm run dev
```

The frontend launches at: **`http://localhost:3000`** (or next available port).

---

## 🔑 Environment Configuration (`backend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Backend port | `5000` |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
| `FRONTEND_URL` | Allowed origin for CORS | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/cryptojasoos?retryWrites=true&w=majority` |
| `DEFAULT_NETWORK` | Default blockchain network | `homestead` (Ethereum Mainnet) |
| `ALCHEMY_API_KEY` | Alchemy Ethereum API key | *(Optional: connects to public JSON-RPC if omitted)* |
| `ETHERSCAN_API_KEY` | Etherscan API key for account tx history | *(Optional: documents data limitations if omitted)* |
| `GEMINI_API_KEY` | Google Gemini AI key for investigation summaries | *(Optional: rule engine works 100% without it)* |

### How to Obtain Credentials:
1. **MongoDB Atlas**:
   - Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
   - Under Database Access, create a database user and copy the connection string.
2. **Alchemy API Key**:
   - Sign up at [alchemy.com](https://www.alchemy.com/), create an app on **Ethereum Mainnet**, and copy the API Key.
3. **Etherscan API Key**:
   - Create a free account at [etherscan.io/myapikey](https://etherscan.io/myapikey) to index historical wallet transactions.
4. **Google Gemini API Key**:
   - Generate a key at [aistudio.google.com](https://aistudio.google.com/).

---

## 📡 REST API Reference (`/api`)

All responses return standard structured JSON:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2026-10-15T16:00:00.000Z"
}
```

### 1. Health & Status
- **`GET /api/health`**: Returns API operational state, database status, blockchain provider, and AI configuration.

### 2. Wallet & Transaction Investigation
- **`POST /api/investigations/wallet`**:
  - Request body: `{ "address": "0x82A7656EC7ab88b098defB751B7401B5f6d8976F", "limit": 25 }`
  - Returns on-chain balance, transaction history, explainable risk score (0-100), triggered risk indicators, and data limitations disclaimer.
- **`GET /api/investigations/wallet/:address`**: Retrieve wallet dossier by address.
- **`GET /api/wallets/:address/transactions`**: Retrieve available transactions for an address.
- **`POST /api/investigations/transaction`**:
  - Request body: `{ "hash": "0x9a8f3b..." }`
  - Returns on-chain confirmation status, value, sender, recipient, and counterparty categorization.
- **`GET /api/transactions/:hash`**: Retrieve transaction details by hash.

### 3. Fund Flow Explorer (React Flow Graph)
- **`GET /api/flow?address=0x82A...&hops=3`**: Returns graph-ready `nodes` and directed `edges` with values and risk color styles.

### 4. Explainable Risk Analysis
- **`POST /api/risk/analyze`**:
  - Request body: `{ "address": "0x...", "transactions": [...] }`
  - Returns transparent rule evaluations:
    - `Rapid Fund Movement`: forwarded in < 15 min.
    - `Fan-Out Distribution`: 1 address to ≥ 4 outputs.
    - `Fan-In Consolidation`: ≥ 4 inputs to 1 destination.
    - `Multi-Hop Peeling`: continuous flow across ≥ 3 hops.
    - `Circular Fund Movement`: looped back to originator.
    - `Unusual Transaction Velocity`: burst frequency.
    - `OFAC SDN / Sanctions Co-Location`: verified registry match.

### 5. Investigation Cases
- **`GET /api/cases`**: List cases with pagination, filters (`?risk=high&status=ACTIVE&search=0x82...`), and summary counts.
- **`GET /api/cases/:id`**: Retrieve case details.
- **`POST /api/cases`**: Create a new case (`title`, `targetAddress`, `network`, `priority`, `notes`).
- **`PATCH /api/cases/:id`**: Update case status (`ACTIVE`, `UNDER REVIEW`, `CLOSED`) or notes.

### 6. Security Alerts
- **`GET /api/alerts`**: List alerts with severity (`low`, `medium`, `high`, `critical`) and status filters.
- **`PATCH /api/alerts/:id`**: Update alert status (`investigating`, `resolved`).

### 7. AI Forensic Copilot
- **`POST /api/ai/summarize/:investigationId`**: Synthesizes structured, evidence-grounded investigation findings using Gemini.
- **`POST /api/ai/ask`**: Answers investigator queries grounded in verified evidence.

### 8. FinCEN SAR & Forensic Reports
- **`GET /api/reports/:investigationId`**: Returns structured FinCEN SAR Form 111 dossier.
- **`GET /api/reports/:investigationId/export?format=json`**: Download JSON SAR report attachment.
- **`GET /api/reports/:investigationId/export?format=text`**: Download printable legal text dossier.

### 9. Macro Forensic Analytics
- **`GET /api/analytics`**: Aggregate volume, alert velocity, risk band distribution, and top monitored addresses.

---

## 🧪 Automated Testing

Execute the automated test suite covering all critical logic, address validation, failure fallbacks, and risk rules:

```bash
cd backend
npm test
```

Test Suites Included:
- `health.test.js`: Server health and provider status.
- `validation.test.js`: Zod input validation (invalid addresses, malformed hashes).
- `riskEngine.test.js`: Rapid movement, fan-out, circular flow, missing data handling, and normalizer.
- `cases.test.js`: Case creation, pagination, and status patching.
- `alerts.test.js`: Alert status lifecycle transitions.
- `investigations.test.js`: Wallet & Tx audit, React Flow graph builder, and SAR export.
- `gemini.test.js`: Missing API key handling and copilot queries.

---

## 🌐 Deploying to Production

### 1. Deploying the Backend (Render / Railway / AWS / Heroku)
1. Push your repository to GitHub.
2. In [Render](https://render.com) or [Railway](https://railway.app), create a new **Web Service**.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `node src/server.js`.
6. Add environment variables:
   - `MONGODB_URI`: your production MongoDB Atlas cluster URI
   - `FRONTEND_URL`: your deployed frontend URL (e.g., `https://crypto-jasoos.vercel.app`)
   - `ALCHEMY_API_KEY`: your Alchemy production key
   - `ETHERSCAN_API_KEY`: your Etherscan key
   - `GEMINI_API_KEY`: your Google Gemini key

### 2. Connecting Vercel Frontend to Deployed Backend
1. In your Vercel project settings (`Project Settings` ➔ `Environment Variables`), add:
   ```
   VITE_API_BASE_URL = https://your-backend-api.onrender.com/api
   ```
2. Trigger a redeploy on Vercel. The frontend will automatically route all requests to your live production backend API!

---

## ⚖️ Forensic Disclaimer & Data Limitations
- **Investigative Indicators vs. Proof**: Heuristic scores and risk indicators are investigative leads to assist qualified human examiners. They do not constitute mathematical certainty or proof of fraud.
- **No Decryption of Hashes**: Cryptographic transaction hashes cannot be reversed or decrypted to identify real-world identities without lawful subpoena or verified VASP KYC off-ramp attribution.
- **Node Lookback Limits**: Standard JSON-RPC nodes do not index full historical transaction lists by account. For complete historical lineage, configure an `ETHERSCAN_API_KEY` or `ALCHEMY_API_KEY`.