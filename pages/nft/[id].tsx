import React, { useState, useEffect } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import toast, { Toaster } from 'react-hot-toast'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import { BigNumber } from 'ethers'
import Link from 'next/link'

interface Props {
  collection: Collection
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [loading, setLoading] = useState<boolean>(true)
  const [priceInEth, setPriceInEth] = useState<string>()
  const nftDrop = useNFTDrop(collection.address)

  // Auth
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  useEffect(() => {
    if (!nftDrop) return

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchPrice()
  }, [nftDrop])

  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)

      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
    }

    fetchNFTDropData()
  }, [nftDrop])

  const mintNft = () => {
    if (!nftDrop || !address) return

    const quantity = 1 // unique nft that can be minted

    setLoading(true)

    const notification = toast.loading(
      `Minting ${collection.nftCollectionName}...`,
      {
        style: {
          background: 'white',
          color: '#9B73E6',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '15px 25px',
        },
      }
    )

    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt // tx receipt
        const claimedTokenId = tx[0].id // the ID of the NFT claimed
        const claimedNft = await tx[0].data() // (optional) get the claimed metadata - attributes etc.

        console.log(receipt)
        console.log(claimedTokenId)
        console.log(claimedNft)

        toast.success(`${collection.nftCollectionName} minted!`, {
          icon: '🌠',
          duration: 8000,
          style: {
            background: 'white',
            color: 'green',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '15px 25px',
          },
        })
      })
      .catch((err) => {
        console.error(err)
        toast.error(`Sorry, something went wrong!`, {
          icon: '🛑',
          style: {
            background: 'white',
            color: 'red',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '15px 25px',
          },
        })
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />
      {/* Left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className=" flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2 transition duration-500 hover:scale-105">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt="nft"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/">
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              <span className="font-extrabold underline decoration-pink-500/50">
                Async-Dime
              </span>{' '}
              NFT Marketplace
            </h1>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>

        <hr className="my-2 border" />

        {address ? (
          <p className="text-center text-sm text-rose-400">
            You are signed in as {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        ) : null}

        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt="nft"
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
          </h1>

          {loading ? (
            <p className="animate-pulse pt-2 text-xl text-red-400">
              Loading supply count. . .
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply}/ {totalSupply?.toString()} NFTs Claimed
            </p>
          )}

          {loading ? (
            <img
              className="h-80 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt="loading"
            />
          ) : null}
        </div>

        {/* Mint Button */}
        <button
          onClick={mintNft}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="mt-10 h-16 w-full rounded-full bg-red-600 font-bold text-white transition duration-500 hover:bg-red-400 disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign in to Mint</>
          ) : (
            <span className="font-bold">Mint NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current== $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      }
    }
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
