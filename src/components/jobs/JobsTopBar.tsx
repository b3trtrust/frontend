import { Search, Bookmark, BookmarkCheck, SlidersHorizontal } from "lucide-react"
import ProfileMenu from "@/components/shared/ProfileMenu"

type Props = {
  search: string
  onSearch: (v: string) => void
  showSaved: boolean
  onToggleSaved: () => void
  onOpenSidebar: () => void
}

const JobsTopBar = ({ search, onSearch, showSaved, onToggleSaved, onOpenSidebar }: Props) => (
  <header className="fixed lg:relative top-0 left-0 right-0 z-20 bg-white/70 backdrop-blur-xl border-b border-orange-100 px-4 lg:px-8 py-4 flex items-center gap-4 shrink-0">
    <button
      className="lg:hidden p-2 rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50"
      onClick={onOpenSidebar}
    >
      <SlidersHorizontal size={18} />
    </button>

    <div className="flex-1 relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder="Search jobs, companies..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-orange-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
      />
    </div>

    <button
      onClick={onToggleSaved}
      title={showSaved ? "Show all jobs" : "Show saved jobs"}
      className={`p-2.5 rounded-xl border transition-colors ${
        showSaved
          ? "bg-orange-500 border-orange-500 text-white"
          : "border-orange-200 text-gray-500 hover:border-orange-400 hover:text-orange-500"
      }`}
    >
      {showSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </button>

    <ProfileMenu />
  </header>
)

export default JobsTopBar
