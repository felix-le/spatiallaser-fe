import { useState, useEffect } from 'react'

interface UseRequestProps {
  request: (...args: any[]) => Promise<any>
}

interface UseRequestResult {
  execute: (...args: any[]) => Promise<any>
  reset: () => void
  result: any
  error: any
  isRunning: boolean
  wasExecuted: boolean
}

const useRequest = ({ request }: UseRequestProps): UseRequestResult => {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [wasExecuted, setWasExecuted] = useState<boolean>(false)

  async function execute(...args: any[]): Promise<any> {
    setIsRunning(true)
    try {
      const response = await request(...args)
      setResult(response.data ?? response)
      setError(null)
      setIsRunning(false)
      setWasExecuted(true)
      return response
    } catch (err: any) {
      setError(err.response?.data ?? err.message)
      setIsRunning(false)
      setWasExecuted(true)
      return Promise.reject(err)
    }
  }

  function reset(): void {
    setResult(null)
    setError(null)
    setIsRunning(false)
    setWasExecuted(false)
  }

  useEffect(() => {
    // Clean up any remaining state on unmount
    return reset
  }, [])

  return {
    execute,
    reset,
    result,
    error,
    isRunning,
    wasExecuted
  }
}

export default useRequest
