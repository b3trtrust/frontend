import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, Bell, ChevronRight, LogOut } from "lucide-react"
import { WalletButton } from "@vechain/dapp-kit-react"
import { useWallet } from "@/context/WalletContext"

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Your bid on 'React DeFi Dashboard' was accepted.", time: "2m ago",  unread: true  },
  { id: 2, text: "Arbitrator Jane Doe resolved your dispute.",        time: "1h ago",  unread: true  },
  { id: 3, text: "New message from ChainLabs.",                      time: "3h ago",  unread: false },
]

const ProfileMenu = () => {
  const [open, setOpen]           = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const ref                       = useRef<HTMLDivElement>(null)
  const navigate                  = useNavigate()
  const { user, isConnected, disconnect } = useWallet()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length

  if (!isConnected) {
    return <WalletButton />
  }

  const shortAddr = `${user!.address.slice(0, 6)}...${user!.address.slice(-4)}`

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => { setOpen(p => !p); setNotifOpen(false) }}
        className="h-9 w-9 rounded-full overflow-hidden border-2 border-orange-300 hover:border-orange-500 transition-colors relative"
      >
        <img src={user!.avatar} className="h-full w-full object-cover" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-orange-500 border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-slide-in">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-sm text-gray-900">{user!.username}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{shortAddr}</p>
          </div>

          <button
            onClick={() => setNotifOpen(p => !p)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <span className="flex items-center gap-2.5"><Bell size={15} />Notifications</span>
            <span className="flex items-center gap-1">
              {unreadCount > 0 && (
                <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-semibold">{unreadCount}</span>
              )}
              <ChevronRight size={13} className={`transition-transform ${notifOpen ? "rotate-90" : ""}`} />
            </span>
          </button>

          {notifOpen && (
            <div className="mx-2 mb-1 rounded-xl bg-gray-50 border border-gray-100 divide-y divide-gray-100">
              {MOCK_NOTIFICATIONS.map(n => (
                <div key={n.id} className="px-3 py-2.5 flex gap-2 items-start">
                  {n.unread && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />}
                  <div className={n.unread ? "" : "pl-3.5"}>
                    <p className="text-[11px] text-gray-700 leading-snug">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { navigate("/dashboard"); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <LayoutDashboard size={15} /> My Dashboard
          </button>

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => { disconnect(); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} /> Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
