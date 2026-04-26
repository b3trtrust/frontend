import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Bg from "@/components/Bg"
import { MOCK_ARBITRATORS } from "@/data/mockArbitrators"
import {
  ArrowLeft, BadgeCheck, Star, Shield, Coins,
  CheckCircle2, ExternalLink, MessageCircle,
  Globe, TrendingUp, Gavel, Award, UserRoundCheck,
} from "lucide-react"

const TABS = ["Overview", "Cases", "Reviews"] as const
type Tab = typeof TABS[number]

const CASES = [
  { title: "DeFi Yield Dispute – Milestone 2",   outcome: "Upheld",    date: "Mar 2026", value: "$4,200" },
  { title: "NFT Royalty Non-Payment",             outcome: "Upheld",    date: "Feb 2026", value: "$1,800" },
  { title: "Smart Contract Delivery Dispute",     outcome: "Overturned",date: "Jan 2026", value: "$3,100" },
  { title: "DAO Contributor Payment",             outcome: "Upheld",    date: "Dec 2025", value: "$900"   },
  { title: "API Integration Scope Dispute",       outcome: "Partial",   date: "Nov 2025", value: "$2,500" },
]

const REVIEWS = [
  { from: "ChainLabs",  rating: 5, date: "Mar 2026", text: "Incredibly fair and thorough. Reviewed all evidence carefully and delivered a clear, justified ruling within 48 hours." },
  { from: "PixelDAO",   rating: 5, date: "Feb 2026", text: "Professional and well-versed in DeFi protocol nuances. The decision was well-reasoned and both parties accepted it."    },
  { from: "Metaworks",  rating: 4, date: "Jan 2026", text: "Good arbitration process. Could have communicated interim updates better, but the final ruling was fair."               },
  { from: "VeForge",    rating: 5, date: "Nov 2025", text: "Handled a complex multi-party dispute with expertise. Would request this arbitrator again without hesitation."          },
]

const outcomeColor: Record<string, string> = {
  Upheld:    "bg-green-50 text-green-700 border-green-200",
  Overturned:"bg-red-50 text-red-700 border-red-200",
  Partial:   "bg-amber-50 text-amber-700 border-amber-200",
}

const ArbitratorProfile = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<Tab>("Overview")

  const arbitrator = MOCK_ARBITRATORS.find(a => String(a.id) === id) ?? MOCK_ARBITRATORS[0]

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)
  const upheld = CASES.filter(c => c.outcome === "Upheld").length

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
                  <img src={arbitrator.avatar} className="h-full w-full object-cover" />
                </div>
                <span className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${arbitrator.online ? "bg-green-400" : "bg-gray-300"}`} />
              </div>
              <div className="flex gap-2 pb-1">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:border-orange-300 hover:text-orange-500 transition-colors">
                  <MessageCircle size={14} /> Message
                </button>
                <button
                  onClick={() => navigate(`/escrow/create?arbitrator=${arbitrator.id}`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
                  <Gavel size={14} /> Request Arbitration
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{arbitrator.name}</h1>
              <BadgeCheck size={18} className="text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mb-2">{arbitrator.title} · {arbitrator.rate}/hr</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Globe size={12} /><span>Remote</span>
              <span>·</span>
              <span>1,000 B3TR staked</span>
              <span>·</span>
              <span className="font-mono">0x{arbitrator.id}a9f...8e3b</span>
              <button className="text-orange-400 hover:text-orange-600 transition-colors"><ExternalLink size={11} /></button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {arbitrator.specialties.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{s}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[
                { icon: Star,          label: "Avg Rating",  value: avgRating,                    sub: `${REVIEWS.length} reviews`, gold: true  },
                { icon: UserRoundCheck,label: "Cases",       value: String(arbitrator.cases),     sub: "total handled",             gold: false },
                { icon: Coins,         label: "Fee",         value: arbitrator.rate,              sub: "per hour",                  gold: false },
                { icon: TrendingUp,    label: "Success Rate",value: `${arbitrator.successRate}%`, sub: "fair rulings",              gold: false },
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
                { icon: Shield,      label: "Verified Arbitrator",   color: "text-purple-600 bg-purple-50 border-purple-200" },
                ...(arbitrator.topRated ? [{ icon: Award, label: "Top Rated", color: "text-amber-600 bg-amber-50 border-amber-200" }] : []),
                { icon: CheckCircle2, label: `${upheld}/${CASES.length} Rulings Upheld`, color: "text-green-600 bg-green-50 border-green-200" },
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}>
                  <Icon size={11} />{label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Staking & protocol info */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
            <Shield size={14} className="text-orange-400" /> Protocol Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Stake Locked",   value: "1,000 B3TR", note: "Slashable on misconduct"   },
              { label: "Ruling Window",  value: "72 hours",   note: "From case assignment"       },
              { label: "Arbitrator Fee", value: "1%",         note: "Of total escrow value"      },
            ].map(({ label, value, note }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-center">
                <p className="text-sm font-bold text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
                <p className="text-[10px] text-gray-400">{note}</p>
              </div>
            ))}
          </div>
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
            {/* Recent cases */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Gavel size={14} className="text-orange-400" /> Recent Cases
              </h3>
              {CASES.slice(0, 3).map(c => (
                <div key={c.title} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                  <div className={`p-1.5 rounded-lg border ${outcomeColor[c.outcome]}`}>
                    <Gavel size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">{c.title}</p>
                    <p className="text-[11px] text-gray-400">{c.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 shrink-0">{c.value}</span>
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

        {tab === "Cases" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm p-5 space-y-2">
            {CASES.map(c => (
              <div key={c.title} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors">
                <div className={`p-2 rounded-xl border ${outcomeColor[c.outcome]}`}>
                  <Gavel size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{c.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{c.value}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${outcomeColor[c.outcome]}`}>{c.outcome}</span>
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

export default ArbitratorProfile
