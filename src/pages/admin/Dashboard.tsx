import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Bg from "@/components/Bg"
import Logo from "@/components/Logo"
import { useWallet } from "@/context/WalletContext"
import { getJobs, type DemoJob } from "@/store/demoStore"
import {
  LayoutDashboard, Briefcase, Gavel, Users, Bell, Settings,
  LogOut, Star, Coins, CheckCircle2, Clock, ChevronRight,
  TrendingUp, Shield, Plus, ExternalLink, AlertCircle,
  TriangleAlert, FileText, Eye, ThumbsUp, ThumbsDown, XCircle, Lock,
} from "lucide-react"

const tabs = [
  { id: "overview",    label: "Overview",    icon: LayoutDashboard },
  { id: "jobs",        label: "My Jobs",     icon: Briefcase       },
  { id: "arbitrations",label: "Arbitrations",icon: Gavel           },
  { id: "trust-team",  label: "Trust Team",  icon: Shield          },
  { id: "worker",      label: "Worker",      icon: Users           },
  { id: "arbitrator",  label: "Arbitrator",  icon: Gavel           },
  { id: "settings",    label: "Settings",    icon: Settings        },
]

const stats = [
  { label: "Active Jobs",    value: "4",    icon: Briefcase,    color: "text-blue-500",   bg: "bg-blue-50"   },
  { label: "Total Earned",   value: "$3.2k",icon: Coins,        color: "text-green-500",  bg: "bg-green-50"  },
  { label: "Rating",         value: "4.8",  icon: Star,         color: "text-amber-500",  bg: "bg-amber-50"  },
  { label: "Completed",      value: "27",   icon: CheckCircle2, color: "text-orange-500", bg: "bg-orange-50" },
]


const ARBITRATION_CASES = [
  { id: "a1", title: "Disputed: Smart Contract Delivery",     escrow: "DeFi Escrow Dashboard", status: "ruling_pending",   deadline: "72h remaining", amount: "$1,680", party: "Creator vs Worker"  },
  { id: "a2", title: "Disputed: UI Integration Milestone",    escrow: "NFT Marketplace UI",    status: "ruled",            deadline: "Ruled May 9",   amount: "$380",   party: "Creator vs Worker"  },
  { id: "a3", title: "Disputed: API Endpoint Docs",           escrow: "API Documentation",     status: "appeal_window",    deadline: "9 days left",   amount: "$300",   party: "Creator vs Worker"  },
]

const TRUST_TEAM_APPEALS = [
  { id: "t1", title: "Appeal: UI Integration Ruling",     from: "PixelDAO",   reason: "Arbitrator approved without reviewing the full proof set.", status: "open",     filed: "May 15, 2026", deadline: "May 29, 2026" },
  { id: "t2", title: "Appeal: Smart Contract Rejection",  from: "Alex Turner",reason: "Ruling was inconsistent with the submitted proof hash.",    status: "reviewing",filed: "Apr 30, 2026", deadline: "May 14, 2026" },
]

const arbStatusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  ruling_pending: { label: "Ruling Pending", color: "text-amber-600 bg-amber-50 border-amber-200",   icon: Clock        },
  ruled:          { label: "Ruled",          color: "text-green-600 bg-green-50 border-green-200",   icon: CheckCircle2 },
  appeal_window:  { label: "Appeal Window",  color: "text-blue-600 bg-blue-50 border-blue-200",      icon: AlertCircle  },
}

const recentActivity = [
  { text: "Bid accepted on 'React DeFi Dashboard'",     time: "2m ago",   type: "success" },
  { text: "Payment released for 'Smart Contract Audit'",time: "1h ago",   type: "success" },
  { text: "New message from ChainLabs",                 time: "3h ago",   type: "info"    },
  { text: "Dispute opened on 'UI Design Project'",      time: "Yesterday", type: "warning" },
]

