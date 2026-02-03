import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
  setDoc
} from 'firebase/firestore'
import { db } from './firebase'
import type { Participant } from '@/components/registration-form'

const COLLECTION_NAME = 'participants'

// Helper to convert Firestore timestamp to ISO string
const convertTimestamp = (data: any): Participant => {
  return {
    ...data,
    timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp
  } as Participant
}

/**
 * Add a new participant to Firestore
 * Uses the participant's ID as the document ID to avoid mismatches
 */
export const addParticipant = async (participant: Participant): Promise<string> => {
  try {
    // Use setDoc with the participant's ID as the document ID
    await setDoc(doc(db, COLLECTION_NAME, participant.id), {
      ...participant,
      timestamp: Timestamp.fromDate(new Date(participant.timestamp))
    })
    console.log('[Firebase] Participant added with ID:', participant.id)
    return participant.id
  } catch (error) {
    console.error('[Firebase] Error adding participant:', error)
    throw error
  }
}

/**
 * Get all participants from Firestore
 */
export const getParticipants = async (): Promise<Participant[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const participants: Participant[] = []
    
    querySnapshot.forEach((doc) => {
      participants.push(convertTimestamp({ id: doc.id, ...doc.data() }))
    })
    
    console.log('[Firebase] Loaded participants:', participants.length)
    return participants
  } catch (error) {
    console.error('[Firebase] Error getting participants:', error)
    throw error
  }
}

/**
 * Delete a participant by delete token
 * Uses a query to efficiently find the document by deleteToken
 */
export const deleteParticipantByToken = async (deleteToken: string): Promise<boolean> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('deleteToken', '==', deleteToken))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      console.log('[Firebase] No participant found with token:', deleteToken)
      return false
    }
    
    // Delete the first matching document (should only be one)
    await deleteDoc(querySnapshot.docs[0].ref)
    console.log('[Firebase] Participant deleted with token:', deleteToken)
    return true
  } catch (error) {
    console.error('[Firebase] Error deleting participant:', error)
    throw error
  }
}

/**
 * Delete a participant by ID
 * Directly uses the participant ID as the document ID
 */
export const deleteParticipantById = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
    console.log('[Firebase] Participant deleted with ID:', id)
  } catch (error) {
    console.error('[Firebase] Error deleting participant by ID:', error)
    throw error
  }
}

/**
 * Subscribe to real-time updates for participants
 */
export const subscribeToParticipants = (
  callback: (participants: Participant[]) => void
): (() => void) => {
  try {
    const q = query(collection(db, COLLECTION_NAME))
    
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const participants: Participant[] = []
      querySnapshot.forEach((doc) => {
        participants.push(convertTimestamp({ id: doc.id, ...doc.data() }))
      })
      console.log('[Firebase] Real-time update received:', participants.length, 'participants')
      callback(participants)
    })
    
    return unsubscribe
  } catch (error) {
    console.error('[Firebase] Error subscribing to participants:', error)
    throw error
  }
}

/**
 * Sync localStorage data to Firestore (migration helper)
 * Only runs once per browser using a migration flag
 */
export const migrateLocalStorageToFirestore = async (): Promise<number> => {
  try {
    // Check if migration has already been completed
    const migrationCompleted = localStorage.getItem('firebaseMigrationCompleted')
    if (migrationCompleted === 'true') {
      console.log('[Firebase] Migration already completed, skipping')
      return 0
    }

    const localData = localStorage.getItem('participants')
    if (!localData) {
      console.log('[Firebase] No localStorage data to migrate')
      // Mark migration as completed even if there's no data
      localStorage.setItem('firebaseMigrationCompleted', 'true')
      return 0
    }
    
    const localParticipants: Participant[] = JSON.parse(localData)
    
    // Get existing Firestore data to avoid duplicates
    const existingParticipants = await getParticipants()
    const existingIds = new Set(existingParticipants.map(p => p.id))
    
    let migratedCount = 0
    for (const participant of localParticipants) {
      if (!existingIds.has(participant.id)) {
        await addParticipant(participant)
        migratedCount++
      }
    }
    
    // Mark migration as completed
    localStorage.setItem('firebaseMigrationCompleted', 'true')
    
    console.log('[Firebase] Migrated', migratedCount, 'participants from localStorage')
    return migratedCount
  } catch (error) {
    console.error('[Firebase] Error migrating from localStorage:', error)
    throw error
  }
}
