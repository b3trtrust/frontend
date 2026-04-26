import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Bg from "@/components/Bg"
import BiddersSidebar from "@/components/bidders/BiddersSidebar"
import BiddersTopBar from "@/components/bidders/BiddersTopBar"
import BidderCard from "@/components/bidders/BidderCard"
import { MOCK_BIDDERS } from "@/data/mockBidders"
import { sortOptions } from "@/data/sortOptions"
import { ArrowUpDown, Users } from "lucide-react"

const Bidders = () => {
  const navigate = useNavigate()
  const [search, setSearch]                       = useState("")
  const [selectedCategory, setSelectedCategory]   = useState<string | null>(null)
  const [savedBidders, setSavedBidders]           = useState<Set<number>>(new Set())
  const [showSaved, setShowSaved]                 = useState(false)
  const [sort, setSort]                           = useState("hottest")
  const [sidebarOpen, setSidebarOpen]             = useState(false)

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedBidders(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = MOCK_BIDDERS.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = !selectedCategory || b.category === selectedCategory
    const matchesSaved = !showSaved || savedBidders.has(b.id)
    return matchesSearch && matchesCategory && matchesSaved
  })

  return (
    <Bg image="/images/bg.png" className="min-h-screen">
      <div className="flex h-screen overflow-hidden">

        <BiddersSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          <BiddersTopBar
            search={search}
            onSearch={setSearch}
            showSaved={showSaved}
            onToggleSaved={() => setShowSaved(p => !p)}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 mt-16.25 lg:mt-0">

            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="font-bold text-lg">{filtered.length}</span>
                <span className="text-sm text-gray-500 ml-1.5">
                  {showSaved ? "Saved Bidders" : selectedCategory ? `${selectedCategory} Bidders` : "Bidders Available"}
                </span>
              </div>
              <div className="flex items-center gap-2 border border-orange-200 rounded-xl px-3 py-2 bg-white/70 text-sm">
                <ArrowUpDown size={14} className="text-orange-400" />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-transparent focus:outline-none text-gray-600 cursor-pointer"
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Users size={48} strokeWidth={1} className="mb-4 text-orange-200" />
                <p className="font-medium">No bidders found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map(b => (
                  <BidderCard
                    key={b.id}
                    bidder={b}
                    saved={savedBidders.has(b.id)}
                    onSave={toggleSave}
                    onClick={() => navigate(`/profile/bidder/${b.id}`)}
                    onInvite={() => navigate(`/profile/bidder/${b.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Bg>
  )
}

export default Bidders
