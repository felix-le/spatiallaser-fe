import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseRequestProps {
  request: (...args: any[]) => Promise<any>;
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

  async function fetchData(...args: any[]): Promise<any> {
    try {
      const resp = await request(...args);
      const contentType = resp.headers['content-type'];

      if (contentType && contentType.includes('json')) {
        const responseData = resp.data;
        setResult(responseData);
        setError(null);
        setIsRunning(false);
        setWasExecuted(true);
        return responseData;
      } else {
        throw new Error('Response is not in JSON format');
      }
    } catch (err: any) {
      setError(err.response?.data ?? err.message);
      setIsRunning(false);
      setWasExecuted(true);
      return Promise.reject(err);
    }
  }

  async function execute(...args: any[]): Promise<any> {
    setIsRunning(true);
    try {
      const responseData = await fetchData(...args);
      return responseData;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function reset(): void {
    setResult(null);
    setError(null);
    setIsRunning(false);
    setWasExecuted(false);
  }

  useEffect(() => {
    // Clean up any remaining state on unmount
    return reset;
  }, []);

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
