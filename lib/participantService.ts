import { supabase } from './supabaseClient'
import type { Participant } from '@/components/registration-form'

const TABLE_NAME = 'participants'

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase not initialized')
  }
}

const normalizeParticipant = (participant: Participant): Participant => {
  const parseNumber = (value?: string) => {
    if (!value) return null
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? null : parsed
  }
  return {
    ...participant,
    numberOfSessions: participant.numberOfSessions
      ? String(parseNumber(participant.numberOfSessions) ?? participant.numberOfSessions)
      : undefined,
    sessionDuration: participant.sessionDuration
      ? String(parseNumber(participant.sessionDuration) ?? participant.sessionDuration)
      : undefined,
    breakDuration: participant.breakDuration
      ? String(parseNumber(participant.breakDuration) ?? participant.breakDuration)
      : undefined
  }
}

export const addParticipant = async (participant: Participant): Promise<string> => {
  ensureSupabase()
  const payload = normalizeParticipant(participant)
  const { error } = await supabase!
    .from(TABLE_NAME)
    .insert({
      ...payload,
      timestamp: payload.timestamp
    })
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
  const participants = (data ?? []).map((row) => ({
    ...(row as Participant),
    timestamp: row?.timestamp ? new Date(row.timestamp).toISOString() : ''
  }))
  console.log('[Supabase] Loaded participants:', participants.length)
  return participants
}

export const deleteParticipantByToken = async (deleteToken: string): Promise<boolean> => {
  ensureSupabase()
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
