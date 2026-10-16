import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { fallbackProducts, fetchPublicProducts } from '../services/products'

// Sem banco configurado, o site usa a lista que está em src/data/siteData.js.
export default function usePublicProducts() {
  const [state, setState] = useState(() =>
    isSupabaseConfigured
      ? { products: [], loading: true, error: false }
      : { products: fallbackProducts, loading: false, error: false },
  )

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let alive = true
    fetchPublicProducts()
      .then((products) => alive && setState({ products, loading: false, error: false }))
      .catch(() => alive && setState({ products: [], loading: false, error: true }))
    return () => { alive = false }
  }, [])

  return state
}
