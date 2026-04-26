import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Bg from "@/components/Bg"
import {
  ArrowLeft, Shield, Clock, Coins, CheckCircle2, Circle, AlertCircle,
  ChevronDown, ChevronUp, FileText, Eye, ThumbsUp, ThumbsDown,
  ExternalLink, Upload, MessageSquare, Gavel, TriangleAlert, Lock, XCircle,
} from "lucide-react"

type CondStatus = "approved" | "pending" | "in_progress" | "disputed" | "trust_team_review" | "rejected"

type Condition = {
  id: string
  title: string
  pct: number
  deadline: string
  status: CondStatus
  desc: string
  proof?: { type: string; cid: string; submittedAt: string }
  arbitratorRuling?: string
}

const CONDITIONS: Condition[] = [
  {
    id: "c1", title: "Project Kickoff & Setup", pct: 20, deadline: "May 10, 2026", status: "approved",
    desc: "Repository setup, initial architecture doc, and dev environment ready for review.",
    proof: { type: "document", cid: "QmXyz...abc", submittedAt: "May 9, 2026" },
  },
  {
    id: "c2", title: "Core Smart Contract Development", pct: 40, deadline: "May 25, 2026", status: "disputed",
    desc: "Escrow vault and factory contracts with 95%+ test coverage. Hardhat test suite passing.",
    proof: { type: "hash", cid: "0xabc123...def456", submittedAt: "May 24, 2026" },
    arbitratorRuling: undefined,
  },
  {
    id: "c3", title: "Frontend Integration & UI", pct: 25, deadline: "Jun 10, 2026", status: "in_progress",
    desc: "React frontend connected to deployed testnet contracts. All core flows functional.",
  },
  {
    id: "c4", title: "Audit & Final Delivery", pct: 15, deadline: "Jun 20, 2026", status: "pending",
    desc: "Audit report delivered, all critical/high findings resolved. Final handoff docs submitted.",
  },
]

