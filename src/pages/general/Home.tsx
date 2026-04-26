import Navbar from "@/components/Nav"
import { PrimaryButton, SecondaryButton } from "@/components/Buttons"
import Bg from "@/components/Bg"
import { ArrowRight, Box, CircleDollarSign, ContactRound, CopyCheck, FolderGit2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

const workflowSteps = [
  { icon: Box,              label: "Post a Task",        color: "text-orange-200", lineColor: "border-orange-200" },
  { icon: ContactRound,     label: "Choose Your Person", color: "text-orange-300", lineColor: "border-orange-300" },
  { icon: FolderGit2,       label: "Proof Review",       color: "text-orange-400", lineColor: "border-orange-400" },
  { icon: CopyCheck,        label: "Complete Task",      color: "text-green-300",  lineColor: "border-green-300"  },
  { icon: CircleDollarSign, label: "Release Funds",      color: "text-green-500",  lineColor: null                },
]

const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Navbar />
      <Bg image="/images/bg.png">
        <header className="relative z-10 px-6 sm:px-12 lg:px-20 py-22 flex flex-col min-h-[95vh]">

          {/* Hero: left text / right image */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 pb-12">

            {/* Left: copy + buttons */}
            <div className="flex flex-col items-start text-left w-full lg:w-[50%]">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-snug capitalize">
                creating a trustless work force you can trust
              </h1>
              <p className="mt-5 leading-loose text-sm sm:text-base text-gray-500 max-w-[80%]">
                B3trTrust connects clients and freelancers through a decentralized escrow system — funds are locked on agreement, released only when work is verified, and protected by community arbitration if disputes arise.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 w-full sm:w-auto">
                <PrimaryButton className="w-full sm:w-auto" onClick={() => navigate("/jobs")}>Browse Jobs</PrimaryButton>
                <SecondaryButton className="w-full sm:w-auto" onClick={() => navigate("/escrow/create")}>Post a Job</SecondaryButton>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="flex justify-center lg:justify-end w-full lg:w-[50%]">
              <img src="/images/wfh.png" className="w-full " />
            </div>

          </div>

          {/* Workflow strip pinned to bottom */}
          <div className="bg-black text-white p-4 sm:p-6 w-full rounded-[50px]">

            {/* Desktop: single row */}
            <div className="hidden sm:flex items-center justify-center flex-wrap gap-y-4">
              {workflowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className={`flex flex-col gap-3 items-center justify-center ${step.color} px-2`}>
                    <step.icon size={48} strokeWidth={1.2} />
                    <div className="font-light text-sm whitespace-nowrap">{step.label}</div>
                  </div>
                  {step.lineColor && (
                    <div className={`flex items-center ${workflowSteps[i + 1]?.color ?? ""}`}>
                      <div className={`border ${step.lineColor} w-10 lg:w-16`}></div>
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: vertical stepper */}
            <div className="flex sm:hidden flex-col gap-0 px-6">
              {workflowSteps.map((step, i) => (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`${step.color} mt-1`}>
                      <step.icon size={32} strokeWidth={1.2} />
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <div className={`w-px h-8 border-l ${step.lineColor} mt-1`}></div>
                    )}
                  </div>
                  <div className={`${step.color} font-light text-sm pt-2 pb-6`}>{step.label}</div>
                </div>
              ))}

              <PrimaryButton className="w-full sm:w-auto" onClick={() => navigate("/jobs")}>Get Started</PrimaryButton>
            </div>

          </div>

        </header>
      </Bg>
    </div>
  )
}

export default Home
