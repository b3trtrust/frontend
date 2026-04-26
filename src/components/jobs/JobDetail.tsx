import { X, MapPin, Briefcase, Clock, Coins, Bookmark, BookmarkCheck, ShieldCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Job } from "@/types/job"

type Props = {
  job: Job
  saved: boolean
  onSave: (e: React.MouseEvent) => void
  onClose: () => void
}

const JobDetail = ({ job, saved, onSave, onClose }: Props) => {
  const navigate = useNavigate()
  return (
  <div className="w-full md:w-[45%] lg:w-[42%] shrink-0 border-l border-orange-100 bg-white/80 backdrop-blur-xl flex flex-col overflow-hidden animate-slide-in">

    <div className="p-5 border-b border-orange-100 flex items-start justify-between gap-4">
      <div className="flex gap-3 items-start">
        <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-orange-100">
          <img src={job.avatar} className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 leading-snug">{job.title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      >
        <X size={18} />
      </button>
    </div>

    <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-orange-100">
      {[
        { icon: MapPin,    label: job.location },
        { icon: Briefcase, label: job.type     },
        { icon: Clock,     label: job.posted   },
        { icon: Coins,     label: job.budget   },
      ].map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 font-medium">
          <Icon size={12} />
          {label}
        </span>
      ))}
    </div>

    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Category</p>
        <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{job.category}</span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">About this job</p>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Required Skills</p>
        <div className="flex flex-wrap gap-2">
          {job.skills.map(s => (
            <span key={s} className="text-sm px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-medium">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={16} className="text-green-500" />
          <span className="text-sm font-semibold text-green-700">Escrow Protected</span>
        </div>
        <p className="text-xs text-green-600 leading-relaxed">
          Funds are locked on agreement and released only when work is verified. Dispute? Community arbitration has you covered.
        </p>
      </div>
    </div>

    <div className="p-5 border-t border-orange-100 flex gap-3">
      <button onClick={() => navigate(`/jobs/${job.id}`)}
        className="flex-1 rounded-xl py-3 px-4 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors">
        Apply Now
      </button>
      <button
        onClick={onSave}
        className={`p-3 rounded-xl border transition-colors ${
          saved
            ? "bg-orange-500 border-orange-500 text-white"
            : "border-orange-200 text-orange-500 hover:bg-orange-50"
        }`}
      >
        {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
    </div>
  </div>
  )
}

export default JobDetail
