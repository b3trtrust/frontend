import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Bg from "@/components/Bg"
import { MOCK_BIDDERS } from "@/data/mockBidders"
import {
  ArrowLeft, BadgeCheck, Star, Briefcase, Coins,
  CheckCircle2, Clock, ExternalLink, MessageCircle,
  Globe, TrendingUp, Award, Send,
} from "lucide-react"

const TABS = ["Overview", "Jobs", "Reviews"] as const
type Tab = typeof TABS[number]

const HISTORY = [
  { title: "DeFi Dashboard React Dev",       status: "completed", amount: "$3,200", date: "Mar 2026" },
  { title: "Smart Contract Audit – VeChain", status: "completed", amount: "$1,800", date: "Feb 2026" },
  { title: "NFT Marketplace UI Design",      status: "completed", amount: "$950",   date: "Jan 2026" },
  { title: "DAO Governance Portal",          status: "active",    amount: "$2,100", date: "Apr 2026" },
  { title: "Token Staking Frontend",         status: "completed", amount: "$1,400", date: "Dec 2025" },
]

const REVIEWS = [
  { from: "ChainLabs",  rating: 5, date: "Mar 2026", text: "Delivered exceptional work — clean code, ahead of schedule and great comms throughout. Will hire again." },
  { from: "PixelDAO",   rating: 5, date: "Feb 2026", text: "Deep technical knowledge of VeChain SDK. Thoroughly documented and well-tested. Highly recommended."     },
  { from: "Metaworks",  rating: 4, date: "Jan 2026", text: "Good quality work, minor revisions needed on mobile layout. Overall very satisfied."                     },
  { from: "CryptoHive", rating: 5, date: "Dec 2025", text: "Delivered exactly what was scoped. The staking UI is live and working perfectly."                        },
]

const statusColor: Record<string, string> = {
  completed: "bg-green-50 text-green-700 border-green-200",
  active:    "bg-blue-50 text-blue-700 border-blue-200",
}

const BidderProfile = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<Tab>("Overview")

  const bidder = MOCK_BIDDERS.find(b => String(b.id) === id) ?? MOCK_BIDDERS[0]

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)
  const totalEarned = HISTORY.filter(h => h.status === "completed")
    .reduce((s, h) => s + parseInt(h.amount.replace(/\D/g, "")), 0)

  return (
    <Bg image="/images/bg.png" className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-5">
          <ArrowLeft size={15} /> Back
        </button>

        {/* Profile header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="h-24 bg-linear-to-br from-gray-100 to-gray-200 relative">
            <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/10" />
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl border-4 border-white shadow-md overflow-hidden">
                  <img src={bidder.avatar} className="h-full w-full object-cover" />
                </div>
                <span className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${bidder.online ? "bg-green-400" : "bg-gray-300"}`} />
              </div>
              <div className="flex gap-2 pb-1">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:border-orange-300 hover:text-orange-500 transition-colors">
                  <MessageCircle size={14} /> Message
                </button>
                <button
                  onClick={() => navigate(`/escrow/create?bidder=${bidder.id}`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
                  <Send size={14} /> Invite to Bid
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{bidder.name}</h1>
              <BadgeCheck size={18} className="text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mb-2">{bidder.title} · {bidder.hourlyRate}/hr</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Globe size={12} /><span>Remote</span>
              <span>·</span>
              <span className="font-mono">0x{bidder.id}a2b...3c4d</span>
              <button className="text-orange-400 hover:text-orange-600 transition-colors"><ExternalLink size={11} /></button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {bidder.skills.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{s}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[
                { icon: Star,       label: "Avg Rating",   value: avgRating,                                            sub: `${REVIEWS.length} reviews`, gold: true  },
                { icon: Briefcase,  label: "Jobs Done",    value: String(bidder.jobsDone),                              sub: "completed",                  gold: false },
                { icon: Coins,      label: "Total Earned", value: `$${totalEarned.toLocaleString()}`,                   sub: "as worker",                  gold: false },
                { icon: TrendingUp, label: "Success Rate", value: `${bidder.successRate}%`,                             sub: "completion",                 gold: false },
              ].map(({ icon: Icon, label, value, sub, gold }) => (
                <div key={label} className="flex flex-col items-center bg-gray-50 rounded-2xl py-3 border border-gray-100">
                  <Icon size={15} className={gold ? "text-amber-400" : "text-orange-400"} />
                  <p className={`font-bold text-base mt-1 ${gold ? "text-amber-500" : "text-gray-900"}`}>{value}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{label}</p>
                  <p className="text-[9px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { icon: Briefcase, label: "Verified Worker", color: "text-blue-600 bg-blue-50 border-blue-200" },
                ...(bidder.topRated ? [{ icon: Award, label: "Top Rated", color: "text-amber-600 bg-amber-50 border-amber-200" }] : []),
                ...(bidder.online   ? [{ icon: CheckCircle2, label: "Available Now", color: "text-green-600 bg-green-50 border-green-200" }] : []),
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}>
                  <Icon size={11} />{label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">About</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {bidder.title} with a track record of {bidder.jobsDone} completed jobs and a {bidder.successRate}% success rate. Specialises in {bidder.skills.slice(0, 3).join(", ")} and delivers clean, well-tested work on time. Category: {bidder.category}.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/60 backdrop-blur border border-gray-100 rounded-2xl p-1 mb-4 w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Recent jobs */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Briefcase size={14} className="text-orange-400" /> Recent Jobs
              </h3>
              {HISTORY.slice(0, 3).map(h => (
                <div key={h.title} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                  <div className={`p-1.5 rounded-lg border ${h.status === "completed" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
                    {h.status === "completed" ? <CheckCircle2 size={12} className="text-green-500" /> : <Clock size={12} className="text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">{h.title}</p>
                    <p className="text-[11px] text-gray-400">{h.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 shrink-0">{h.amount}</span>
                </div>
              ))}
            </div>
            {/* Latest reviews */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Star size={14} className="text-orange-400" /> Latest Reviews
              </h3>
              {REVIEWS.slice(0, 2).map(r => (
                <div key={r.from} className="py-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{r.from}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={11} className={j < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Jobs" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 space-y-2">
            {HISTORY.map(h => (
              <div key={h.title} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors">
                <div className={`p-2 rounded-xl border ${statusColor[h.status]}`}>
                  {h.status === "completed" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{h.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{h.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{h.amount}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColor[h.status]}`}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Reviews" && (
          <div className="space-y-3">
            {REVIEWS.map(r => (
              <div key={r.from} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl overflow-hidden border border-orange-100">
                      <img src="/images/profile-art.webp" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.from}</p>
                      <p className="text-[11px] text-gray-400">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0 mt-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={14} className={j < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </Bg>
  )
}

export default BidderProfile
