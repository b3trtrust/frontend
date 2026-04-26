import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Bg from "@/components/Bg"
import Logo from "@/components/Logo"
import { ArrowLeft, ArrowRight, Check, Gavel, Shield, FileText, Star } from "lucide-react"
import { useWallet } from "@/context/WalletContext"

const SPECIALTY_OPTIONS = [
  "Contract Disputes", "DeFi Protocols", "IP & Copyright", "DAO Governance",
  "Smart Contracts", "Web3 & NFTs", "Security", "General",
]

const EXPERIENCE_OPTIONS = ["1–2 years", "3–5 years", "5–10 years", "10+ years"]
const LANG_OPTIONS = ["English", "Spanish", "French", "Mandarin", "Arabic", "Portuguese", "German"]

type FormData = {
  bio: string
  specialties: string[]
  experience: string
  languages: string[]
  linkedIn: string
  certifications: string
  walletAddress: string
  hourlyRate: string
  agreeToTerms: boolean
}

const steps = [
  { label: "Background",   icon: FileText },
  { label: "Specialties",  icon: Gavel    },
  { label: "Verification", icon: Shield   },
  { label: "Rate & Terms", icon: Star     },
]

const RegisterArbitrator = () => {
  const navigate = useNavigate()
  const { updateRole } = useWallet()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    bio: "", specialties: [], experience: "", languages: [],
    linkedIn: "", certifications: "", walletAddress: "", hourlyRate: "", agreeToTerms: false,
  })

  const update = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(p => ({ ...p, [key]: val }))

  const toggleArr = (key: "specialties" | "languages", val: string) => {
    const arr = form[key] as string[]
    update(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const canNext = [
    form.bio.trim().length > 30 && !!form.experience,
    form.specialties.length >= 1,
    form.walletAddress.trim().length > 10,
    form.hourlyRate.trim().length > 0 && form.agreeToTerms,
  ][step]

  return (
    <Bg image="/images/bg.png" className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-br from-gray-700 to-gray-900 px-6 py-5 text-white">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <Logo />
          <h2 className="font-bold text-lg mt-1">Register as an Arbitrator</h2>
          <p className="text-white/60 text-sm mt-0.5">Provide your details to start resolving disputes and earning fees</p>
        </div>

        {/* Stepper */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2">
            {steps.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    i < step    ? "bg-gray-800 border-gray-800 text-white"
                    : i === step ? "border-gray-800 text-gray-800"
                    : "border-gray-200 text-gray-300"
                  }`}>
                    {i < step ? <Check size={14} /> : <Icon size={14} />}
                  </div>
                  <p className={`text-[9px] font-medium whitespace-nowrap ${i <= step ? "text-gray-700" : "text-gray-300"}`}>{label}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mb-4 ${i < step ? "bg-gray-700" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-5 space-y-4">

          {step === 0 && (
            <>
              <Field label="Professional Bio" required>
                <textarea rows={3} placeholder="Describe your legal, technical, or domain expertise and why you'd make a great arbitrator..."
                  value={form.bio} onChange={e => update("bio", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Years of Relevant Experience" required>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERIENCE_OPTIONS.map(o => (
                    <button key={o} type="button" onClick={() => update("experience", o)}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.experience === o ? "bg-gray-800 border-gray-800 text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}>{o}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Languages Spoken">
                <div className="flex flex-wrap gap-2 mt-1">
                  {LANG_OPTIONS.map(l => (
                    <button key={l} type="button" onClick={() => toggleArr("languages", l)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                        form.languages.includes(l) ? "bg-gray-800 border-gray-800 text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}>{l}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Areas of Specialization" required hint={`${form.specialties.length} selected`}>
                <div className="flex flex-wrap gap-2 mt-1">
                  {SPECIALTY_OPTIONS.map(s => (
                    <button key={s} type="button" onClick={() => toggleArr("specialties", s)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                        form.specialties.includes(s) ? "bg-gray-800 border-gray-800 text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}>{s}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Relevant Certifications / Credentials">
                <textarea rows={2} placeholder="e.g. LLB, Blockchain Certification, 5 years as corporate mediator..."
                  value={form.certifications} onChange={e => update("certifications", e.target.value)} className={inputCls} />
              </Field>
              <Field label="LinkedIn Profile">
                <input type="url" placeholder="https://linkedin.com/in/..." value={form.linkedIn}
                  onChange={e => update("linkedIn", e.target.value)} className={inputCls} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={15} className="text-amber-500" />
                  <span className="text-sm font-semibold text-amber-700">Identity Verification</span>
                </div>
                <p className="text-xs text-amber-600 leading-relaxed">
                  To become a trusted arbitrator on B3trTrust your wallet address is used as your on-chain identity. Ensure this matches the wallet you'll use to receive arbitration fees.
                </p>
              </div>
              <Field label="Wallet Address" required>
                <input type="text" placeholder="0x..." value={form.walletAddress}
                  onChange={e => update("walletAddress", e.target.value)} className={inputCls} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Arbitration Fee (USD / hour)" required>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" placeholder="0" value={form.hourlyRate}
                    onChange={e => update("hourlyRate", e.target.value)} className={`${inputCls} pl-7`} />
                </div>
              </Field>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2 text-xs text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-800">Terms & Responsibilities</p>
                <p>• You must remain impartial and make decisions based on evidence alone.</p>
                <p>• Decisions are final and recorded on-chain once submitted.</p>
                <p>• B3trTrust retains a 10% platform fee from arbitration earnings.</p>
                <p>• Misconduct will result in removal from the arbitrator registry.</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agreeToTerms}
                  onChange={e => update("agreeToTerms", e.target.checked)}
                  className="mt-0.5 accent-orange-500" />
                <span className="text-sm text-gray-600">I agree to the arbitrator terms and responsibilities</span>
              </label>
            </>
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
            onClick={() => step < steps.length - 1 ? setStep(p => p + 1) : (() => { updateRole("arbitrator", "active"); navigate("/dashboard") })()}
            className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 disabled:bg-gray-100 disabled:text-gray-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {step < steps.length - 1 ? <>Next <ArrowRight size={14} /></> : <>Submit Application <Check size={14} /></>}
          </button>
        </div>
      </div>
    </Bg>
  )
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"

const Field = ({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
        {label}{required && <span className="text-orange-400 ml-0.5">*</span>}
      </label>
      {hint && <span className="text-[11px] text-gray-600 font-medium">{hint}</span>}
    </div>
    {children}
  </div>
)

export default RegisterArbitrator
