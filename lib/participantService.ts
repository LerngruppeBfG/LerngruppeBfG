import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData
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
 */
export const addParticipant = async (participant: Participant): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...participant,
      timestamp: Timestamp.fromDate(new Date(participant.timestamp))
    })
    console.log('[Firebase] Participant added with ID:', docRef.id)
    return docRef.id
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
 */
export const deleteParticipantByToken = async (deleteToken: string): Promise<boolean> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    let deleted = false
    
    for (const document of querySnapshot.docs) {
      const data = document.data()
      if (data.deleteToken === deleteToken) {
        await deleteDoc(doc(db, COLLECTION_NAME, document.id))
        console.log('[Firebase] Participant deleted with token:', deleteToken)
        deleted = true
        break
      }
    }
    
    return deleted
  } catch (error) {
    console.error('[Firebase] Error deleting participant:', error)
    throw error
  }
}

/**
 * Delete a participant by ID
 */
export const deleteParticipantById = async (id: string): Promise<void> => {
  try {
    // First check if the document exists in Firestore
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    let firestoreId: string | null = null
    
    for (const document of querySnapshot.docs) {
      const data = document.data()
      if (data.id === id) {
        firestoreId = document.id
        break
      }
    }
    
    if (firestoreId) {
      await deleteDoc(doc(db, COLLECTION_NAME, firestoreId))
      console.log('[Firebase] Participant deleted with ID:', id)
    } else {
      console.warn('[Firebase] Participant not found with ID:', id)
    }
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
 */
export const migrateLocalStorageToFirestore = async (): Promise<number> => {
  try {
    const localData = localStorage.getItem('participants')
    if (!localData) {
      console.log('[Firebase] No localStorage data to migrate')
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
    
    console.log('[Firebase] Migrated', migratedCount, 'participants from localStorage')
    return migratedCount
  } catch (error) {
    console.error('[Firebase] Error migrating from localStorage:', error)
    throw error
  }
}
