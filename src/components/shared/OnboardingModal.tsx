import { useState, useRef } from "react"
import { useWallet } from "@/context/WalletContext"
import { Upload, User, CheckCircle2, Wallet } from "lucide-react"

const OnboardingModal = () => {
  const { showOnboarding, completeOnboarding } = useWallet()
  const [username, setUsername] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [_avatarFile, setAvatarFile] = useState<File | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!showOnboarding) return null

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = ev => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const canContinue = username.trim().length >= 3
  const canFinish = canContinue && !!avatarPreview

  const handleFinish = () => {
    completeOnboarding(
      username.trim(),
      avatarPreview ?? "/images/profile-art.webp",
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-br from-orange-50 to-amber-50 border-b border-orange-100 px-6 py-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-orange-100">
              <Wallet size={18} className="text-orange-500" />
            </div>
            <h2 className="font-bold text-gray-900">Welcome to B3trTrust</h2>
          </div>
          <p className="text-xs text-gray-500 ml-11">Set up your profile to get started.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 pt-5 mb-4">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-colors
                ${step >= s ? "bg-orange-500 border-orange-500 text-white" : "border-gray-200 text-gray-400"}`}>
                {step > s ? <CheckCircle2 size={12} /> : s}
              </div>
              <span className={`text-xs font-medium ${step >= s ? "text-gray-800" : "text-gray-400"}`}>
                {s === 1 ? "Username" : "Photo"}
              </span>
              {s < 2 && <div className={`flex-1 h-px ${step > s ? "bg-orange-300" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="px-6 pb-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest block mb-1.5">
                  Choose a username
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. alex_builder"
                    maxLength={30}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Min 3 characters · letters, numbers, underscores</p>
              </div>
              <button
                disabled={!canContinue}
                onClick={() => setStep(2)}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-sm font-semibold transition-colors">
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest block mb-3">
                  Upload a profile photo
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-orange-300 rounded-2xl p-6 cursor-pointer transition-colors group"
                >
                  {avatarPreview ? (
                    <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                      <img src={avatarPreview} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-gray-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                      <Upload size={24} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {avatarPreview ? "Click to change photo" : "Click to upload · JPG, PNG, WebP"}
                  </p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:border-gray-300 transition-colors">
                  Back
                </button>
                <button
                  disabled={!canFinish}
                  onClick={handleFinish}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 text-white text-sm font-semibold transition-colors">
                  Enter B3trTrust
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal
