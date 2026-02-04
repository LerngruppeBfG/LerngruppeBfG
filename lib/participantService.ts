import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
  setDoc,
  getDoc
} from 'firebase/firestore'
import { db } from './firebase'
import type { Participant } from '@/components/registration-form'

const COLLECTION_NAME = 'participants'

// Helper to convert Firestore timestamp to ISO string
const convertTimestamp = (data: DocumentData): Participant => {
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
    if (!db) {
      throw new Error('Firestore not initialized')
    }
    // Use setDoc with the participant's ID as the document ID
    const participantRef = doc(db, COLLECTION_NAME, participant.id)
    await setDoc(participantRef, {
      ...participant,
      timestamp: Timestamp.fromDate(new Date(participant.timestamp))
    })
    const savedSnapshot = await getDoc(participantRef)
    if (!savedSnapshot.exists()) {
      throw new Error('Firestore write did not persist')
    }
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
    if (!db) {
      throw new Error('Firestore not initialized')
    }
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
    if (!db) {
      throw new Error('Firestore not initialized')
    }
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
    if (!db) {
      throw new Error('Firestore not initialized')
    }
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
    if (!db) {
      throw new Error('Firestore not initialized')
    }
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
