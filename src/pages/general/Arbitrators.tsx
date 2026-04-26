import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Bg from "@/components/Bg"
import ArbitratorsSidebar from "@/components/arbitrators/ArbitratorsSidebar"
import ArbitratorsTopBar from "@/components/arbitrators/ArbitratorsTopBar"
import ArbitratorCard from "@/components/arbitrators/ArbitratorCard"
import { MOCK_ARBITRATORS } from "@/data/mockArbitrators"
import { sortOptions } from "@/data/sortOptions"
import { ArrowUpDown, Gavel } from "lucide-react"

const Arbitrators = () => {
  const navigate = useNavigate()
  const [search, setSearch]                     = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [savedArbitrators, setSavedArbitrators]  = useState<Set<number>>(new Set())
  const [showSaved, setShowSaved]                = useState(false)
  const [sort, setSort]                          = useState("hottest")
  const [sidebarOpen, setSidebarOpen]            = useState(false)

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedArbitrators(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = MOCK_ARBITRATORS.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesSpecialty = !selectedSpecialty || a.specialty === selectedSpecialty
    const matchesSaved = !showSaved || savedArbitrators.has(a.id)
    return matchesSearch && matchesSpecialty && matchesSaved
  })

  return (
    <Bg image="/images/bg.png" className="min-h-screen">
      <div className="flex h-screen overflow-hidden">

        <ArbitratorsSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          <ArbitratorsTopBar
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
                  {showSaved ? "Saved Arbitrators" : selectedSpecialty ? `${selectedSpecialty} Arbitrators` : "Arbitrators Available"}
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
                <Gavel size={48} strokeWidth={1} className="mb-4 text-orange-200" />
                <p className="font-medium">No arbitrators found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map(a => (
                  <ArbitratorCard
                    key={a.id}
                    arbitrator={a}
                    saved={savedArbitrators.has(a.id)}
                    onSave={toggleSave}
                    onClick={() => navigate(`/profile/arbitrator/${a.id}`)}
                    onRequest={() => navigate(`/profile/arbitrator/${a.id}`)}
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

export default Arbitrators
