import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getDocFromServer,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore with explicit firestoreDatabaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Verify Firestore Connection at startup
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log('[Firebase] Cloud Firestore connection successfully verified.');
    return true;
  } catch (error: any) {
    // permission-denied or not-found still proves network connectivity to the specific Firestore DB
    if (error?.code === 'permission-denied' || error?.code === 'not-found') {
      console.log('[Firebase] Cloud Firestore reached successfully (expected rule evaluation).');
      return true;
    }
    console.warn('[Firebase] Connection check response:', error?.message || error);
    return false;
  }
}

// Auto sign in anonymously for child safety and frictionless gameplay
export async function ensureFirebaseAuth(): Promise<string | null> {
  try {
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }
    const cred = await signInAnonymously(auth);
    return cred.user.uid;
  } catch (err) {
    console.warn('[Firebase Auth] Anonymous sign-in note:', err);
    return null;
  }
}

export interface CloudPlayerProfile {
  id: string;
  name: string;
  level: number;
  stars: number;
  coins: number;
  streak: number;
  avatarIcon?: string;
  lastUpdated: string;
}

// Sync player data to Cloud Firestore
export async function syncPlayerProfileToFirestore(player: CloudPlayerProfile): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', player.id);
    await setDoc(userDocRef, {
      ...player,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Also update leaderboard entry
    const leaderboardDocRef = doc(db, 'leaderboard', player.id);
    await setDoc(leaderboardDocRef, {
      id: player.id,
      playerName: player.name,
      stars: player.stars,
      streak: player.streak,
      level: player.level,
      avatarIcon: player.avatarIcon || '🦁',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return true;
  } catch (err) {
    console.warn('[Firebase] Could not sync player profile to Firestore:', err);
    return false;
  }
}

// Fetch top players from Firestore Leaderboard
export async function fetchTopLeaderboard(): Promise<Array<{
  id: string;
  playerName: string;
  stars: number;
  streak: number;
  level: number;
  avatarIcon: string;
}>> {
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('stars', 'desc'), limit(25));
    const snapshot = await getDocs(q);
    const results: any[] = [];
    snapshot.forEach((d) => {
      results.push(d.data());
    });
    return results;
  } catch (err) {
    console.warn('[Firebase] Fallback local leaderboard used:', err);
    return [];
  }
}
