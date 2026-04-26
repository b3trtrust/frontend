import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Bg from "@/components/Bg"
import {
  ArrowLeft, LayoutDashboard, Briefcase, Shield, Users, Settings,
  Activity, DollarSign, TrendingUp, AlertTriangle, CheckCircle2,
  ChevronDown, ChevronUp, ExternalLink, Gavel,
  Flame, Slash, UserCheck, UserX, RefreshCw, Eye, Lock,
  BarChart3, Zap, BadgeCheck, Star,
} from "lucide-react"

const TABS = ["Overview", "Escrows", "Arbitrators", "Trust Team", "Settings", "On-Chain Log"] as const
type Tab = typeof TABS[number]

/* ── Mock data ───────────────────────────────────────────────── */
const PLATFORM_STATS = [
  { icon: Briefcase,   label: "Total Escrows",   value: "1,284",  sub: "+38 this week",   color: "text-orange-500" },
  { icon: DollarSign,  label: "Volume Locked",   value: "$4.2M",  sub: "in active vaults", color: "text-green-500"  },
  { icon: Shield,      label: "Active Disputes",  value: "17",     sub: "7 in Trust Team",  color: "text-amber-500"  },
  { icon: TrendingUp,  label: "Completion Rate",  value: "94.2%",  sub: "all-time avg",     color: "text-blue-500"   },
  { icon: Users,       label: "Registered Users", value: "8,941",  sub: "+120 this week",   color: "text-purple-500" },
  { icon: Activity,    label: "Platform Revenue", value: "$63.1K", sub: "fees collected",   color: "text-orange-500" },
]

const ESCROWS = [
  { id: "ESC-1042", title: "DeFi Dashboard – React Dev",   creator: "ChainLabs",   worker: "Alex Turner",  amount: "$3,200",  status: "active",    milestone: "2/3", date: "Apr 12, 2026" },
  { id: "ESC-1039", title: "Smart Contract Audit",         creator: "PixelDAO",    worker: "Dana Wei",     amount: "$1,800",  status: "dispute",   milestone: "1/2", date: "Apr 9, 2026"  },
  { id: "ESC-1031", title: "NFT Marketplace UI",           creator: "Metaworks",   worker: "Sam Osei",     amount: "$950",    status: "closed",    milestone: "3/3", date: "Mar 28, 2026" },
  { id: "ESC-1027", title: "DAO Governance Portal",        creator: "CryptoHive",  worker: "Alex Turner",  amount: "$2,100",  status: "active",    milestone: "1/4", date: "Mar 22, 2026" },
  { id: "ESC-1019", title: "Token Staking Frontend",       creator: "VeBlock Inc", worker: "Riya Patel",   amount: "$1,400",  status: "closed",    milestone: "2/2", date: "Mar 10, 2026" },
  { id: "ESC-1014", title: "Cross-Chain Bridge UI",        creator: "Nexus Labs",  worker: "James Folu",   amount: "$4,500",  status: "trust_team",milestone: "2/3", date: "Mar 5, 2026"  },
  { id: "ESC-1008", title: "Wallet SDK Integration",       creator: "VeForge",     worker: "Priya Singh",  amount: "$2,800",  status: "open",      milestone: "0/2", date: "Feb 28, 2026" },
]

const ARBITRATORS = [
  { id: "ARB-01", name: "Dana Wei",     specialty: "Smart Contracts",    cases: 32, active: 3, staked: "1,000 B3TR", rating: 4.9, status: "active",    joined: "Jan 2026" },
  { id: "ARB-02", name: "Marcus Vine",  specialty: "DeFi Protocols",      cases: 18, active: 1, staked: "1,000 B3TR", rating: 4.7, status: "active",    joined: "Feb 2026" },
  { id: "ARB-03", name: "Yuki Tanaka",  specialty: "NFT Disputes",        cases: 44, active: 5, staked: "1,000 B3TR", rating: 4.8, status: "active",    joined: "Dec 2025" },
  { id: "ARB-04", name: "Riya Patel",   specialty: "UI/UX Disputes",      cases: 9,  active: 2, staked: "1,000 B3TR", rating: 4.5, status: "pending",   joined: "Apr 2026" },
  { id: "ARB-05", name: "Sam Osei",     specialty: "Bridge Protocols",    cases: 26, active: 0, staked: "500 B3TR",   rating: 3.2, status: "slashed",   joined: "Nov 2025" },
]

