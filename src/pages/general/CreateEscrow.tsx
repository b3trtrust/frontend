import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Bg from "@/components/Bg"
import Logo from "@/components/Logo"
import {
  ArrowLeft, ArrowRight, Check, Globe, Lock, Plus, Trash2,
  Shield, Coins, Calendar, FileText, Gavel, Info,
} from "lucide-react"
import { useWallet } from "@/context/WalletContext"
import { createJob } from "@/store/demoStore"

type ConditionDraft = {
  title: string
  desc: string
  proofDesc: string
  proofType: string
  pct: number
  deadline: string
  autoApprove: boolean
}

type FormData = {
  type: "public" | "private"
  title: string
  desc: string
  category: string
  arbitratorWallet: string
  globalDeadline: string
  conditions: ConditionDraft[]
  tokenSymbol: string
  totalAmount: string
}

const CATEGORIES = ["Development", "Design", "Marketing", "Writing", "Web3", "AI / ML", "Data", "Security"]
const PROOF_TYPES = ["document", "image", "hash", "oracle", "attestation"]

const steps = [
  { label: "Job Type",     icon: Globe    },
  { label: "Job Details",  icon: FileText },
  { label: "Milestones",   icon: Check    },
  { label: "Arbitrator",   icon: Gavel    },
  { label: "Fund & Lock",  icon: Coins    },
]

const emptyCondition = (): ConditionDraft => ({
  title: "", desc: "", proofDesc: "", proofType: "document",
  pct: 0, deadline: "", autoApprove: false,
})

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5"

const CreateEscrow = () => {
  const navigate = useNavigate()
  const { user } = useWallet()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    type: "public", title: "", desc: "", category: "", arbitratorWallet: "",
    globalDeadline: "", conditions: [emptyCondition()],
    tokenSymbol: "VET", totalAmount: "",
  })

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  const setCond = (i: number, k: keyof ConditionDraft, v: string | number | boolean) =>
    setForm(p => {
      const conditions = [...p.conditions]
      conditions[i] = { ...conditions[i], [k]: v }
      return { ...p, conditions }
    })

  const addCond = () => setForm(p => ({ ...p, conditions: [...p.conditions, emptyCondition()] }))
  const removeCond = (i: number) => setForm(p => ({ ...p, conditions: p.conditions.filter((_, j) => j !== i) }))

  const totalPct = form.conditions.reduce((s, c) => s + (Number(c.pct) || 0), 0)

  const canNext = [
    true,
    form.title.trim().length >= 5 && !!form.category && !!form.globalDeadline,
    form.conditions.length >= 1 && totalPct === 100 && form.conditions.every(c => c.title && c.deadline),
    true,
    form.totalAmount.trim().length > 0,
  ][step]

  return (
    <Bg image="/images/bg.png" className="min-h-screen flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <Logo />
          <span className="text-gray-300 text-lg">·</span>
          <span className="text-sm text-gray-500 font-medium">Create Escrow</span>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-6 bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-3">
          {steps.map(({ label, icon: Icon }, i) => (
            <div key={label} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all text-sm ${
                  i < step  ? "bg-orange-500 border-orange-500 text-white"
                  : i === step ? "border-orange-500 text-orange-500 bg-orange-50"
                  : "border-gray-200 text-gray-300"
                }`}>
                  {i < step ? <Check size={13} /> : <Icon size={13} />}
                </div>
                <p className={`text-[9px] font-semibold hidden sm:block whitespace-nowrap ${i <= step ? "text-orange-600" : "text-gray-300"}`}>{label}</p>
              </div>
              {i < steps.length - 1 && <div className={`w-3 h-px shrink-0 ${i < step ? "bg-orange-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step cards */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Step 0 — Job Type */}
          {step === 0 && (
            <div className="p-6 space-y-4">
              <StepHeader title="What type of escrow?" sub="Public posts are visible to all bidders. Private posts are invitation-only." />
              <div className="grid grid-cols-2 gap-4">
                {([
                  { type: "public",  icon: Globe, title: "Public",  desc: "Visible on the job board. Open to all qualified bidders." },
                  { type: "private", icon: Lock,  title: "Private", desc: "Invite-only. Share directly with a specific worker."       },
                ] as const).map(({ type, icon: Icon, title, desc }) => (
                  <button key={type} onClick={() => set("type", type)}
                    className={`flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all ${
                      form.type === type ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-200"
                    }`}>
                    <div className={`p-2.5 rounded-xl mb-3 ${form.type === type ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                      <Icon size={18} />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
                  </button>
                ))}
              </div>
              <InfoBox text="Both types use the same on-chain escrow. Funds are locked and released only when milestones are verified." />
            </div>
          )}

          {/* Step 1 — Job Details */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              <StepHeader title="Describe the job" sub="Be clear and specific. A good title and description attract better bids." />
              <div>
                <label className={labelCls}>Job Title <Req /></label>
                <input className={inputCls} placeholder="e.g. Senior React Developer for DeFi Dashboard" value={form.title} onChange={e => set("title", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Description <Req /></label>
                <textarea className={inputCls} rows={4} placeholder="What needs to be built? What does success look like? Any specific technical requirements?" value={form.desc} onChange={e => set("desc", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Category <Req /></label>
                  <select className={inputCls} value={form.category} onChange={e => set("category", e.target.value)}>
                    <option value="">Select...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Global Deadline <Req /></label>
                  <input type="date" className={inputCls} value={form.globalDeadline} onChange={e => set("globalDeadline", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Milestones */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              <StepHeader title="Define milestones" sub="Break the job into verifiable milestones. Percentages must total exactly 100%." />
              <div className={`flex items-center justify-between text-xs font-semibold rounded-xl px-3 py-2 ${totalPct === 100 ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>
                <span>Total allocated</span>
                <span>{totalPct}% {totalPct === 100 ? "✓" : `— need ${100 - totalPct}% more`}</span>
              </div>

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {form.conditions.map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Milestone {i + 1}</span>
                      {form.conditions.length > 1 && (
                        <button onClick={() => removeCond(i)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <input className={inputCls} placeholder="Milestone title" value={c.title} onChange={e => setCond(i, "title", e.target.value)} />
                    <textarea className={inputCls} rows={2} placeholder="What must be delivered for this milestone?" value={c.desc} onChange={e => setCond(i, "desc", e.target.value)} />
                    <textarea className={inputCls} rows={2} placeholder="What proof is required? (e.g. GitHub PR link, video demo, document)" value={c.proofDesc} onChange={e => setCond(i, "proofDesc", e.target.value)} />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className={labelCls}>Proof Type</label>
                        <select className={inputCls} value={c.proofType} onChange={e => setCond(i, "proofType", e.target.value)}>
                          {PROOF_TYPES.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>% of Budget</label>
                        <input type="number" className={inputCls} min={1} max={100} placeholder="0" value={c.pct || ""} onChange={e => setCond(i, "pct", Number(e.target.value))} />
                      </div>
                      <div>
                        <label className={labelCls}>Deadline</label>
                        <input type="date" className={inputCls} value={c.deadline} onChange={e => setCond(i, "deadline", e.target.value)} />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={c.autoApprove} onChange={e => setCond(i, "autoApprove", e.target.checked)} className="accent-orange-500" />
                      <span className="text-xs text-gray-600">Auto-approve if deadline passes with no action</span>
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={addCond} className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center justify-center gap-2">
                <Plus size={15} /> Add Milestone
              </button>
            </div>
          )}

          {/* Step 3 — Arbitrator */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <StepHeader title="Choose an arbitrator" sub="The arbitrator resolves disputes. They stake 1,000 B3TR and earn 1% of the escrow value if invoked." />
              <div>
                <label className={labelCls}>Arbitrator Wallet Address</label>
                <input className={inputCls} placeholder="0x... (leave blank to auto-assign)" value={form.arbitratorWallet} onChange={e => set("arbitratorWallet", e.target.value)} />
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Suggested Arbitrators</p>
                {[
                  { name: "Jane Doe",   wallet: "0x1a2b...3c4d", specialty: "Contract Disputes", rating: 4.9, cases: 124 },
                  { name: "Aiko Tanaka",wallet: "0x5e6f...7g8h", specialty: "DeFi Protocols",    rating: 4.8, cases: 203 },
                ].map(a => (
                  <button key={a.wallet} onClick={() => set("arbitratorWallet", a.wallet)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      form.arbitratorWallet === a.wallet ? "border-orange-300 bg-orange-50" : "border-gray-200 hover:border-orange-200 bg-white"
                    }`}>
                    <div className="h-9 w-9 rounded-xl overflow-hidden border border-orange-100 shrink-0">
                      <img src="/images/profile-art.webp" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                      <p className="text-[11px] text-gray-400">{a.specialty} · {a.rating}★ · {a.cases} cases</p>
                    </div>
                    {form.arbitratorWallet === a.wallet && <Check size={14} className="text-orange-500 shrink-0" />}
                  </button>
                ))}
              </div>
              <InfoBox text="The arbitrator has 72 hours to rule once assigned. Either party can appeal to the Trust Team within 14 days." />
            </div>
          )}

          {/* Step 4 — Fund & Lock */}
          {step === 4 && (
            <div className="p-6 space-y-4">
              <StepHeader title="Fund & lock escrow" sub="Funds are locked on-chain before work begins. Workers can only be paid once milestones are verified." />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Token <Req /></label>
                  <select className={inputCls} value={form.tokenSymbol} onChange={e => set("tokenSymbol", e.target.value)}>
                    {["VET", "B3TR", "VTHO"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Total Amount <Req /></label>
                  <input type="number" className={inputCls} placeholder="0.00" value={form.totalAmount} onChange={e => set("totalAmount", e.target.value)} />
                </div>
              </div>

              {/* Breakdown */}
              {form.totalAmount && (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Fee Breakdown</p>
                  {form.conditions.map((c, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate flex-1 pr-2">{c.title || `Milestone ${i + 1}`}</span>
                      <span className="font-medium text-gray-800 shrink-0">{c.pct}% · {form.tokenSymbol} {((Number(form.totalAmount) * c.pct) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 space-y-1">
                    {[
                      { label: "Platform fee (1.5%)", val: (Number(form.totalAmount) * 0.015).toFixed(2) },
                      { label: "Arbitrator fee (1%)", val: (Number(form.totalAmount) * 0.01).toFixed(2)  },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between text-xs text-gray-500">
                        <span>{label}</span><span>{form.tokenSymbol} {val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-200">
                      <span>Total to lock</span>
                      <span className="text-orange-600">{form.tokenSymbol} {Number(form.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
                <Shield size={16} className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-xs text-green-700 leading-relaxed">
                  Funds will be sent to a smart contract vault on VeChain. Only milestone approvals release payments. You retain full control until a bidder is accepted.
                </p>
              </div>
              <button
                onClick={() => {
                  const job = createJob({
                    type: form.type,
                    title: form.title,
                    desc: form.desc,
                    category: form.category,
                    globalDeadline: form.globalDeadline,
                    tokenSymbol: form.tokenSymbol,
                    totalAmount: form.totalAmount,
                    arbitratorWallet: form.arbitratorWallet || "0x1a2b...3c4d",
                    creatorAddress: user?.address ?? "0xDEMO_CREATOR",
                    conditions: form.conditions.map(c => ({ ...c, status: "pending" as const })),
                  })
                  navigate(`/jobs/${job.id}`)
                }}
                disabled={!canNext}
                className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 text-white font-bold transition-colors flex items-center justify-center gap-2">
                <Lock size={16} /> Lock Funds & Create Escrow
              </button>
            </div>
          )}

          {/* Footer nav */}
          {step < 4 && (
            <div className="px-6 pb-6 flex gap-3 border-t border-gray-100 pt-4">
              {step > 0 && (
                <button onClick={() => setStep(p => p - 1)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:border-gray-300 transition-colors flex items-center gap-1.5">
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              <button disabled={!canNext} onClick={() => setStep(p => p + 1)}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                Continue <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Calendar hint */}
        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <Calendar size={11} /> Escrow lives on VeChain testnet. No real funds are at risk during development.
        </p>
      </div>
    </Bg>
  )
}

const StepHeader = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-2">
    <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
    <p className="text-sm text-gray-500 mt-0.5">{sub}</p>
  </div>
)

const InfoBox = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3">
    <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
    <p className="text-xs text-blue-600 leading-relaxed">{text}</p>
  </div>
)

const Req = () => <span className="text-orange-400">*</span>

export default CreateEscrow
