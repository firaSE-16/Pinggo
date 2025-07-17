import { useState, useEffect, useRef, useCallback } from "react";

interface SearchResult {
  success: boolean;
  data: any[];
  message?: string;
  query?: string;
  type?: string;
  count?: number;
}

export const useSearch = (query: string, type: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 2;
  const currentQueryRef = useRef({ query, type });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `/api/explore?query=${encodeURIComponent(currentQueryRef.current.query.trim())}&type=${currentQueryRef.current.type}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: SearchResult = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch search results");
      }

      setData(result.data || []);
      retryCountRef.current = 0; // Reset retry count on success
    } catch (err) {
      // Don't set error if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      
      // Retry logic for network errors
      if (retryCountRef.current < maxRetries && errorMessage.includes('network')) {
        retryCountRef.current++;
        console.log(`[SEARCH] Retrying... (${retryCountRef.current}/${maxRetries})`);
        
        // Retry after a short delay
        setTimeout(() => {
          fetchData();
        }, 1000 * retryCountRef.current);
        return;
      }

      setError(errorMessage);
      setData([]);
      retryCountRef.current = 0;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (currentQueryRef.current.query && currentQueryRef.current.query.trim().length >= 2) {
      fetchData();
    }
  }, [fetchData]);

  useEffect(() => {
    // Clear previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    currentQueryRef.current = { query, type };

    if (!query || query.trim().length < 2) {
      setData([]);
      setError(null);
      setIsLoading(false);
      retryCountRef.current = 0;
      return;
    }

    // Debounce the search
    const debounceTimer = setTimeout(fetchData, 300);
    
    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, type, fetchData]);

  return { data, isLoading, error, refetch };
};