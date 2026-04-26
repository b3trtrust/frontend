import { Bookmark, BookmarkCheck, MapPin, Clock, Coins } from "lucide-react"
import type { Job } from "@/types/job"

type Props = {
  job: Job
  saved: boolean
  selected: boolean
  onSave: (id: number, e: React.MouseEvent) => void
  onClick: () => void
}

const JobCard = ({ job, saved, selected, onSave, onClick }: Props) => (
  <div
    onClick={onClick}
    className={`group bg-white/70 backdrop-blur-sm rounded-2xl p-4 border cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-orange-100 hover:-translate-y-0.5 ${
      selected ? "border-orange-400 shadow-lg shadow-orange-100 bg-orange-50/60" : "border-white hover:border-orange-200"
    }`}
  >
    <div className="flex gap-3">
      <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-orange-100">
        <img src={job.avatar} className="h-full w-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate pr-2 group-hover:text-orange-600 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 flex-wrap">
              <span>{job.company}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-0.5"><MapPin size={10} />{job.location}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>{job.type}</span>
            </div>
          </div>
          <button
            onClick={e => onSave(job.id, e)}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              saved ? "text-orange-500 bg-orange-50" : "text-gray-300 hover:text-orange-400 hover:bg-orange-50"
            }`}
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {job.skills.map(s => (
            <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-medium">
              {s}
            </span>
          ))}
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
            {job.category}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} />
            <span>{job.posted}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-sm text-orange-600">
            <Coins size={14} />
            <span>{job.budget}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default JobCard