const typeColor: Record<string, string> = {
  success: "bg-green-400", info: "bg-blue-400", warning: "bg-amber-400",
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const navigate = useNavigate()
  const { user } = useWallet()
  const [myJobs, setMyJobs] = useState<DemoJob[]>([])

  const isArbitrator  = user?.roles.arbitrator === "active"
  const isTrustTeam   = user?.roles.trustTeam === true
  const isWorker      = user?.roles.worker === "active"

  useEffect(() => {
    const all = getJobs()
    const addr = user?.address ?? ""
    setMyJobs(all.filter(j => j.creatorAddress === addr || j.workerAddress === addr))
  }, [user?.address, activeTab])

  return (
    <Bg image="/images/bg.png" className="min-h-screen">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-white/80 backdrop-blur-xl border-r border-orange-100 flex flex-col">
          <div className="p-6 border-b border-orange-100 flex items-center justify-between">
            <Logo />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Dashboard</p>
          </div>

          {/* Profile strip */}
          <div className="px-4 py-3 border-b border-orange-100 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden border border-orange-100 shrink-0">
              <img src={user?.avatar ?? "/images/profile-art.webp"} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{user?.username ?? "Anonymous"}</p>
              <p className="text-[11px] text-gray-400 truncate font-mono">
                {user ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : "Not connected"}
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
            {tabs.map(({ id, label, icon: Icon }) => {
              const locked =
                (id === "arbitrations" && !isArbitrator) ||
                (id === "trust-team"   && !isTrustTeam)
              return (
                <button key={id}
                  onClick={() => !locked && setActiveTab(id)}
                  title={locked ? (id === "arbitrations" ? "Only approved arbitrators can access this" : "Only Trust Team members can access this") : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left w-full
                    ${locked ? "text-gray-300 cursor-not-allowed" : activeTab === id ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"}`}>
                  <Icon size={15} />
                  {label}
                  {locked && <Lock size={11} className="ml-auto text-gray-300" />}
                  {!locked && id === "arbitrations" && isArbitrator && <span className="ml-auto text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold">1</span>}
                  {!locked && activeTab === id && id !== "arbitrations" && <ChevronRight size={13} className="ml-auto" />}
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-orange-100 space-y-2">
            <button onClick={() => navigate("/escrow/create")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
              <Plus size={15} /> Post a Job
            </button>
            <button onClick={() => navigate("/")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/70 backdrop-blur-xl border-b border-orange-100 px-8 py-4 flex items-center justify-between shrink-0">
            <div>
              <h1 className="font-bold text-gray-900 capitalize">{tabs.find(t => t.id === activeTab)?.label}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Welcome back, {user?.username ?? "there"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl border border-orange-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors">
                <Bell size={17} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500" />
              </button>
              <button onClick={() => navigate("/escrow/create")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
                <Plus size={15} /> Post a Job
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "overview"     && <OverviewTab navigate={navigate} />}
            {activeTab === "jobs"         && <JobsTab jobs={myJobs} navigate={navigate} />}
            {activeTab === "arbitrations" && (isArbitrator ? <ArbitrationsTab cases={ARBITRATION_CASES} /> : <LockedTab title="Arbitrations" reason="This tab is only available to approved arbitrators. Register as an arbitrator and get approved to access your assigned cases." cta="Register as Arbitrator" onCta={() => navigate("/register/arbitrator")} />)}
            {activeTab === "trust-team"   && (isTrustTeam  ? <TrustTeamTab appeals={TRUST_TEAM_APPEALS} /> : <LockedTab title="Trust Team" reason="The Trust Team tab is restricted to elected Trust Team members only. Membership is granted by B3TR governance vote." />)}
            {activeTab === "worker"       && <WorkerTab navigate={navigate} isWorker={isWorker} />}
            {activeTab === "arbitrator"   && <ArbitratorTab navigate={navigate} isArbitrator={isArbitrator} />}
            {activeTab === "settings"     && <SettingsTab />}
          </div>
        </div>
      </div>
    </Bg>
  )
}

/* ── OVERVIEW ── */
const OverviewTab = ({ navigate }: { navigate: ReturnType<typeof useNavigate> }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className={`${bg} p-2.5 rounded-xl`}><Icon size={18} className={color} /></div>
          <div><p className="font-bold text-lg text-gray-900">{value}</p><p className="text-xs text-gray-400">{label}</p></div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm"><TrendingUp size={15} className="text-orange-400" />Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${typeColor[a.type]}`} />
              <div><p className="text-sm text-gray-700">{a.text}</p><p className="text-[11px] text-gray-400 mt-0.5">{a.time}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Quick Actions</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: "Post a New Job",          icon: Plus,      action: () => navigate("/escrow/create")  },
            { label: "Browse Open Jobs",         icon: Briefcase, action: () => navigate("/jobs")          },
            { label: "Find an Arbitrator",       icon: Gavel,     action: () => navigate("/arbitrators")   },
            { label: "Browse Bidders",           icon: Users,     action: () => navigate("/bidders")       },
          ].map(({ label, icon: Icon, action }) => (
            <button key={label} onClick={action}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 text-sm text-gray-700 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50 transition-colors text-left">
              <Icon size={14} className="text-orange-400" />{label}
              <ChevronRight size={13} className="ml-auto text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)

/* ── MY JOBS ── */
const JobsTab = ({ jobs, navigate }: { jobs: DemoJob[]; navigate: ReturnType<typeof useNavigate> }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-semibold text-gray-900 text-sm">All Escrows</h3>
      <button onClick={() => navigate("/escrow/create")} className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
        <Plus size={14} /> New Job
      </button>
    </div>
    {jobs.length === 0 && (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
        No jobs yet. <button onClick={() => navigate("/escrow/create")} className="text-orange-500 underline">Post your first job</button> or <button onClick={() => navigate("/jobs")} className="text-orange-500 underline">browse open jobs</button> to bid.
      </div>
    )}
    {jobs.map(job => {
      const approvedPct = job.conditions.filter(c => c.status === "approved").reduce((s, c) => s + c.pct, 0)
      return (
        <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-orange-100 transition-colors">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl border shrink-0 ${job.status === "completed" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
              {job.status === "completed" ? <CheckCircle2 size={14} className="text-green-500" /> : <Clock size={14} className="text-blue-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{job.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 capitalize">{job.status} · {job.tokenSymbol} {Number(job.totalAmount).toLocaleString()}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize shrink-0 ${
                  job.status === "completed" ? "bg-green-50 border-green-200 text-green-600"
                  : job.status === "disputed" ? "bg-red-50 border-red-200 text-red-600"
                  : job.status === "active" ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-gray-50 border-gray-200 text-gray-500"
                }`}>{job.status}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Progress</span><span>{approvedPct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${job.status === "completed" ? "bg-green-400" : "bg-orange-400"}`} style={{ width: `${approvedPct}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => navigate(`/jobs/${job.id}`)}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:border-orange-300 hover:text-orange-600 transition-colors flex items-center justify-center gap-1.5">
              <Eye size={12} /> View Escrow
            </button>
            <button onClick={() => navigate(`/escrow/${job.id}/manage`)} className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors">
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )
    })}
  </div>
)

/* ── ARBITRATIONS ── */
const ArbitrationsTab = ({ cases }: { cases: typeof ARBITRATION_CASES }) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [ruling, setRuling] = useState("")

  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <TriangleAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Active Dispute Requires Your Ruling</p>
          <p className="text-xs text-amber-600 mt-0.5">You have 1 case awaiting a ruling. Arbitrators have 72 hours to rule once assigned.</p>
        </div>
      </div>

      {cases.map(c => {
        const cfg = arbStatusConfig[c.status]
        const open = selected === c.id
        return (
          <div key={c.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${open ? "border-orange-200" : "border-gray-100"}`}>
            <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setSelected(open ? null : c.id)}>
              <div className={`p-2 rounded-xl border shrink-0 ${cfg.color}`}><cfg.icon size={13} /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{c.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{c.escrow} · {c.party}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm text-gray-900">{c.amount}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
              </div>
            </button>

            {open && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400 uppercase tracking-widest">Deadline</p><p className="font-medium text-gray-800 mt-0.5">{c.deadline}</p></div>
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400 uppercase tracking-widest">Amount at Stake</p><p className="font-medium text-gray-800 mt-0.5">{c.amount}</p></div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Proof Submitted</p>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
                    <FileText size={12} className="text-orange-400" />
                    <span className="text-xs font-mono text-orange-600 truncate flex-1">QmXyz...proof123</span>
                    <button className="text-gray-400 hover:text-orange-500 transition-colors"><ExternalLink size={11} /></button>
                  </div>
                </div>

                {c.status === "ruling_pending" && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Your Ruling</p>
                      <textarea rows={3} value={ruling} onChange={e => setRuling(e.target.value)}
                        placeholder="Provide a clear, evidence-based reason for your ruling. This is recorded on-chain."
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition" />
                    </div>
                    <div className="flex gap-2">
                      <button disabled={!ruling} className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                        <ThumbsUp size={12} /> Approve — Release Payment
                      </button>
                      <button disabled={!ruling} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                        <ThumbsDown size={12} /> Reject — Refund Creator
                      </button>
                    </div>
                  </div>
                )}

                {c.status === "ruled" && (
                  <div className="flex items-center gap-2 bg-green-50 rounded-xl border border-green-200 px-4 py-3">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span className="text-sm text-green-700 font-medium">Ruling submitted · Payment released · 14-day appeal window open</span>
                  </div>
                )}

                {c.status === "appeal_window" && (
                  <div className="flex items-center gap-2 bg-blue-50 rounded-xl border border-blue-200 px-4 py-3">
                    <AlertCircle size={14} className="text-blue-500" />
                    <span className="text-sm text-blue-700 font-medium">Appeal window open · Trust Team may review this ruling</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── TRUST TEAM ── */
const TrustTeamTab = ({ appeals }: { appeals: typeof TRUST_TEAM_APPEALS }) => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
        <Shield size={16} className="text-purple-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-800">Trust Team Appeals Queue</p>
          <p className="text-xs text-purple-600 mt-0.5">The Trust Team is a 3-of-5 multi-sig. Actions execute once 3 members sign. All decisions are recorded on-chain.</p>
        </div>
      </div>

      {appeals.map(a => {
        const open = selected === a.id
        return (
          <div key={a.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${open ? "border-purple-200" : "border-gray-100"}`}>
            <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setSelected(open ? null : a.id)}>
              <div className={`p-2 rounded-xl border shrink-0 ${a.status === "open" ? "bg-amber-50 border-amber-200" : "bg-purple-50 border-purple-200"}`}>
                {a.status === "open" ? <AlertCircle size={13} className="text-amber-600" /> : <Eye size={13} className="text-purple-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{a.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Filed by {a.from} · {a.filed}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border shrink-0 capitalize ${a.status === "open" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-purple-50 border-purple-200 text-purple-600"}`}>{a.status}</span>
            </button>

            {open && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Appeal Reason</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{a.reason}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400">Filed</p><p className="font-medium text-gray-800">{a.filed}</p></div>
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400">Deadline</p><p className="font-medium text-gray-800">{a.deadline}</p></div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Trust Team Actions</p>
                  <p className="text-xs text-gray-500 mb-3">Propose an action below. It executes automatically once 3 of 5 members sign.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Uphold Arbitrator",  icon: ThumbsUp,   cls: "border-green-200 text-green-700 hover:bg-green-50"  },
                      { label: "Overturn Ruling",     icon: ThumbsDown, cls: "border-red-200 text-red-700 hover:bg-red-50"        },
                      { label: "Partial Payment",     icon: Coins,      cls: "border-blue-200 text-blue-700 hover:bg-blue-50"     },
                      { label: "Slash Arbitrator",    icon: XCircle,    cls: "border-amber-200 text-amber-700 hover:bg-amber-50"  },
                    ].map(({ label, icon: Icon, cls }) => (
                      <button key={label} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${cls}`}>
                        <Icon size={12} />{label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Signatures</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${n <= 1 ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 text-gray-300"}`}>
                        {n <= 1 ? "✓" : n}
                      </div>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">1/3 needed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── LOCKED TAB ── */
const LockedTab = ({ title, reason, cta, onCta }: { title: string; reason: string; cta?: string; onCta?: () => void }) => (
  <div className="max-w-md mx-auto mt-8 text-center space-y-4">
    <div className="flex items-center justify-center">
      <div className="p-5 rounded-2xl bg-gray-100 border border-gray-200">
        <Lock size={28} className="text-gray-400" />
      </div>
    </div>
    <h3 className="font-bold text-gray-800 text-lg">{title} — Restricted</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{reason}</p>
    {cta && onCta && (
      <button onClick={onCta}
        className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
        {cta}
      </button>
    )}
  </div>
)

/* ── WORKER TAB ── */
const WorkerTab = ({ navigate, isWorker }: { navigate: ReturnType<typeof useNavigate>; isWorker: boolean }) => (
  <div className="max-w-xl space-y-4">
    {isWorker ? (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-orange-50 rounded-xl"><Users size={18} className="text-orange-500" /></div>
            <div><h3 className="font-semibold text-gray-900">Worker Profile</h3><p className="text-xs text-gray-400">You are registered as a worker</p></div>
            <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["4.8", "Rating"], ["27", "Jobs Done"], ["96%", "Completion"]].map(([val, lbl]) => (
              <div key={lbl} className="flex flex-col items-center bg-gray-50 rounded-xl py-2.5">
                <p className="font-bold text-sm text-gray-900">{val}</p>
                <p className="text-[10px] text-gray-400">{lbl}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["React", "TypeScript", "Solidity", "VeChain SDK"].map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{s}</span>
            ))}
          </div>
        </div>
        <button onClick={() => navigate("/register/bidder")}
          className="w-full py-2.5 rounded-xl border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors">
          Update Worker Profile
        </button>
      </>
    ) : (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gray-50 rounded-xl"><Users size={18} className="text-gray-400" /></div>
            <div><h3 className="font-semibold text-gray-900">Worker Profile</h3><p className="text-xs text-gray-400">Not yet registered</p></div>
            <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">Inactive</span>
          </div>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            Register as a worker to bid on jobs. Add your skills, hourly rate, and portfolio to be discoverable by job creators.
          </p>
        </div>
        <button onClick={() => navigate("/register/bidder")}
          className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
          Register as Worker
        </button>
      </>
    )}
  </div>
)

/* ── ARBITRATOR TAB ── */
const ArbitratorTab = ({ navigate, isArbitrator }: { navigate: ReturnType<typeof useNavigate>; isArbitrator: boolean }) => (
  <div className="max-w-xl space-y-4">
    {isArbitrator ? (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-50 rounded-xl"><Shield size={18} className="text-purple-500" /></div>
            <div><h3 className="font-semibold text-gray-900">Arbitrator Profile</h3><p className="text-xs text-gray-400">You are a verified arbitrator</p></div>
            <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["4.9", "Rating"], ["32", "Cases"], ["96%", "Success"]].map(([val, lbl]) => (
              <div key={lbl} className="flex flex-col items-center bg-gray-50 rounded-xl py-2.5">
                <p className="font-bold text-sm text-gray-900">{val}</p>
                <p className="text-[10px] text-gray-400">{lbl}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 border border-gray-100">
            1,000 B3TR staked · 72hr ruling window · 1% fee per case
          </div>
        </div>
        <button onClick={() => navigate("/register/arbitrator")}
          className="w-full py-2.5 rounded-xl border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors">
          Update Arbitrator Profile
        </button>
      </>
    ) : (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gray-50 rounded-xl"><Shield size={18} className="text-gray-400" /></div>
            <div><h3 className="font-semibold text-gray-900">Arbitrator Profile</h3><p className="text-xs text-gray-400">Not yet registered</p></div>
            <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">Inactive</span>
          </div>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            Register as an arbitrator to resolve disputes. Stake 1,000 B3TR as security. Earn 1% of each dispute value you rule on.
          </p>
        </div>
        <button onClick={() => navigate("/register/arbitrator")}
          className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
          Register as Arbitrator
        </button>
      </>
    )}
  </div>
)

/* ── SETTINGS ── */
const SettingsTab = () => (
  <div className="max-w-lg bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
    <h3 className="font-semibold text-gray-900">Account Settings</h3>
    {[["Full Name", "Jane Doe"], ["Email", "jane@b3trtrust.io"], ["Wallet Address", "0x1a2b...3c4d"]].map(([label, val]) => (
      <div key={label}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1.5">{label}</label>
        <input defaultValue={val} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition" />
      </div>
    ))}
    <button className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">Save Changes</button>
  </div>
)

export default Dashboard