const statusConfig: Record<CondStatus, { label: string; color: string; bg: string; icon: typeof Circle }> = {
  approved:          { label: "Approved",      color: "text-green-600",  bg: "bg-green-50 border-green-200",   icon: CheckCircle2 },
  pending:           { label: "Pending",       color: "text-gray-500",   bg: "bg-gray-50 border-gray-200",     icon: Circle       },
  in_progress:       { label: "In Progress",   color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",     icon: Clock        },
  disputed:          { label: "Disputed",      color: "text-red-600",    bg: "bg-red-50 border-red-200",       icon: AlertCircle  },
  trust_team_review: { label: "Trust Review",  color: "text-purple-600", bg: "bg-purple-50 border-purple-200", icon: Shield       },
  rejected:          { label: "Rejected",      color: "text-red-600",    bg: "bg-red-50 border-red-200",       icon: XCircle      },
}

const ManageEscrow = () => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | null>("c2")
  const [disputeReason, setDisputeReason] = useState("")
  const [appealReason, setAppealReason] = useState("")
  const [showAppeal, setShowAppeal] = useState(false)

  const totalFunded = 4200
  const released = totalFunded * 0.20
  const locked = totalFunded - released

  return (
    <Bg image="/images/bg.png" className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Back */}
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-5">
          <ArrowLeft size={15} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600">Web3 Development</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600">Active</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">Senior React Developer for DeFi Escrow Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">With <span className="font-medium text-gray-700">Alex Turner</span> · Started May 8, 2026</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Stat icon={Coins} label="Total" value={`$${totalFunded.toLocaleString()}`} color="text-orange-500" />
              <Stat icon={Lock} label="Locked" value={`$${locked.toLocaleString()}`} color="text-gray-500" />
              <Stat icon={CheckCircle2} label="Released" value={`$${released.toLocaleString()}`} color="text-green-500" />
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span className="font-medium text-gray-700">Overall Progress</span>
              <span>20% complete · Milestone 1 of 4 done</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-orange-400 to-amber-400 rounded-full" style={{ width: "20%" }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Conditions */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-semibold text-gray-900 px-1">Milestones</h2>
            {CONDITIONS.map((c, i) => {
              const cfg = statusConfig[c.status]
              const open = expanded === c.id
              return (
                <div key={c.id} className={`bg-white/80 backdrop-blur-xl rounded-3xl border shadow-sm overflow-hidden ${open ? "border-orange-200" : "border-gray-100"}`}>
                  <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setExpanded(open ? null : c.id)}>
                    <div className={`p-2 rounded-xl border shrink-0 ${cfg.bg}`}><cfg.icon size={14} className={cfg.color} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{i + 1}. {c.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Due {c.deadline} · {c.pct}% · ${(totalFunded * c.pct / 100).toLocaleString()}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border shrink-0 ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    {open ? <ChevronUp size={15} className="text-gray-400 shrink-0" /> : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
                  </button>

                  {open && (
                    <div className="border-t border-gray-100 px-4 pb-4 pt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Condition</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{c.desc}</p>
                      </div>

                      {/* Proof submitted */}
                      {c.proof && (
                        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FileText size={13} className="text-orange-400" />
                              <p className="text-sm font-semibold text-gray-800">Proof Submitted</p>
                            </div>
                            <span className="text-[11px] text-gray-400">{c.proof.submittedAt}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
                            <span className="text-xs font-medium text-gray-600 capitalize">{c.proof.type}:</span>
                            <span className="text-xs text-orange-600 font-mono truncate flex-1">{c.proof.cid}</span>
                            <button className="shrink-0 text-gray-400 hover:text-orange-500 transition-colors"><ExternalLink size={12} /></button>
                          </div>

                          {/* Approve / Dispute actions (creator view) */}
                          {c.status === "in_progress" && (
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                                <ThumbsUp size={12} /> Approve & Release ${(totalFunded * c.pct / 100).toLocaleString()}
                              </button>
                              <button className="flex-1 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                                <ThumbsDown size={12} /> Dispute
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Dispute active */}
                      {c.status === "disputed" && (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-red-800">Dispute Open</p>
                              <p className="text-xs text-red-600 mt-0.5">Arbitrator Jane Doe has been notified and has 72 hours to rule from May 25, 2026.</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Your dispute reason</p>
                            <textarea rows={2} value={disputeReason} onChange={e => setDisputeReason(e.target.value)}
                              placeholder="Describe why you are disputing this proof submission..."
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition resize-none" />
                            <button className="mt-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
                              <Gavel size={12} /> Submit Dispute to Arbitrator
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Upload proof (bidder view) */}
                      {(c.status === "pending" || c.status === "in_progress") && !c.proof && (
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center hover:border-orange-200 transition-colors">
                          <Upload size={20} className="mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500 font-medium">Upload proof of completion</p>
                          <p className="text-xs text-gray-400 mt-1">Document, image, file hash, or attestation</p>
                          <button className="mt-3 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors">
                            Choose File
                          </button>
                        </div>
                      )}

                      {/* Approved */}
                      {c.status === "approved" && (
                        <div className="flex items-center gap-2 bg-green-50 rounded-2xl border border-green-100 px-4 py-3">
                          <CheckCircle2 size={15} className="text-green-500" />
                          <span className="text-sm font-medium text-green-700">Milestone approved · ${(totalFunded * c.pct / 100).toLocaleString()} released</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Arbitrator */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm"><Shield size={14} className="text-orange-400" />Arbitrator</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-orange-100 shrink-0">
                  <img src="/images/profile-art.webp" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Jane Doe</p>
                  <p className="text-[11px] text-gray-400">Contract Disputes · 4.9★</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1.5">
                <div className="flex justify-between"><span>Staked</span><span className="font-medium text-gray-700">1,000 B3TR</span></div>
                <div className="flex justify-between"><span>Ruling window</span><span className="font-medium text-gray-700">72 hours</span></div>
                <div className="flex justify-between"><span>Fee</span><span className="font-medium text-gray-700">1% of escrow</span></div>
              </div>
            </div>

            {/* Appeal to Trust Team */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2 text-sm"><TriangleAlert size={14} className="text-amber-400" />Trust Team Appeal</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">If the arbitrator has ruled and you disagree, you can appeal to the B3TR Trust Team within 14 days.</p>
              <button onClick={() => setShowAppeal(p => !p)}
                className="w-full py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:border-orange-300 hover:text-orange-600 transition-colors">
                {showAppeal ? "Cancel Appeal" : "File an Appeal"}
              </button>
              {showAppeal && (
                <div className="mt-3 space-y-2">
                  <textarea rows={3} value={appealReason} onChange={e => setAppealReason(e.target.value)}
                    placeholder="Explain why the arbitrator's ruling was incorrect (min. 50 characters)..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition" />
                  <button disabled={appealReason.length < 50} className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-xs font-semibold transition-colors">
                    Submit to Trust Team
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm"><MessageSquare size={14} className="text-orange-400" />Messages</h3>
              <div className="space-y-2.5 mb-3">
                {[
                  { from: "Alex Turner",   msg: "Milestone 1 proof submitted. GitHub repo link is in the document.",     time: "May 9"  },
                  { from: "You",           msg: "Reviewed and looks great. Approving this milestone.",                    time: "May 9"  },
                  { from: "Alex Turner",   msg: "Working on the smart contracts now. Will submit before the deadline.",   time: "May 20" },
                ].map((m, i) => (
                  <div key={i} className={`flex flex-col gap-0.5 ${m.from === "You" ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-gray-400">{m.from} · {m.time}</span>
                    <div className={`text-xs px-3 py-2 rounded-xl max-w-[85%] leading-relaxed ${m.from === "You" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}>
                      {m.msg}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input placeholder="Send a message..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition" />
                <button className="p-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"><Eye size={13} /></button>
              </div>
            </div>

            {/* View on chain */}
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs hover:border-orange-300 hover:text-orange-500 transition-colors">
              <ExternalLink size={13} /> View Vault on VeChain Explorer
            </button>
          </div>
        </div>
      </div>
    </Bg>
  )
}

const Stat = ({ icon: Icon, label, value, color }: { icon: typeof Coins; label: string; value: string; color: string }) => (
  <div className="flex flex-col items-center bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
    <Icon size={14} className={color} />
    <p className="font-bold text-gray-900 text-sm mt-1">{value}</p>
    <p className="text-[10px] text-gray-400">{label}</p>
  </div>
)

export default ManageEscrow
