import { useState, useEffect, useCallback } from 'react';
import { concertAPI } from '../services/api';

const useConcerts = (initialParams = {}) => {
  const [concerts,   setConcerts]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [params,     setParams]     = useState({ page: 1, limit: 9, ...initialParams });

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    // strip empty values before sending
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined));
    concertAPI.getAll(clean)
      .then(res => {
        setConcerts(res.data.data.concerts);
        setPagination(res.data.data.pagination);
      })
      .catch(err => setError(err?.response?.data?.message || 'Failed to load concerts'))
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const setFilter = (key, value) => setParams(p => ({ ...p, [key]: value, page: 1 }));
  const setPage   = (page)        => setParams(p => ({ ...p, page }));
  const refresh   = fetch;

  return { concerts, pagination, loading, error, params, setFilter, setPage, refresh };
};

export default useConcerts;