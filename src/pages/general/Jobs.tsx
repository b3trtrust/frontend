import { useState } from "react"
import Bg from "@/components/Bg"
import JobsSidebar from "@/components/jobs/JobsSidebar"
import JobsTopBar from "@/components/jobs/JobsTopBar"
import JobCard from "@/components/jobs/JobCard"
import JobDetail from "@/components/jobs/JobDetail"
import { MOCK_JOBS } from "@/data/mockJobs"
import { sortOptions } from "@/data/sortOptions"
import type { Job } from "@/types/job"
import { ArrowUpDown, Briefcase } from "lucide-react"

const Jobs = () => {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [showSaved, setShowSaved] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [sort, setSort] = useState("hottest")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedJobs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = MOCK_JOBS.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || job.category === selectedCategory
    const matchesSaved = !showSaved || savedJobs.has(job.id)
    return matchesSearch && matchesCategory && matchesSaved
  })

  return (
    <Bg image="/images/bg.png" className="min-h-screen">
      <div className="flex h-screen overflow-hidden">

        <JobsSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          <JobsTopBar
            search={search}
            onSearch={setSearch}
            showSaved={showSaved}
            onToggleSaved={() => setShowSaved(p => !p)}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <div className="flex flex-1 overflow-hidden mt-16.25 lg:mt-0">

            {/* Job list */}
            <div className={`flex-1 overflow-y-auto p-4 lg:p-6 transition-all duration-300 ${selectedJob ? "hidden md:block md:max-w-[55%] lg:max-w-[60%]" : ""}`}>

              {/* Results header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="font-bold text-lg">{filtered.length}</span>
                  <span className="text-sm text-gray-500 ml-1.5">
                    {showSaved ? "Saved Jobs" : selectedCategory ? `${selectedCategory} Jobs` : "Jobs Found"}
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

              {/* Cards */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                  <Briefcase size={48} strokeWidth={1} className="mb-4 text-orange-200" />
                  <p className="font-medium">No jobs found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className={`grid gap-3 ${selectedJob ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"}`}>
                  {filtered.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      saved={savedJobs.has(job.id)}
                      selected={selectedJob?.id === job.id}
                      onSave={toggleSave}
                      onClick={() => setSelectedJob(job)}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedJob && (
              <JobDetail
                job={selectedJob}
                saved={savedJobs.has(selectedJob.id)}
                onSave={e => toggleSave(selectedJob.id, e)}
                onClose={() => setSelectedJob(null)}
              />
            )}
          </div>
        </div>
      </div>
    </Bg>
  )
}

export default Jobs
