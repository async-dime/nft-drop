import '../styles/globals.css'
import type { AppProps } from 'next/app'
// import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import { ThirdwebProvider } from '@3rdweb/react'

function MyApp({ Component, pageProps }: AppProps) {
  // Ethereum Rinkeby Testnet chain ID is 4, see https://umbria.network/connect/ethereum-testnet-rinkeby
  const supportedChainIds = [4]

  // We'll only support MetaMask which is an injected connector
  const connectors = {
    injected: {},
  }
  return (
    <ThirdwebProvider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}

export default MyApp
