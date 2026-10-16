import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchAvailableSlots } from '../services/slots'

export default function useAvailableSlots() {
  const [state, setState] = useState({ slots: [], loading: isSupabaseConfigured })

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let alive = true
    fetchAvailableSlots()
      .then((slots) => alive && setState({ slots, loading: false }))
      .catch(() => alive && setState({ slots: [], loading: false }))
    return () => { alive = false }
  }, [])

  return state
}
