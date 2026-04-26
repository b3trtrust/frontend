import { X, ChevronRight, Users, Wallet } from "lucide-react"
import { Link } from "react-router-dom"
import Logo from "@/components/Logo"
import { bidderCategories } from "@/data/bidderCategories"
import { MOCK_BIDDERS } from "@/data/mockBidders"
import { useWallet } from "@/context/WalletContext"

type Props = {
  open: boolean
  onClose: () => void
  selectedCategory: string | null
  onSelectCategory: (c: string | null) => void
}

const navLinks = [
  { name: "Home",        link: "/" },
  { name: "Find Jobs",   link: "/jobs" },
  { name: "Arbitrators", link: "/arbitrators" },
  { name: "Bidders",     link: "/bidders" },
]

const BiddersSidebar = ({ open, onClose, selectedCategory, onSelectCategory }: Props) => {
  const { isConnected, connectWallet, disconnect } = useWallet()
  return (
  <>
    {open && (
      <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
    )}

    <aside className={`
      fixed lg:relative top-0 left-0 h-full z-40 lg:z-auto
      w-72 shrink-0 bg-white/80 backdrop-blur-xl border-r border-orange-100
      flex flex-col transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}>
      <div className="p-6 border-b border-orange-100 flex items-center justify-between">
        <Logo />
        <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <nav className="px-4 pt-4 flex flex-col gap-1">
        {navLinks.map(({ name, link }) => (
          <Link
            key={name}
            to={link}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <ChevronRight size={14} className="text-orange-300" />
            {name}
          </Link>
        ))}
      </nav>

      <div className="mx-4 my-4 border-t border-orange-100" />

      <div className="px-4 flex-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
          Categories
        </p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
              !selectedCategory
                ? "bg-orange-500 text-white font-semibold"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users size={15} />
              All Bidders
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${!selectedCategory ? "bg-white/20 text-white" : "bg-orange-100 text-orange-500"}`}>
              {MOCK_BIDDERS.length}
            </span>
          </button>

          {bidderCategories.map(({ label, icon: Icon, count }) => (
            <button
              key={label}
              onClick={() => onSelectCategory(label === selectedCategory ? null : label)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                selectedCategory === label
                  ? "bg-orange-500 text-white font-semibold"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon size={15} />
                {label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === label ? "bg-white/20 text-white" : "bg-orange-100 text-orange-500"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-orange-100">
        {isConnected ? (
          <button onClick={disconnect}
            className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
            Disconnect Wallet
          </button>
        ) : (
          <button onClick={connectWallet}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
            <Wallet size={15} /> Connect Wallet
          </button>
        )}
      </div>
    </aside>
  </>
  )
}

export default BiddersSidebar
