// Lightweight localStorage-backed store for demo state.
// Keeps jobs, bids, and role state consistent across page navigation.

export type DemoJob = {
  id: string
  title: string
  desc: string
  category: string
  type: "public" | "private"
  globalDeadline: string
  tokenSymbol: string
  totalAmount: string
  status: "open" | "active" | "completed" | "disputed"
  creatorAddress: string
  workerAddress: string | null
  arbitratorWallet: string
  conditions: DemoCondition[]
  bids: DemoBid[]
  createdAt: string
}

export type DemoCondition = {
  title: string
  desc: string
  proofDesc: string
  proofType: string
  pct: number
  deadline: string
  autoApprove: boolean
  status: "pending" | "proof_submitted" | "approved" | "disputed"
  proofHash?: string
  proofNote?: string
}

export type DemoBid = {
  id: string
  bidderId: number
  bidderName: string
  bidderAvatar: string
  amount: string
  message: string
  status: "pending" | "accepted" | "rejected"
  submittedAt: string
}

const STORE_KEY = "b3trtrust_demo_store"

type Store = {
  jobs: DemoJob[]
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { jobs: seedJobs() }
}

function save(store: Store) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)) } catch { /* ignore */ }
}

// ── Seed data for fresh installs ──────────────────────────────────────────────

function seedJobs(): DemoJob[] {
  const now = new Date()
  const future = (days: number) => new Date(now.getTime() + days * 86400000).toISOString().slice(0, 10)

  return [
    {
      id: "j1",
      title: "DeFi Escrow Dashboard",
      desc: "Build a full-featured escrow dashboard for VeChain DeFi. React + TypeScript + VeChain SDK required.",
      category: "Development",
      type: "public",
      globalDeadline: future(45),
      tokenSymbol: "VET",
      totalAmount: "4200",
      status: "active",
      creatorAddress: "0xDEMO_CREATOR",
      workerAddress: "0xDEMO_WORKER",
      arbitratorWallet: "0x1a2b...3c4d",
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
      bids: [
        {
          id: "b1",
          bidderId: 1,
          bidderName: "Alex Turner",
          bidderAvatar: "/images/profile-art.webp",
          amount: "4200",
          message: "I have 5 years of DeFi experience and have built 3 similar dashboards. I can deliver within 6 weeks.",
          status: "accepted",
          submittedAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
        },
      ],
      conditions: [
        { title: "Project Setup & Architecture", desc: "Repo scaffold, tech stack, CI/CD pipeline", proofDesc: "GitHub repo link with README", proofType: "document", pct: 20, deadline: future(10), autoApprove: false, status: "approved", proofHash: "QmXyz123...abc" },
        { title: "Core Smart Contract Integration", desc: "VeChain SDK integration, wallet connect, transaction signing", proofDesc: "Video demo of working wallet connection", proofType: "document", pct: 30, deadline: future(25), autoApprove: false, status: "proof_submitted", proofHash: "QmAbc456...def", proofNote: "PR #14 merged — video attached" },
        { title: "Dashboard UI", desc: "Full dashboard UI with charts, escrow list, and detail views", proofDesc: "Live preview URL + screenshot", proofType: "image", pct: 30, deadline: future(35), autoApprove: false, status: "pending" },
        { title: "Testing & Documentation", desc: "Unit tests, integration tests, and user documentation", proofDesc: "Test report + docs link", proofType: "document", pct: 20, deadline: future(44), autoApprove: false, status: "pending" },
      ],
    },
    {
      id: "j2",
      title: "Smart Contract Security Audit",
      desc: "Full audit of our escrow smart contract. Looking for experienced Solidity auditors. Report required.",
      category: "Security",
      type: "public",
      globalDeadline: future(20),
      tokenSymbol: "VET",
      totalAmount: "1800",
      status: "active",
      creatorAddress: "0xDEMO_CREATOR",
      workerAddress: "0xDEMO_WORKER2",
      arbitratorWallet: "0x5e6f...7g8h",
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      bids: [
        { id: "b2", bidderId: 2, bidderName: "Maya Chen", bidderAvatar: "/images/profile-art.webp", amount: "1800", message: "CertiK-certified auditor. Can deliver full report in 2 weeks.", status: "accepted", submittedAt: new Date(now.getTime() - 2 * 86400000).toISOString() },
      ],
      conditions: [
        { title: "Initial Audit Report", desc: "Static analysis + manual review", proofDesc: "PDF audit report", proofType: "document", pct: 60, deadline: future(14), autoApprove: false, status: "pending" },
        { title: "Remediation Verification", desc: "Verify all critical/high issues fixed", proofDesc: "Updated report with fixes confirmed", proofType: "document", pct: 40, deadline: future(19), autoApprove: false, status: "pending" },
      ],
    },
    {
      id: "j3",
      title: "NFT Marketplace UI",
      desc: "Design and build a clean NFT marketplace UI. Figma designs provided. React + Tailwind.",
      category: "Design",
      type: "public",
      globalDeadline: future(30),
      tokenSymbol: "B3TR",
      totalAmount: "950",
      status: "completed",
      creatorAddress: "0xOTHER",
      workerAddress: "0xDEMO_WORKER",
      arbitratorWallet: "0x1a2b...3c4d",
      createdAt: new Date(now.getTime() - 20 * 86400000).toISOString(),
      bids: [],
      conditions: [
        { title: "Component Library", desc: "All reusable UI components", proofDesc: "Storybook link", proofType: "document", pct: 50, deadline: future(-5), autoApprove: false, status: "approved" },
        { title: "Final Marketplace UI", desc: "Fully integrated marketplace pages", proofDesc: "Live URL", proofType: "document", pct: 50, deadline: future(-1), autoApprove: false, status: "approved" },
      ],
    },
  ]
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getJobs(): DemoJob[] {
  return load().jobs
}

export function getJob(id: string): DemoJob | null {
  return load().jobs.find(j => j.id === id) ?? null
}

export function createJob(job: Omit<DemoJob, "id" | "createdAt" | "bids" | "status" | "workerAddress">): DemoJob {
  const store = load()
  const newJob: DemoJob = {
    ...job,
    id: `j${Date.now()}`,
    status: "open",
    workerAddress: null,
    bids: [],
    createdAt: new Date().toISOString(),
  }
  store.jobs.unshift(newJob)
  save(store)
  return newJob
}

export function addBid(jobId: string, bid: Omit<DemoBid, "id" | "submittedAt" | "status">): DemoBid {
  const store = load()
  const job = store.jobs.find(j => j.id === jobId)
  if (!job) throw new Error("Job not found")
  const newBid: DemoBid = {
    ...bid,
    id: `bid_${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  }
  job.bids.push(newBid)
  save(store)
  return newBid
}

export function acceptBid(jobId: string, bidId: string, workerAddress: string) {
  const store = load()
  const job = store.jobs.find(j => j.id === jobId)
  if (!job) return
  job.bids = job.bids.map(b => ({ ...b, status: b.id === bidId ? "accepted" : "rejected" }))
  job.workerAddress = workerAddress
  job.status = "active"
  save(store)
}

export function submitProof(jobId: string, conditionIdx: number, proofHash: string, proofNote: string) {
  const store = load()
  const job = store.jobs.find(j => j.id === jobId)
  if (!job) return
  job.conditions[conditionIdx] = { ...job.conditions[conditionIdx], status: "proof_submitted", proofHash, proofNote }
  save(store)
}

export function approveCondition(jobId: string, conditionIdx: number) {
  const store = load()
  const job = store.jobs.find(j => j.id === jobId)
  if (!job) return
  job.conditions[conditionIdx] = { ...job.conditions[conditionIdx], status: "approved" }
  const allDone = job.conditions.every(c => c.status === "approved")
  if (allDone) job.status = "completed"
  save(store)
}

export function disputeCondition(jobId: string, conditionIdx: number) {
  const store = load()
  const job = store.jobs.find(j => j.id === jobId)
  if (!job) return
  job.conditions[conditionIdx] = { ...job.conditions[conditionIdx], status: "disputed" }
  job.status = "disputed"
  save(store)
}

export function resetStore() {
  localStorage.removeItem(STORE_KEY)
}
