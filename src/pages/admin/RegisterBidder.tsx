import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Bg from "@/components/Bg"
import Logo from "@/components/Logo"
import { ArrowLeft, ArrowRight, Check, Briefcase, Code2, DollarSign, User } from "lucide-react"
import { useWallet } from "@/context/WalletContext"

const SKILL_OPTIONS = [
  "React", "Vue", "Next.js", "TypeScript", "Solidity", "Rust", "Python",
  "Figma", "Tailwind", "Node.js", "GraphQL", "PostgreSQL", "Hardhat",
  "Foundry", "Web3.js", "Ethers.js", "Docker", "AWS", "Dune Analytics",
]

const AVAILABILITY = ["Full-time", "Part-time", "Weekends only", "Flexible"]

type FormData = {
  bio: string
  skills: string[]
  hourlyRate: string
  portfolio: string
  availability: string
  experience: string
  categories: string[]
}

const steps = [
  { label: "About You",    icon: User      },
  { label: "Skills",       icon: Code2     },
  { label: "Availability", icon: Briefcase },
  { label: "Rates",        icon: DollarSign},
]

const RegisterBidder = () => {
  const navigate = useNavigate()
  const { updateRole } = useWallet()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    bio: "", skills: [], hourlyRate: "", portfolio: "",
    availability: "", experience: "", categories: [],
  })

  const update = (key: keyof FormData, val: string | string[]) =>
    setForm(p => ({ ...p, [key]: val }))

  const toggleSkill = (s: string) =>
    update("skills", form.skills.includes(s)
      ? form.skills.filter(x => x !== s)
      : [...form.skills, s])

  const canNext = [
    form.bio.trim().length > 20,
    form.skills.length >= 1,
    !!form.availability && form.experience.trim().length > 0,
    form.hourlyRate.trim().length > 0,
  ][step]

  const handleSubmit = () => {
    updateRole("worker", "active")
    navigate("/dashboard")
  }

  return (
    <Bg image="/images/bg.png" className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-br from-orange-400 to-amber-400 px-6 py-5 text-white">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <Logo />
          <h2 className="font-bold text-lg mt-1">Register as a Worker</h2>
          <p className="text-white/80 text-sm mt-0.5">Tell us about your skills to start bidding on jobs</p>
        </div>

        {/* Stepper */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2">
            {steps.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    i < step  ? "bg-orange-500 border-orange-500 text-white"
                    : i === step ? "border-orange-500 text-orange-500"
                    : "border-gray-200 text-gray-300"
                  }`}>
                    {i < step ? <Check size={14} /> : <Icon size={14} />}
                  </div>
                  <p className={`text-[9px] font-medium whitespace-nowrap ${i <= step ? "text-orange-600" : "text-gray-300"}`}>{label}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mb-4 ${i < step ? "bg-orange-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-5 space-y-4">

          {step === 0 && (
            <>
              <Field label="Short Bio" required>
                <textarea
                  rows={3}
                  placeholder="Tell clients about yourself, your background and what you do best..."
                  value={form.bio}
                  onChange={e => update("bio", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Portfolio / GitHub / Website">
                <input type="url" placeholder="https://" value={form.portfolio}
                  onChange={e => update("portfolio", e.target.value)} className={inputCls} />
              </Field>
            </>
          )}

          {step === 1 && (
            <Field label="Select your skills" required hint={`${form.skills.length} selected`}>
              <div className="flex flex-wrap gap-2 mt-1">
                {SKILL_OPTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                      form.skills.includes(s)
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {step === 2 && (
            <>
              <Field label="Availability" required>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABILITY.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => update("availability", a)}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.availability === a
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Years of Experience" required>
                <input type="text" placeholder="e.g. 3 years" value={form.experience}
                  onChange={e => update("experience", e.target.value)} className={inputCls} />
              </Field>
            </>
          )}

          {step === 3 && (
            <Field label="Hourly Rate (USD)" required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" placeholder="0" value={form.hourlyRate}
                  onChange={e => update("hourlyRate", e.target.value)}
                  className={`${inputCls} pl-7`} />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Set a competitive rate. You can always update it later.</p>
            </Field>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(p => p - 1)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:border-gray-300 transition-colors">
              <ArrowLeft size={15} />
            </button>
          )}
          <button
            disabled={!canNext}
            onClick={() => step < steps.length - 1 ? setStep(p => p + 1) : handleSubmit()}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {step < steps.length - 1 ? <>Next <ArrowRight size={14} /></> : <>Complete Registration <Check size={14} /></>}
          </button>
        </div>
      </div>
    </Bg>
  )
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"

const Field = ({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
        {label}{required && <span className="text-orange-400 ml-0.5">*</span>}
      </label>
      {hint && <span className="text-[11px] text-orange-500 font-medium">{hint}</span>}
    </div>
    {children}
  </div>
)

export default RegisterBidder
