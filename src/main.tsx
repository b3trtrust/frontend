import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DAppKitProvider } from '@vechain/dapp-kit-react'
import { WalletProvider } from '@/context/WalletContext'
import OnboardingModal from '@/components/shared/OnboardingModal'

const VECHAIN_NODE = 'https://testnet.vechain.org/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DAppKitProvider
      node={VECHAIN_NODE}
      usePersistence={true}
      v2Api={{ enabled: false }}
      logLevel="DEBUG"
      themeMode="LIGHT"
      allowedWallets={["veworld", "sync2"]}
    >
      <WalletProvider>
        <App />
        <OnboardingModal />
      </WalletProvider>
    </DAppKitProvider>
  </StrictMode>,
)
