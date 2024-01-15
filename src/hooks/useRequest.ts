import { useState } from 'react';

interface UseRequestProps {
  request: (...args: any[]) => Promise<any>; // Adjust the type based on your actual API response structure
}

interface UseRequestResult {
  execute: (...args: any[]) => Promise<any>;
  reset: () => void;
  result: any;
  error: any;
  isRunning: boolean;
  wasExecuted: boolean;
}

const useRequest = ({ request }: UseRequestProps): UseRequestResult => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [wasExecuted, setWasExecuted] = useState<boolean>(false);

  async function execute(...args: any[]): Promise<any> {
    setIsRunning(true);
    try {
      const result = await request(...args);
      if (result.data) {
        setResult(result.data);
      } else {
        setResult(result);
      }
      setError(null);
      setIsRunning(false);
      setWasExecuted(true);
      return result;
    } catch (err: any) {
      setError(err.data);
      setIsRunning(false);
      setWasExecuted(true);
      return Promise.reject(err);
    }
  }

  function reset(): void {
    setResult(null);
    setError(null);
    setIsRunning(false);
    setWasExecuted(false);
  }

  return {
    execute,
    reset,
    result,
    error,
    isRunning,
    wasExecuted
  };
};

export default useRequest;
