import { Bookmark, BookmarkCheck, Star, UserRoundCheck, Coins, BadgeCheck, Flame, MessageCircle } from "lucide-react"
import type { Arbitrator } from "@/types/arbitrator"

type Props = {
  arbitrator: Arbitrator
  saved: boolean
  onSave: (id: number, e: React.MouseEvent) => void
  onClick: () => void
  onRequest?: (e: React.MouseEvent) => void
}

const ArbitratorCard = ({ arbitrator: a, saved, onSave, onClick, onRequest }: Props) => (
  <div
    onClick={onClick}
    className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-200"
  >
    {/* Banner */}
    <div className="relative h-16 bg-gray-100 transition-colors duration-300 group-hover:bg-orange-50">
      <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 group-hover:from-orange-100 group-hover:to-orange-50 transition-all duration-300" />

      {a.topRated && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          <Flame size={9} className="text-amber-400" />
          Top Rated
        </div>
      )}

      <button
        onClick={e => onSave(a.id, e)}
        className={`absolute top-2.5 left-2.5 p-1.5 rounded-full border transition-all ${
          saved
            ? "bg-orange-500 border-orange-500 text-white"
            : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
        }`}
      >
        {saved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
      </button>
    </div>

    {/* Avatar */}
    <div className="absolute top-8 left-4">
      <div className="relative">
        <div className="h-14 w-14 rounded-xl border-[3px] border-white shadow-sm overflow-hidden">
          <img src={a.avatar} className="h-full w-full object-cover" />
        </div>
        <span className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${a.online ? "bg-green-400" : "bg-gray-300"}`} />
      </div>
    </div>

    {/* Body */}
    <div className="pt-9 px-4 pb-4">

      {/* Name row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-orange-500 transition-colors">
              {a.name}
            </h3>
            <BadgeCheck size={13} className="text-orange-400 shrink-0" />
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{a.title}</p>
        </div>
        <span className={`flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 shrink-0 border ${
          a.online ? "bg-green-50 border-green-100 text-green-600" : "bg-gray-50 border-gray-100 text-gray-400"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${a.online ? "bg-green-400" : "bg-gray-300"}`} />
          {a.online ? "Online" : "Away"}
        </span>
      </div>

      {/* Specialties — gray to not compete with content */}
      <div className="flex flex-wrap gap-1 mt-2.5">
        {a.specialties.slice(0, 3).map(s => (
          <span key={s} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {s}
          </span>
        ))}
        {a.specialties.length > 3 && (
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
            +{a.specialties.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1.5 mt-3">
        {[
          { icon: Star,           value: a.rating.toFixed(1), label: "Rating", accent: "text-amber-500", iconCls: "text-amber-400" },
          { icon: UserRoundCheck, value: String(a.cases),     label: "Cases",  accent: "text-gray-800",  iconCls: "text-gray-400"  },
          { icon: Coins,          value: a.rate,              label: "/ hr",   accent: "text-gray-800",  iconCls: "text-gray-400"  },
        ].map(({ icon: Icon, value, label, accent, iconCls }) => (
          <div key={label} className="flex flex-col items-center bg-gray-50 rounded-xl py-2">
            <div className={`flex items-center gap-0.5 font-semibold text-xs ${accent}`}>
              <Icon size={10} className={iconCls} />
              {value}
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Success bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[9px] text-gray-400 mb-1">
          <span>Success rate</span>
          <span className="font-medium text-gray-500">{a.successRate}%</span>
        </div>
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-400 rounded-full transition-all"
            style={{ width: `${a.successRate}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={e => { e.stopPropagation(); onRequest?.(e) }}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-[11px] font-semibold transition-all group-hover:border-orange-300 group-hover:text-orange-400 group-hover:bg-orange-50"
        >
          Request Arbitration
        </button>
        <button
          onClick={e => e.stopPropagation()}
          className="p-2 rounded-xl border border-gray-200 text-gray-400 transition-all hover:border-gray-300 hover:text-gray-600"
        >
          <MessageCircle size={13} />
        </button>
      </div>
    </div>
  </div>
)

export default ArbitratorCard
