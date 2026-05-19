import { useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'

const ARC_CHAIN_ID = 5042002
const ARC_HEX = '0x4cef52'
const ARC_RPC = 'https://rpc.testnet.arc.network'
const ARC_EXPLORER = 'https://testnet.arcscan.app'

const ARC_NETWORK_PARAMS = {
  chainId: ARC_HEX,
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: [ARC_RPC],
  blockExplorerUrls: [ARC_EXPLORER],
}

export function useWallet() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const [agentId, setAgentIdState] = useState(() => {
    return localStorage.getItem('arc_agent_id') || null
  })

  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem('arc_activity')
    return saved ? JSON.parse(saved) : []
  })

  const isArcNetwork = chainId === ARC_CHAIN_ID

  const setAgentId = useCallback((id) => {
    if (!id) {
      localStorage.removeItem('arc_agent_id')
      setAgentIdState(null)
      return
    }

    localStorage.setItem('arc_agent_id', id.toString())
    setAgentIdState(id.toString())
  }, [])

  const addActivity = useCallback((entry) => {
    setActivity((prev) => {
      const updated = [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...entry,
        },
        ...prev.slice(0, 49),
      ]

      localStorage.setItem(
        'arc_activity',
        JSON.stringify(updated)
      )

      return updated
    })
  }, [])

  const clearSession = useCallback(() => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    setError(null)
  }, [])

  const switchToArc = useCallback(async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_HEX }],
      })
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ARC_NETWORK_PARAMS],
          })
        } catch (addError) {
          setError(
            'Failed to add Arc network: ' +
              addError.message
          )
        }
      } else {
        setError(
          'Failed to switch network: ' +
            switchError.message
        )
      }
    }
  }, [])

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const provider = new ethers.BrowserProvider(
        window.ethereum
      )

      await provider.send('eth_requestAccounts', [])

      const signer = await provider.getSigner()
      const account = await signer.getAddress()
      const network = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAccount(account)
      setChainId(Number(network.chainId))

      if (Number(network.chainId) !== ARC_CHAIN_ID) {
        await switchToArc()
      }
    } catch (e) {
      setError(
        e?.reason ||
          e?.shortMessage ||
          e?.message ||
          'Wallet connection failed'
      )
    } finally {
      setIsConnecting(false)
    }
  }, [switchToArc])

  const disconnect = useCallback(() => {
    clearSession()
  }, [clearSession])

  const copyAddress = useCallback(() => {
    if (account) {
      navigator.clipboard.writeText(account)
    }
  }, [account])

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = async (accounts) => {
      if (!accounts || accounts.length === 0) {
        clearSession()
        return
      }

      try {
        const provider = new ethers.BrowserProvider(
          window.ethereum
        )

        const signer = await provider.getSigner()
        const network = await provider.getNetwork()

        setProvider(provider)
        setSigner(signer)
        setAccount(accounts[0])
        setChainId(Number(network.chainId))
        setError(null)
      } catch (e) {
        setError('Wallet refresh failed')
      }
    }

    const handleChainChanged = async (hexChainId) => {
      try {
        const newChainId = parseInt(hexChainId, 16)

        const provider = new ethers.BrowserProvider(
          window.ethereum
        )

        const signer = await provider.getSigner()

        setProvider(provider)
        setSigner(signer)
        setChainId(newChainId)
        setError(null)

        addActivity({
          type: 'network',
          label: 'Network Switched',
          detail: `Chain changed to ${newChainId}`,
          status: 'success',
        })
      } catch (e) {
        setError('Failed refreshing after network switch')
      }
    }

    window.ethereum.on(
      'accountsChanged',
      handleAccountsChanged
    )

    window.ethereum.on(
      'chainChanged',
      handleChainChanged
    )

    return () => {
      window.ethereum.removeListener(
        'accountsChanged',
        handleAccountsChanged
      )

      window.ethereum.removeListener(
        'chainChanged',
        handleChainChanged
      )
    }
  }, [clearSession, addActivity])

  return {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error,
    isArcNetwork,
    agentId,
    setAgentId,
    activity,
    addActivity,
    connect,
    disconnect,
    switchToArc,
    copyAddress,
    ARC_EXPLORER,
  }
}