const TRUST_MEMBERS = [
  { id: "TT-01", name: "Elena Frost",  address: "0xE1a2...F3b4", role: "Lead Arbitrator",   votes: 128, joined: "Oct 2025", active: true  },
  { id: "TT-02", name: "Marco Silva",  address: "0xM9k1...R7c2", role: "Protocol Analyst",   votes: 115, joined: "Nov 2025", active: true  },
  { id: "TT-03", name: "Aisha Kamau",  address: "0xA4d5...B8e9", role: "Smart Contract Eng", votes: 134, joined: "Oct 2025", active: true  },
  { id: "TT-04", name: "Liam Chen",    address: "0xL3f7...C2a1", role: "DeFi Specialist",    votes: 97,  joined: "Dec 2025", active: true  },
  { id: "TT-05", name: "Priya Singh",  address: "0xP6g8...D5b3", role: "Legal Analyst",      votes: 89,  joined: "Jan 2026", active: false },
]

const ONCHAIN_LOG = [
  { hash: "0x3fa1...2b9c", action: "EscrowFactory.createEscrow",       by: "ChainLabs",   block: "18,492,201", date: "Apr 12, 15:04" },
  { hash: "0x7dc2...8f1a", action: "ArbitratorRegistry.stakeAndRegister", by: "Riya Patel", block: "18,491,880", date: "Apr 12, 14:22" },
  { hash: "0x1be3...4c6d", action: "EscrowVault.raiseDispute",          by: "PixelDAO",    block: "18,491,320", date: "Apr 12, 13:11" },
  { hash: "0x9ad4...7e2f", action: "B3TRTrustTeam.castVote",            by: "Elena Frost", block: "18,490,910", date: "Apr 12, 12:48" },
  { hash: "0x5cf5...1a3b", action: "EscrowVault.approveCondition",      by: "Alex Turner", block: "18,490,205", date: "Apr 12, 11:30" },
  { hash: "0x2gb6...9d4e", action: "ArbitratorRegistry.slashStake",     by: "Trust Team",  block: "18,489,770", date: "Apr 12, 10:15" },
  { hash: "0x8hc7...3f5a", action: "EscrowFactory.closedEscrow",        by: "Metaworks",   block: "18,488,500", date: "Apr 11, 23:42" },
]

/* ── Status helpers ───────────────────────────────────────────── */
const escrowStatusStyle: Record<string, string> = {
  active:     "bg-blue-50 text-blue-700 border-blue-200",
  dispute:    "bg-red-50 text-red-700 border-red-200",
  closed:     "bg-gray-100 text-gray-500 border-gray-200",
  open:       "bg-amber-50 text-amber-700 border-amber-200",
  trust_team: "bg-purple-50 text-purple-700 border-purple-200",
}
const arbStatusStyle: Record<string, string> = {
  active:  "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  slashed: "bg-red-50 text-red-700 border-red-200",
}
const escrowStatusLabel: Record<string, string> = {
  active: "Active", dispute: "Dispute", closed: "Closed",
  open: "Open", trust_team: "Trust Team",
}

/* ── Subcomponents ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color }: typeof PLATFORM_STATS[number]) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-gray-50 border border-gray-100 ${color}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-[10px] text-gray-400">{sub}</p>
    </div>
  </div>
)

const SuperAdmin = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>("Overview")
  const [escrowFilter, setEscrowFilter] = useState("all")
  const [expandedEscrow, setExpandedEscrow] = useState<string | null>(null)
  const [expandedArb, setExpandedArb] = useState<string | null>(null)
  const [platformFee, setPlatformFee] = useState("1.5")
  const [arbFee, setArbFee] = useState("1.0")
  const [appealWindow, setAppealWindow] = useState("14")
  const [slashPct, setSlashPct] = useState("50")
  const [settingsSaved, setSettingsSaved] = useState(false)

  const filteredEscrows = escrowFilter === "all"
    ? ESCROWS
    : ESCROWS.filter(e => e.status === escrowFilter)

  const saveSettings = () => {
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2500)
  }

  return (
    <Bg image="/images/bg.png" className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-5">
          <ArrowLeft size={15} /> Back
        </button>

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100">
              <LayoutDashboard size={20} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Super Admin</h1>
              <p className="text-xs text-gray-400">Platform control panel · B3trTrust Protocol</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Live
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap bg-white/60 backdrop-blur border border-gray-100 rounded-2xl p-1 mb-4 w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "Overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PLATFORM_STATS.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Recent activity */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Activity size={14} className="text-orange-400" /> Recent Activity
              </h3>
              <div className="space-y-2">
                {ONCHAIN_LOG.slice(0, 4).map(l => (
                  <div key={l.hash} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors">
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                      <Zap size={13} className="text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium truncate">{l.action}</p>
                      <p className="text-[11px] text-gray-400">{l.by} · Block {l.block}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">{l.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick-glance dispute alerts */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={15} className="text-amber-600" />
                <h3 className="font-semibold text-amber-900 text-sm">Disputes Needing Attention</h3>
              </div>
              {ESCROWS.filter(e => e.status === "dispute" || e.status === "trust_team").map(e => (
                <div key={e.id} className="flex items-center justify-between py-2.5 border-b border-amber-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.title}</p>
                    <p className="text-[11px] text-gray-500">{e.id} · {e.amount}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${escrowStatusStyle[e.status]}`}>
                    {escrowStatusLabel[e.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ESCROWS ── */}
        {tab === "Escrows" && (
          <div className="space-y-3">
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {["all", "active", "open", "dispute", "trust_team", "closed"].map(f => (
                <button key={f} onClick={() => setEscrowFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors capitalize
                    ${escrowFilter === f ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500"}`}>
                  {f === "all" ? "All Escrows" : escrowStatusLabel[f]}
                </button>
              ))}
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 space-y-2">
              {filteredEscrows.map(e => (
                <div key={e.id}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors cursor-pointer"
                    onClick={() => setExpandedEscrow(expandedEscrow === e.id ? null : e.id)}>
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                      <Briefcase size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{e.title}</p>
                        <span className="text-[10px] text-gray-400 font-mono shrink-0">{e.id}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{e.creator} → {e.worker} · {e.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-gray-900">{e.amount}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${escrowStatusStyle[e.status]}`}>{escrowStatusLabel[e.status]}</span>
                      {expandedEscrow === e.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </div>

                  {expandedEscrow === e.id && (
                    <div className="mt-2 ml-4 mr-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        {[
                          { label: "Milestones", value: e.milestone },
                          { label: "Creator",    value: e.creator   },
                          { label: "Worker",     value: e.worker    },
                          { label: "Locked",     value: e.amount    },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3">
                            <p className="text-xs font-bold text-gray-900">{value}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs hover:border-orange-300 hover:text-orange-500 transition-colors">
                          <Eye size={12} /> View Escrow
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs hover:border-orange-300 hover:text-orange-500 transition-colors">
                          <ExternalLink size={12} /> On-Chain
                        </button>
                        {(e.status === "dispute" || e.status === "trust_team") && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs hover:bg-red-100 transition-colors">
                            <Gavel size={12} /> Intervene
                          </button>
                        )}
                        {e.status !== "closed" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs hover:border-red-300 hover:text-red-500 transition-colors">
                            <Lock size={12} /> Force Pause
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ARBITRATORS ── */}
        {tab === "Arbitrators" && (
          <div className="space-y-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Arbitrator Registry</h3>
                <span className="text-xs text-gray-400">{ARBITRATORS.length} registered</span>
              </div>
              {ARBITRATORS.map(a => (
                <div key={a.id}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors cursor-pointer"
                    onClick={() => setExpandedArb(expandedArb === a.id ? null : a.id)}>
                    <div className="h-9 w-9 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                      <Shield size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                        {a.status === "active" && <BadgeCheck size={13} className="text-orange-500" />}
                      </div>
                      <p className="text-[11px] text-gray-400">{a.specialty} · {a.cases} cases</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-0.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{a.rating}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${arbStatusStyle[a.status]}`}>{a.status}</span>
                      {expandedArb === a.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </div>

                  {expandedArb === a.id && (
                    <div className="mt-2 ml-4 mr-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        {[
                          { label: "Staked",       value: a.staked   },
                          { label: "Active Cases",  value: String(a.active)  },
                          { label: "Total Cases",   value: String(a.cases)   },
                          { label: "Joined",        value: a.joined   },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3">
                            <p className="text-xs font-bold text-gray-900">{value}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {a.status === "pending" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs hover:bg-green-100 transition-colors">
                            <UserCheck size={12} /> Approve
                          </button>
                        )}
                        {a.status === "pending" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs hover:bg-red-100 transition-colors">
                            <UserX size={12} /> Reject
                          </button>
                        )}
                        {a.status === "active" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs hover:border-orange-300 hover:text-orange-500 transition-colors">
                            <Eye size={12} /> View Profile
                          </button>
                        )}
                        {a.status !== "slashed" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs hover:bg-red-100 transition-colors">
                            <Slash size={12} /> Slash Stake
                          </button>
                        )}
                        {a.status === "slashed" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs hover:border-orange-300 hover:text-orange-500 transition-colors">
                            <RefreshCw size={12} /> Reinstate
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TRUST TEAM ── */}
        {tab === "Trust Team" && (
          <div className="space-y-3">
            {/* Info banner */}
            <div className="bg-purple-50 border border-purple-200 rounded-3xl p-4">
              <div className="flex items-start gap-3">
                <Shield size={15} className="text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-purple-900 mb-1">Trust Team — 3-of-5 Multisig</p>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    The Trust Team is the final appeals layer. All 5 members vote on escalated disputes; a 3-of-5 supermajority executes the on-chain resolution. Members are elected by B3TR governance holders.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 text-sm">Members</h3>
                <span className="text-xs text-gray-400">5 seats · 3 required</span>
              </div>
              {TRUST_MEMBERS.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-purple-100 transition-colors">
                  <div className="h-10 w-10 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center bg-purple-50 shrink-0">
                    <Shield size={16} className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                      {m.active
                        ? <span className="h-2 w-2 rounded-full bg-green-400" />
                        : <span className="h-2 w-2 rounded-full bg-gray-300" />}
                    </div>
                    <p className="text-[11px] text-gray-400">{m.role} · {m.address}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-gray-900">{m.votes} votes</p>
                    <p className="text-[10px] text-gray-400">joined {m.joined}</p>
                  </div>
                  <div className="flex gap-1.5 ml-2">
                    <button className="p-1.5 rounded-lg border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-400 transition-colors">
                      <UserX size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature threshold visual */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <BarChart3 size={14} className="text-orange-400" /> Current Signature State
              </h3>
              <div className="flex items-center gap-2 mb-2">
                {TRUST_MEMBERS.map((m, i) => (
                  <div key={m.id} className={`flex-1 h-10 rounded-xl flex items-center justify-center text-xs font-bold border
                    ${i < 3 ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                    {m.name.split(" ")[0]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">3 of 5 signatures collected · threshold met</p>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === "Settings" && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Settings size={14} className="text-orange-400" /> Platform Fee Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Platform Fee (%)",         value: platformFee,   set: setPlatformFee,   note: "Applied to escrow amount on creation"    },
                  { label: "Arbitrator Fee (%)",       value: arbFee,        set: setArbFee,        note: "Paid from loser's stake on ruling"        },
                  { label: "Appeal Window (days)",     value: appealWindow,  set: setAppealWindow,  note: "Days for Trust Team escalation"           },
                  { label: "Slash Percentage (%)",     value: slashPct,      set: setSlashPct,      note: "% of arbitrator stake slashed on penalty" },
                ].map(({ label, value, set, note }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                    <input type="number" value={value} onChange={e => set(e.target.value)} min="0" max="100" step="0.1"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300 bg-gray-50" />
                    <p className="text-[10px] text-gray-400 mt-1">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Shield size={14} className="text-orange-400" /> Protocol Parameters
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Arbitrator Stake Requirement", value: "1,000 B3TR", note: "Minimum B3TR staked to register"         },
                  { label: "Ruling Window",                value: "72 hours",   note: "Time for arbitrator to submit ruling"    },
                  { label: "Min Escrow Amount",            value: "$50",        note: "Minimum escrow value accepted"           },
                  { label: "Max Escrow Amount",            value: "$500,000",   note: "Maximum escrow value per contract"       },
                  { label: "Trust Team Threshold",         value: "3 of 5",     note: "Votes needed for multisig execution"     },
                ].map(({ label, value, note }) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-[10px] text-gray-400">{note}</p>
                    </div>
                    <span className="text-sm font-bold text-orange-500 shrink-0 ml-3">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={saveSettings}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
                  ${settingsSaved ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}>
                {settingsSaved ? <><CheckCircle2 size={14} /> Saved!</> : "Save Configuration"}
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:border-orange-300 hover:text-orange-500 transition-colors">
                <RefreshCw size={14} /> Reset Defaults
              </button>
            </div>
          </div>
        )}

        {/* ── ON-CHAIN LOG ── */}
        {tab === "On-Chain Log" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <Activity size={14} className="text-orange-400" /> Transaction Log
              </h3>
              <span className="text-xs text-gray-400">VeChain mainnet</span>
            </div>
            {ONCHAIN_LOG.map(l => (
              <div key={l.hash} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors">
                <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                  <Zap size={13} className="text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{l.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400">by {l.by}</span>
                    <span className="text-[11px] text-gray-300">·</span>
                    <span className="text-[11px] font-mono text-gray-400">Block {l.block}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-gray-400">{l.date}</span>
                  <button className="p-1.5 rounded-lg border border-gray-200 hover:border-orange-300 hover:text-orange-500 text-gray-400 transition-colors">
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Showing last 7 transactions</p>
              <button className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                <Flame size={11} /> Load More
              </button>
            </div>
          </div>
        )}

      </div>
    </Bg>
  )
}

export default SuperAdmin
