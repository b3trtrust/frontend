import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Bg from "@/components/Bg"
import { useWallet } from "@/context/WalletContext"
import {
  ArrowLeft, Shield, Clock, Coins, Briefcase, CheckCircle2,
  Circle, AlertCircle, ChevronDown, ChevronUp, FileText, Upload,
  Users, Star, BadgeCheck, Send, Lock, Unlock, BarChart3,
  ThumbsUp, ThumbsDown, Wallet, ExternalLink,
} from "lucide-react"
import {
  getJob, addBid, acceptBid, submitProof, approveCondition, disputeCondition,
  type DemoJob,
} from "@/store/demoStore"

const statusConfig: Record<string, { label: string; color: string; icon: typeof Circle }> = {
  approved:        { label: "Approved",        color: "text-green-600 bg-green-50 border-green-200",   icon: CheckCircle2 },
  pending:         { label: "Pending",          color: "text-gray-500 bg-gray-50 border-gray-200",      icon: Circle       },
  proof_submitted: { label: "Proof Submitted",  color: "text-blue-600 bg-blue-50 border-blue-200",      icon: FileText     },
  disputed:        { label: "Disputed",         color: "text-red-600 bg-red-50 border-red-200",         icon: AlertCircle  },
}

type ViewerRole = "visitor" | "creator" | "worker"

const EscrowDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isConnected, connectWallet } = useWallet()

  const [job, setJob] = useState<DemoJob | null>(() => getJob(id ?? ""))
  const [expandedCondition, setExpandedCondition] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [bidMessage, setBidMessage] = useState("")
  const [bidRate, setBidRate] = useState("")
  const [proofNote, setProofNote] = useState<Record<number, string>>({})
  const [proofHash, setProofHash] = useState<Record<number, string>>({})
  const [bidSubmitted, setBidSubmitted] = useState(false)

  if (!job) {
    return (
      <Bg image="/images/bg.png" className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-gray-500">Job not found.</p>
          <button onClick={() => navigate("/jobs")} className="text-orange-500 underline text-sm">Browse all jobs</button>
        </div>
      </Bg>
    )
  }

  const reload = () => setJob(getJob(id ?? ""))

  const viewerRole: ViewerRole = !isConnected ? "visitor"
    : user!.address === job.creatorAddress ? "creator"
    : user!.address === job.workerAddress  ? "worker"
    : "visitor"

  const canSeeConditions = viewerRole === "creator" || viewerRole === "worker"
  const canSeeBids = viewerRole === "creator" || viewerRole === "visitor"

  const availableTabs = [
    "overview",
    ...(canSeeBids       ? ["bids"]       : []),
    ...(canSeeConditions ? ["conditions"] : []),
  ]

  const totalFunded = Number(job.totalAmount)
  const approvedPct = job.conditions.filter(c => c.status === "approved").reduce((s, c) => s + c.pct, 0)
  const approvedCount = job.conditions.filter(c => c.status === "approved").length

  const handleBidSubmit = () => {
    if (!user || !bidMessage) return
    addBid(job.id, {
      bidderId: Math.floor(Math.random() * 100),
      bidderName: user.username,
      bidderAvatar: user.avatar,
      amount: bidRate || "negotiable",
      message: bidMessage,
    })
    setBidMessage("")
    setBidRate("")
    setBidSubmitted(true)
    reload()
  }

  const handleAcceptBid = (bidId: string, workerAddr: string) => {
    acceptBid(job.id, bidId, workerAddr)
    reload()
  }

  const handleSubmitProof = (idx: number) => {
    const note = proofNote[idx] || ""
    const hash = proofHash[idx] || `Qm${Math.random().toString(36).slice(2, 12)}...${Math.random().toString(36).slice(2, 6)}`
    submitProof(job.id, idx, hash, note)
    setProofNote(p => ({ ...p, [idx]: "" }))
    reload()
  }

  const handleApprove = (idx: number) => {
    approveCondition(job.id, idx)
    reload()
  }

  const handleDispute = (idx: number) => {
    disputeCondition(job.id, idx)
    reload()
  }

  const statusBadge = {
    open: "bg-green-50 border-green-100 text-green-600",
    active: "bg-blue-50 border-blue-100 text-blue-600",
    completed: "bg-gray-50 border-gray-200 text-gray-500",
    disputed: "bg-red-50 border-red-200 text-red-600",
  }[job.status]

  return (
    <Bg image="/images/bg.png" className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-5">
          <ArrowLeft size={15} /> Back
        </button>

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            <div className="h-14 w-14 rounded-2xl overflow-hidden border border-orange-100 shrink-0 bg-orange-50 flex items-center justify-center">
              <Briefcase size={24} className="text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600">{job.category}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 capitalize">{job.type} Escrow</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${statusBadge}`}>{job.status}</span>
                {viewerRole === "creator" && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700">Your Job</span>}
                {viewerRole === "worker"  && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">Accepted Worker</span>}
              </div>
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock size={12} />Deadline {job.globalDeadline}</span>
                <span className="flex items-center gap-1"><Users size={12} />{job.bids.length} bid{job.bids.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="flex lg:flex-col gap-3 shrink-0">
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-2.5">
                <Coins size={16} className="text-orange-500" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{totalFunded.toLocaleString()} {job.tokenSymbol}</p>
                  <p className="text-[10px] text-gray-400">Total Budget</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5">
                <Lock size={16} className="text-gray-400" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Escrow</p>
                  <p className="text-[10px] text-gray-400">Protected</p>
                </div>
              </div>
            </div>
          </div>

          {canSeeConditions && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span className="font-medium text-gray-700">Milestone Progress</span>
                <span>{approvedPct}% complete · {approvedCount} of {job.conditions.length} done</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-orange-400 to-amber-400 rounded-full transition-all" style={{ width: `${approvedPct}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white/60 backdrop-blur border border-gray-100 rounded-2xl p-1 mb-4 w-fit">
          {availableTabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {tab}{tab === "bids" ? ` (${job.bids.length})` : ""}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <>
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileText size={15} className="text-orange-400" />About this Job</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{job.desc || "No description provided."}</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-green-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3"><Shield size={16} className="text-green-500" /><h3 className="font-semibold text-green-800">Escrow Protection</h3></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: Lock,         title: "Funds Locked",   desc: "Budget locked on-chain before work begins" },
                      { icon: CheckCircle2, title: "Proof Verified", desc: "Each milestone requires verifiable proof"  },
                      { icon: Shield,       title: "Dispute Cover",  desc: "Arbitrator assigned, Trust Team backstop"  },
                    ].map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="flex gap-3 items-start">
                        <div className="p-2 bg-green-50 rounded-xl shrink-0"><Icon size={14} className="text-green-500" /></div>
                        <div><p className="text-xs font-semibold text-gray-800">{title}</p><p className="text-[11px] text-gray-500 mt-0.5">{desc}</p></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><BarChart3 size={15} className="text-orange-400" />Milestones</h3>
                  <div className="space-y-2">
                    {job.conditions.map((c, i) => {
                      const cfg = statusConfig[c.status] ?? statusConfig["pending"]
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100">
                          <div className={`p-1.5 rounded-lg border ${cfg.color}`}><cfg.icon size={12} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{i + 1}. {c.title}</p>
                            <p className="text-[11px] text-gray-400">Due {c.deadline}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-gray-900">{c.pct}%</p>
                            <p className="text-[11px] text-gray-400">{(totalFunded * c.pct / 100).toLocaleString()} {job.tokenSymbol}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* BIDS */}
            {activeTab === "bids" && (
              <div className="space-y-3">
                {job.status !== "open" && viewerRole === "visitor" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                    <AlertCircle size={15} className="text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800">This job is no longer accepting bids.</p>
                  </div>
                )}
                {job.bids.length === 0 && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                    No bids yet. Be the first to apply!
                  </div>
                )}
                {job.bids.map(bid => (
                  <div key={bid.id} className={`bg-white/80 backdrop-blur-xl rounded-3xl border shadow-sm p-4 transition-all
                    ${bid.status === "accepted" ? "border-green-200 bg-green-50/30" : "border-gray-100"}`}>
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div className="h-11 w-11 rounded-xl overflow-hidden border border-orange-100">
                          <img src={bid.bidderAvatar} className="h-full w-full object-cover" />
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">{bid.bidderName}</span>
                          <BadgeCheck size={13} className="text-orange-400" />
                          {bid.status === "accepted" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 border border-green-200 text-green-700">Accepted</span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{bid.message}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 text-sm">{bid.amount}</p>
                        <div className="flex items-center gap-0.5 justify-end mt-0.5">
                          <Star size={11} className="text-amber-400" />
                          <span className="text-xs text-gray-400">{new Date(bid.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {viewerRole === "creator" && bid.status === "pending" && job.status === "open" && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <button
                          onClick={() => handleAcceptBid(bid.id, `0xBIDDER_${bid.bidderId}`)}
                          className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors">
                          Accept Bid
                        </button>
                        <button className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs hover:border-gray-300 transition-colors">
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CONDITIONS */}
            {activeTab === "conditions" && (
              <div className="space-y-3">
                {viewerRole === "worker" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">You are the accepted worker</p>
                      <p className="text-xs text-blue-600 mt-0.5">Upload proof for each milestone once complete. The creator reviews and approves to release payment.</p>
                    </div>
                  </div>
                )}
                {viewerRole === "creator" && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
                    <Shield size={15} className="text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-purple-800">You are the job creator</p>
                      <p className="text-xs text-purple-600 mt-0.5">Review submitted proofs and approve to release payment, or raise a dispute to involve the arbitrator.</p>
                    </div>
                  </div>
                )}

                {job.conditions.map((c, i) => {
                  const cfg = statusConfig[c.status] ?? statusConfig["pending"]
                  const open = expandedCondition === i
                  return (
                    <div key={i} className={`bg-white/80 backdrop-blur-xl rounded-3xl border shadow-sm overflow-hidden transition-all ${open ? "border-orange-200" : "border-gray-100"}`}>
                      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setExpandedCondition(open ? null : i)}>
                        <div className={`p-2 rounded-xl border ${cfg.color} shrink-0`}><cfg.icon size={14} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{i + 1}. {c.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Due {c.deadline} · {c.pct}% · {(totalFunded * c.pct / 100).toLocaleString()} {job.tokenSymbol}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${cfg.color} shrink-0`}>{cfg.label}</span>
                        {open ? <ChevronUp size={15} className="text-gray-400 shrink-0" /> : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
                      </button>

                      {open && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Condition</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{c.desc}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Required Proof</p>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-medium capitalize">{c.proofType}</span>
                          </div>

                          {/* Worker: upload proof */}
                          {viewerRole === "worker" && c.status === "pending" && (
                            <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200 space-y-3">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Upload size={14} /><span className="text-sm font-medium">Submit Proof</span>
                              </div>
                              <input
                                type="text"
                                placeholder="Proof link, hash, or description"
                                value={proofHash[i] ?? ""}
                                onChange={e => setProofHash(p => ({ ...p, [i]: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
                              />
                              <textarea
                                rows={2}
                                placeholder="Add a note for the creator (optional)"
                                value={proofNote[i] ?? ""}
                                onChange={e => setProofNote(p => ({ ...p, [i]: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
                              />
                              <button
                                onClick={() => handleSubmitProof(i)}
                                disabled={!(proofHash[i] || proofNote[i])}
                                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                                <Send size={12} /> Submit Proof
                              </button>
                            </div>
                          )}

                          {/* Proof submitted — show hash */}
                          {c.status === "proof_submitted" && (
                            <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100 space-y-2">
                              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">Proof Submitted</p>
                              <div className="flex items-center gap-2 bg-white rounded-xl border border-blue-100 px-3 py-2">
                                <FileText size={12} className="text-orange-400 shrink-0" />
                                <span className="text-xs font-mono text-orange-600 truncate flex-1">{c.proofHash}</span>
                                <ExternalLink size={11} className="text-gray-400 shrink-0" />
                              </div>
                              {c.proofNote && <p className="text-xs text-blue-700 italic">"{c.proofNote}"</p>}
                            </div>
                          )}

                          {/* Creator: approve or dispute when proof submitted */}
                          {viewerRole === "creator" && c.status === "proof_submitted" && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApprove(i)} className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                                <ThumbsUp size={12} /> Approve & Release
                              </button>
                              <button onClick={() => handleDispute(i)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                                <ThumbsDown size={12} /> Raise Dispute
                              </button>
                            </div>
                          )}

                          {/* Creator: awaiting proof */}
                          {viewerRole === "creator" && c.status === "pending" && (
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                              <p className="text-xs text-gray-500">Awaiting proof submission from the worker.</p>
                            </div>
                          )}

                          {c.status === "approved" && (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-2xl px-4 py-3 border border-green-100">
                              <CheckCircle2 size={15} /><span className="text-sm font-medium">Approved · Payment released</span>
                            </div>
                          )}
                          {c.status === "disputed" && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-2xl px-4 py-3 border border-red-100">
                              <AlertCircle size={15} /><span className="text-sm font-medium">Disputed · Arbitrator has been notified</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Visitor bid form */}
            {viewerRole === "visitor" && job.status === "open" && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Send size={14} className="text-orange-400" />Place a Bid</h3>
                {isConnected ? (
                  bidSubmitted ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-2xl px-4 py-3 border border-green-100">
                      <CheckCircle2 size={15} /><span className="text-sm font-medium">Bid submitted!</span>
                    </div>
                  ) : (
                    <>
                      <textarea rows={3} value={bidMessage} onChange={e => setBidMessage(e.target.value)}
                        placeholder="Describe why you're the right person for this job..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition" />
                      <input type="text" placeholder="Your rate (e.g. 500 VET)" value={bidRate} onChange={e => setBidRate(e.target.value)}
                        className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition" />
                      <button onClick={handleBidSubmit} disabled={!bidMessage}
                        className="w-full mt-3 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-sm font-semibold transition-colors">
                        Submit Bid
                      </button>
                    </>
                  )
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">Connect your wallet to place a bid.</p>
                    <button onClick={connectWallet} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
                      <Wallet size={15} /> Connect Wallet
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Creator panel */}
            {viewerRole === "creator" && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-purple-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Shield size={14} className="text-purple-400" />Your Escrow</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">You created this job. Accept a bid to start work. Review milestone proofs to release payments.</p>
                {job.status === "open" && (
                  <button onClick={() => setActiveTab("bids")} className="w-full py-2 rounded-xl border border-purple-200 text-purple-700 text-sm font-medium hover:bg-purple-50 transition-colors">
                    Review Bids ({job.bids.length})
                  </button>
                )}
              </div>
            )}

            {/* Worker panel */}
            {viewerRole === "worker" && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" />Your Assignment</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">You are the accepted worker. Submit proof for each milestone to trigger payment release.</p>
                <button onClick={() => setActiveTab("conditions")} className="w-full py-2 rounded-xl border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-50 transition-colors">
                  Go to Milestones
                </button>
              </div>
            )}

            {/* Arbitrator info */}
            {canSeeConditions && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Shield size={14} className="text-gray-400" />Assigned Arbitrator</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl overflow-hidden border border-orange-100 shrink-0 bg-gray-50 flex items-center justify-center">
                    <BadgeCheck size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-gray-900">Jane Doe</p>
                      <BadgeCheck size={13} className="text-orange-400" />
                    </div>
                    <p className="text-[11px] text-gray-400">Contract Disputes · 4.9★</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  1,000 B3TR staked · 72hr ruling window · 1% fee
                </div>
              </div>
            )}

            {/* Key dates */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Clock size={14} className="text-orange-400" />Key Dates</h3>
              <div className="space-y-2">
                {[
                  { label: "Final Deadline", date: job.globalDeadline },
                  { label: "Appeal Window",  date: "14 days post-ruling" },
                ].map(({ label, date }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800">{date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fund breakdown */}
            {canSeeConditions && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-orange-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Unlock size={14} className="text-orange-400" />Fund Breakdown</h3>
                <div className="space-y-2">
                  {job.conditions.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${c.status === "approved" ? "bg-orange-400" : "bg-gray-200"}`} />
                      <span className="text-xs text-gray-600 flex-1 truncate">{c.title}</span>
                      <span className="text-xs font-semibold text-gray-800 shrink-0">{(totalFunded * c.pct / 100).toLocaleString()} {job.tokenSymbol}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2 flex justify-between">
                    <span className="text-xs font-semibold text-gray-700">Total Locked</span>
                    <span className="text-xs font-bold text-orange-600">{totalFunded.toLocaleString()} {job.tokenSymbol}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Bg>
  )
}

export default EscrowDetail
