# B3trTrust

A decentralised freelance escrow platform built on VeChain. Clients post jobs, workers bid, funds are locked on-chain, and milestone-based payments are released only when verifiable proof is submitted and approved. Disputes are resolved by staked arbitrators, with a Trust Team multisig as the final backstop.

---

## What it does

| Role | What they can do |
|---|---|
| **Client (Creator)** | Post a job, set milestones with proof requirements, lock funds, accept a bid, approve/dispute milestone deliveries |
| **Worker** | Browse jobs, place bids, submit proof of work per milestone, receive payments on approval |
| **Arbitrator** | Register with a 1,000 B3TR stake, receive assigned disputes, issue rulings within 72 hours |
| **Trust Team** | Review appeals via 3-of-5 multisig, overturn/uphold arbitrator rulings, slash arbitrator stakes |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Wallet | VeChain DAppKit v2 (`@vechain/dapp-kit-react`) |
| Chain | VeChain (testnet during development) |
| State | localStorage-backed demo store (no backend required to run) |
| Database | PostgreSQL (Docker, for future backend integration) |
| Icons | Lucide React |

---

## Project structure

```
B3trTrust/
├── docker-compose.yml          # PostgreSQL + Node dev containers
└── frontend/
    ├── src/
    │   ├── App.tsx             # Route definitions
    │   ├── main.tsx            # DAppKitProvider setup
    │   ├── context/
    │   │   └── WalletContext.tsx    # Wallet + profile state (bridges DAppKit → app)
    │   ├── store/
    │   │   └── demoStore.ts        # localStorage store for jobs, bids, milestones
    │   ├── pages/
    │   │   ├── general/
    │   │   │   ├── Home.tsx
    │   │   │   ├── Jobs.tsx            # Job marketplace with filters
    │   │   │   ├── Bidders.tsx         # Worker directory
    │   │   │   ├── Arbitrators.tsx     # Arbitrator directory
    │   │   │   ├── EscrowDetail.tsx    # Per-job view (role-gated)
    │   │   │   ├── CreateEscrow.tsx    # 5-step job creation wizard
    │   │   │   ├── ManageEscrow.tsx    # Active escrow management
    │   │   │   ├── BidderProfile.tsx
    │   │   │   ├── ArbitratorProfile.tsx
    │   │   │   └── PublicProfile.tsx
    │   │   └── admin/
    │   │       ├── Dashboard.tsx       # User dashboard (role-gated tabs)
    │   │       ├── RegisterBidder.tsx  # Worker registration flow
    │   │       ├── RegisterArbitrator.tsx
    │   │       └── SuperAdmin.tsx      # Platform admin panel
    │   ├── components/
    │   │   ├── Nav.tsx
    │   │   ├── shared/
    │   │   │   ├── OnboardingModal.tsx  # First-connect username + avatar setup
    │   │   │   └── ProfileMenu.tsx
    │   │   ├── jobs/
    │   │   ├── bidders/
    │   │   └── arbitrators/
    │   └── types/
    │       ├── job.ts
    │       ├── bidder.ts
    │       └── arbitrator.ts
    ├── vite.config.ts
    └── package.json
```

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+
- A VeChain wallet — [VeWorld browser extension](https://www.veworld.net/) (Chrome/Firefox) recommended

### Run locally

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5174` in your browser.

> **Port note:** If port 5174 is taken, edit `server.port` in `vite.config.ts`.

### Build for production

```bash
npm run build
```

Output goes to `frontend/dist/`.

### Run with Docker (database only)

```bash
docker-compose up -d database
```

This starts a PostgreSQL instance on port 5432. The frontend still runs natively — Docker is only needed if you add a backend API.

---

## Connecting a wallet

The app uses [VeChain DAppKit](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit) to connect wallets. Supported sources:

- **VeWorld** (browser extension) — recommended for development
- **Sync2** (desktop app) — requires Sync2 running locally

The app connects to **VeChain testnet** (`https://testnet.vechain.org`). Switch your VeWorld extension to **TestNet** before connecting.

On first connect, an onboarding modal prompts for a username and profile photo. This profile is stored in `localStorage` keyed by wallet address.

---

## Demo flows

Everything below works in the browser without a backend.

### Post a job
1. Connect wallet → complete onboarding
2. Click **Post a Job** (nav or dashboard)
3. Complete the 5-step wizard: job type → details → milestones → arbitrator → fund & lock
4. Lands on the escrow detail page as the creator

### Bid on a job
1. Connect wallet
2. Browse **Jobs** → open any public escrow
3. Fill in the bid form in the sidebar → **Submit Bid**
4. Bid appears in the Bids tab

### Accept a bid & manage milestones
1. As the job creator, open the escrow → **Bids** tab
2. Click **Accept Bid** → job status moves to `active`
3. As the accepted worker, open **Conditions** tab → submit proof per milestone
4. As creator, review submitted proof → **Approve & Release** or **Raise Dispute**

### Register as a worker
1. Dashboard → **Worker** tab → **Register as Worker**
2. Complete the 4-step form
3. Dashboard Worker tab now shows your active profile

### Register as an arbitrator
1. Dashboard → **Arbitrator** tab → **Register as Arbitrator**
2. Complete the 4-step form
3. Dashboard **Arbitrations** tab unlocks — assigned cases appear here

### Raise and rule on a dispute
1. Creator raises a dispute on a milestone → escrow status changes to `disputed`
2. Arbitrator opens Dashboard → Arbitrations tab → expands the case
3. Writes a ruling → **Approve** or **Reject**

---

## Key design decisions

**Role-based access control**
`EscrowDetail` derives a `ViewerRole` (`creator | worker | visitor`) by comparing the connected wallet address against the escrow's `creatorAddress` and `workerAddress`. The Conditions tab is only rendered for the creator and accepted worker — visitors cannot see it at all.

**WalletContext adapter layer**
DAppKit owns the raw wallet state (address, connection). `WalletContext` wraps it and adds the app-level profile (username, avatar, roles) from localStorage. Components consume `useWallet()` and never call DAppKit hooks directly.

**Demo store**
`src/store/demoStore.ts` is a localStorage-backed store that seeds realistic escrow data on first load. All mutations (create job, add bid, accept bid, submit proof, approve, dispute) persist across page navigation. Replacing it with real API calls is the main step to move from demo to production.

**Node polyfills**
VeChain's SDK requires Node.js globals (`Buffer`, `process`) in the browser. These are provided by `vite-plugin-node-polyfills` in `vite.config.ts`.

---

## Environment notes

| Setting | Value |
|---|---|
| VeChain node | `https://testnet.vechain.org` |
| WalletConnect | Disabled (requires a real project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)) |
| DAppKit v2Api | `{ enabled: false }` |
| Allowed wallets | VeWorld, Sync2 |

To switch to mainnet, update `VECHAIN_NODE` in `src/main.tsx` to `https://mainnet.vechain.org` and change VeWorld's network setting to **MainNet**.

---

## Roadmap

- [ ] Smart contracts — escrow vault + factory on VeChain (Solidity / Vyper)
- [ ] Backend API — Express or FastAPI, connecting to PostgreSQL
- [ ] Real file uploads — IPFS via Pinata for proof documents
- [ ] On-chain milestone approval — replace localStorage approvals with contract calls
- [ ] WalletConnect support — add a real project ID
- [ ] Arbitrator staking — 1,000 B3TR stake on registration
- [ ] Trust Team multisig — on-chain 3-of-5 governance
- [ ] Notifications — email or push on bid accepted, proof submitted, dispute raised

---

## License

MIT