import { useState, useEffect, useCallback } from 'react';

export default function useBetting() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/getResult');
      const j = await res.json();
      setBets(j || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBets();
    const id = setInterval(fetchBets, 10_000);
    return () => clearInterval(id);
  }, [fetchBets]);

  return { bets, fetchBets, loading };
}
