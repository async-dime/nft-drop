import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import { ConnectWallet } from '@3rdweb/react'

const NFTDropPage = () => {
  // Auth
  // const connectWithMetamask = useMetamask()
  // const address = useAddress()
  // const disconnect = useDisconnect()

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className=" flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2 transition duration-500 hover:scale-105">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://i.imgur.com/byuqHA4.jpg"
              alt="nft"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">Organix Cozmoz</h1>
            <h2 className="text-xl text-gray-300">
              What would outer space be like if it consisted of giant organic
              organisms?
            </h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            <span className="font-extrabold underline decoration-pink-500/50">
              Async-Dime
            </span>{' '}
            NFT Marketplace
          </h1>

          {/* <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button> */}
          <ConnectWallet />
        </header>

        <hr className="my-2 border" />

        {/* {address ? (
          <p className="text-center text-sm text-rose-400">
            You are signed in as {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        ) : null} */}

        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src="https://i.imgur.com/tqYgsND.png"
            alt="nft"
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            Organix Cozmoz | NFT Drop
          </h1>

          <p className="pt-2 text-xl text-green-500">13/ 21 NFTs Claimed</p>
        </div>

        {/* Mint Button */}
        <button className="h-16 w-full rounded-full bg-red-600 font-bold text-white transition duration-500 hover:bg-red-400">
          Mint NFT (0.001 ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage
