import { supabase } from './supabaseClient'
import type { Participant } from '@/components/registration-form'

const TABLE_NAME = 'participants'

const tryParseInteger = (value?: string) => {
  if (!value) return null
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase not initialized')
  }
}

const toParticipant = (row: unknown): Participant => {
  const participant = row as Participant
  return {
    ...participant,
    timestamp: participant.timestamp ? new Date(participant.timestamp).toISOString() : ''
  }
}

const normalizeParticipant = (participant: Participant): Participant => {
  const normalizeOptionalNumberToString = (value?: string) => {
    if (!value) return undefined
    // Fall back to the original string when parsing fails (e.g., imported records).
    return String(tryParseInteger(value) ?? value)
  }
  return {
    ...participant,
    numberOfSessions: normalizeOptionalNumberToString(participant.numberOfSessions),
    sessionDuration: normalizeOptionalNumberToString(participant.sessionDuration),
    breakDuration: normalizeOptionalNumberToString(participant.breakDuration)
  }
}

export const addParticipant = async (participant: Participant): Promise<string> => {
  ensureSupabase()
  const payload = normalizeParticipant(participant)
  const { error } = await supabase!
    .from(TABLE_NAME)
    .insert(payload)
  if (error) {
    console.error('[Supabase] Error adding participant:', error)
    throw error
  }
  console.log('[Supabase] Participant added with ID:', participant.id)
  return participant.id
}

export const getParticipants = async (): Promise<Participant[]> => {
  ensureSupabase()
  const { data, error } = await supabase!
    .from(TABLE_NAME)
    .select('*')
    .order('timestamp', { ascending: true })
  if (error) {
    console.error('[Supabase] Error getting participants:', error)
    throw error
  }
  // Convert timestamps to ISO strings for UI usage.
  const participants = (data ?? []).map((row) => toParticipant(row))
  console.log('[Supabase] Loaded participants:', participants.length)
  return participants
}

const deleteParticipantByTokenViaApi = async (deleteToken: string): Promise<boolean | null> => {
  const basePath = typeof window === 'undefined'
    ? ''
    : window.location.pathname.replace(/\/delete\/?$/, '')
  const apiUrl = `${basePath || ''}/api/delete`
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deleteToken })
  })
  if (response.status === 404) {
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      return null
    }
    console.log('[Supabase] No participant found with token:', deleteToken)
    return false
  }
  if (!response.ok) {
    const errorText = await response.text()
    console.error('[Supabase] Error deleting participant:', errorText)
    throw new Error('Delete request failed')
  }
  const result = (await response.json()) as { deleted?: boolean }
  if (!result.deleted) {
    console.log('[Supabase] No participant found with token:', deleteToken)
    return false
  }
  console.log('[Supabase] Participant deleted with token:', deleteToken)
  return true
}

const ensureDeleteTokenSession = async (deleteToken: string) => {
  ensureSupabase()
  const { data: sessionData, error: sessionError } = await supabase!.auth.getSession()
  if (sessionError) {
    throw sessionError
  }
  if (!sessionData.session) {
    const { error } = await supabase!.auth.signInAnonymously({
      options: { data: { deleteToken } }
    })
    if (error) {
      throw error
    }
    return
  }
  const { error } = await supabase!.auth.updateUser({ data: { deleteToken } })
  if (error) {
    throw error
  }
}

const deleteParticipantByTokenViaClient = async (deleteToken: string): Promise<boolean> => {
  await ensureDeleteTokenSession(deleteToken)
  const { data, error } = await supabase!
    .from(TABLE_NAME)
    .delete()
    .eq('deleteToken', deleteToken)
    .select('id')
  if (error) {
    console.error('[Supabase] Error deleting participant:', error)
    throw error
  }
  if (!data || data.length === 0) {
    console.log('[Supabase] No participant found with token:', deleteToken)
    return false
  }
  console.log('[Supabase] Participant deleted with token:', deleteToken)
  return true
}

export const deleteParticipantByToken = async (deleteToken: string): Promise<boolean> => {
  const apiResult = await deleteParticipantByTokenViaApi(deleteToken)
  if (apiResult !== null) {
    return apiResult
  }
  return deleteParticipantByTokenViaClient(deleteToken)
}

export const deleteParticipantById = async (id: string): Promise<void> => {
  ensureSupabase()
  const { error } = await supabase!
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)
  if (error) {
    console.error('[Supabase] Error deleting participant by ID:', error)
    throw error
  }
  console.log('[Supabase] Participant deleted with ID:', id)
}

export const subscribeToParticipants = (
  callback: (participants: Participant[]) => void
): (() => void) => {
  ensureSupabase()
  const channel = supabase!
    .channel('participants')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME },
      async () => {
        try {
          const updatedParticipants = await getParticipants()
          callback(updatedParticipants)
        } catch (error) {
          console.error('[Supabase] Error refreshing participants:', error)
        }
      }
    )
    .subscribe()

  return () => {
    supabase!.removeChannel(channel)
  }
}
