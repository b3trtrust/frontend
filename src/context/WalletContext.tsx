import {
  createContext, useContext, useState, useEffect, type ReactNode,
} from "react"
import {
  useWallet as useDAppKitWallet,
  useWalletModal,
} from "@vechain/dapp-kit-react"

// Profile data stored off-chain (localStorage for now; move to backend/IPFS in production)
const PROFILES_KEY = "b3trtrust_profiles"

type Profile = {
  username: string
  avatar: string            // data-URL or remote URL
  roles: {
    worker:     "none" | "pending" | "active"
    arbitrator: "none" | "pending" | "active"
    trustTeam:  boolean
  }
}

function loadProfile(address: string): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    if (!raw) return null
    const map: Record<string, Profile> = JSON.parse(raw)
    return map[address.toLowerCase()] ?? null
  } catch {
    return null
  }
}

function saveProfile(address: string, profile: Profile) {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    const map: Record<string, Profile> = raw ? JSON.parse(raw) : {}
    map[address.toLowerCase()] = profile
    localStorage.setItem(PROFILES_KEY, JSON.stringify(map))
  } catch { /* ignore */ }
}

export type WalletUser = Profile & { address: string }

type WalletContextType = {
  user:               WalletUser | null
  isConnected:        boolean
  showOnboarding:     boolean
  connectWallet:      () => void
  disconnect:         () => void
  completeOnboarding: (username: string, avatar: string) => void
  updateRole:         (role: "worker" | "arbitrator", status: "none" | "pending" | "active") => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const dappKit            = useDAppKitWallet()
  const { open: openModal } = useWalletModal()

  const [user, setUser]                   = useState<WalletUser | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // React to DAppKit account changes (connect / disconnect / page reload with persistence)
  useEffect(() => {
    const address = dappKit.account

    if (!address) {
      setUser(null)
      setShowOnboarding(false)
      return
    }

    const profile = loadProfile(address)

    if (profile) {
      // Returning user — restore profile silently
      setUser({ address, ...profile })
      setShowOnboarding(false)
    } else {
      // First time this wallet has connected — trigger onboarding
      setUser(null)
      setShowOnboarding(true)
    }
  }, [dappKit.account])

  const connectWallet = () => {
    // Opens the DAppKit wallet picker modal (VeWorld, Sync2, WalletConnect)
    openModal()
  }

  const disconnect = () => {
    dappKit.disconnect()
    setUser(null)
    setShowOnboarding(false)
  }

  const updateRole = (role: "worker" | "arbitrator", status: "none" | "pending" | "active") => {
    const address = dappKit.account
    if (!address || !user) return
    const updated: Profile = { ...user, roles: { ...user.roles, [role]: status } }
    saveProfile(address, updated)
    setUser({ address, ...updated })
  }

  const completeOnboarding = (username: string, avatar: string) => {
    const address = dappKit.account
    if (!address) return

    const profile: Profile = {
      username,
      avatar,
      roles: { worker: "none", arbitrator: "none", trustTeam: false },
    }

    saveProfile(address, profile)
    setUser({ address, ...profile })
    setShowOnboarding(false)
  }

  return (
    <WalletContext.Provider value={{
      user,
      isConnected: !!user,
      showOnboarding,
      connectWallet,
      disconnect,
      completeOnboarding,
      updateRole,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used within WalletProvider")
  return ctx
}
