import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { WalletButton } from "@vechain/dapp-kit-react"
import Logo from "@/components/Logo"
import { useWallet } from "@/context/WalletContext"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isConnected, user, disconnect } = useWallet()

  const navLinks = [
    { name: "Home",        link: "/"            },
    { name: "Find Jobs",   link: "/jobs"        },
    { name: "Arbitrators", link: "/arbitrators" },
    { name: "Bidders",     link: "/bidders"     },
  ]

  return (
    <nav className="min-[1234px]:bg-white/70 backdrop-blur-lg fixed top-0 left-0 w-full z-10">
      <div className="flex items-center justify-between p-3 px-6 relative">
        <Logo />

        {/* Desktop nav links */}
        <div className="hidden min-[1234px]:flex items-center gap-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map(({ name, link }) => (
            <Link key={name} to={link} className="cursor-pointer">{name}</Link>
          ))}
        </div>

        {/* Desktop wallet button */}
        <div className="hidden min-[1234px]:flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-2xl px-3 py-1.5">
                <img src={user!.avatar} className="h-6 w-6 rounded-full object-cover border border-orange-200" />
                <span className="text-sm font-medium text-gray-800">{user!.username}</span>
              </div>
              <button
                onClick={disconnect}
                className="border border-gray-300 rounded-3xl p-3 px-6 text-sm text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <WalletButton />
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="min-[1234px]:hidden" onClick={() => setMenuOpen(prev => !prev)}>
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="min-[1234px]:hidden flex flex-col px-6 pb-6 gap-4">
          {navLinks.map(({ name, link }) => (
            <Link key={name} to={link} onClick={() => setMenuOpen(false)}
              className="py-2 border-b border-gray-500/20 cursor-pointer">{name}</Link>
          ))}
          <div className="mt-2">
            {isConnected ? (
              <button
                onClick={() => { disconnect(); setMenuOpen(false) }}
                className="w-full border border-gray-300 rounded-xl p-3 text-red-500 hover:bg-red-50 transition-colors"
              >
                Disconnect Wallet
              </button>
            ) : (
              <div onClick={() => setMenuOpen(false)}>
                <WalletButton />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
