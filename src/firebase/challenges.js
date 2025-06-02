import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  writeBatch,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';

// Initial challenges data with explicit key-value pairs
const initialChallenges = [
  {
    id: 0,
    title: "Cipher Quest",
    desc: "Crack ciphers, fix flaws, and prove your cryptography skills across levels.",
    path: "/games/cipher-quest",
    isNew: true,
    rules: "Solve multi-step encryption and key management puzzles across 5 levels. Earn recognition for each correct step!",
  },
  {
    id: 1,
    title: "Security Quiz",
    desc: "Test your knowledge of social engineering, phishing, and cyber threat awareness.",
    path: "/games/security-quiz",
    isNew: false,
    rules: "Answer 10 Cyber Security based questions. Correct answers earn 10 points. No penalties for wrong answers.",
  },
  {
    id: 2,
    title: "Cyber Escape Room",
    desc: "Solve challenging cybersecurity puzzles and escape the hacker's digital trap in time.",
    path: "/games/escape-room",
    isNew: false,
    rules: "Solve 5 cybersecurity riddles. Each correct solution unlocks the next step. Finish within 2 minutes.",
  },
  {
    id: 3,
    title: "Master the Passwords",
    desc: "Learn to create strong, secure passwords and test their strength in real-time simulations.",
    path: "/games/password-challenge",
    isNew: false,
    rules: "Enter passwords to evaluate their strength. Learn tips for improving security. No time limit.",
  },
  {
    id: 4,
    title: "Attack Simulator",
    desc: "Respond to real-time cyber threats and simulate actions against common attack scenarios.",
    path: "/games/attack-sim",
    isNew: false,
    rules: "React to 10 different attack scenarios by choosing the correct action within 10 seconds. Earn 20 points for correct choices.",
  },
  {
    id: 5,
    title: "Hack The Hacker",
    desc: "Analyze hidden clues, decrypt messages, and expose vulnerabilities used by hackers.",
    path: "/games/hack-hacker",
    isNew: false,
    rules: "Decrypt 3 messages and identify vulnerabilities. Each task earns 30 points.",
  },
];

// Initialize challenges in Firestore
export const initializeChallenges = async () => {
  try {
    console.log('==========================================');
    console.log('🎮 Starting Challenge Initialization...');
    console.log('==========================================');
    
    // Ensure we have a valid db instance
    if (!db) {
      console.error('❌ Firestore database instance is not initialized!');
      throw new Error('Firestore database instance is not initialized');
    }
    console.log('✅ Firestore database instance verified');
    
    const challengesRef = collection(db, 'challenges');
    console.log('📚 Created challenges collection reference');
    
    // Check if challenges already exist
    console.log('🔍 Checking for existing challenges...');
    const snapshot = await getDocs(challengesRef);
    console.log(`📊 Found ${snapshot.size} existing challenges`);
    
    if (!snapshot.empty) {
      console.log('⏭️ Challenges already exist, skipping initialization');
      console.log('==========================================');
      return;
    }

    console.log('📝 No existing challenges found, starting initialization...');
    
    // Add each challenge individually
    for (const challenge of initialChallenges) {
      try {
        const { id, title, desc, path, isNew, rules } = challenge;
        const docRef = doc(challengesRef, id.toString());
        
        // Create a clean data object with explicit key-value pairs
        const challengeData = {
          id: id,
          title: title,
          description: desc, // renamed for clarity
          path: path,
          isNew: isNew,
          rules: rules,
          createdAt: new Date().toISOString(), // Add timestamp
          updatedAt: new Date().toISOString()  // Add timestamp
        };

        console.log(`📝 Adding challenge data:`, challengeData);
        await setDoc(docRef, challengeData);
        console.log(`✅ Added challenge: ${title}`);
      } catch (error) {
        console.error(`❌ Error adding challenge ${challenge.title}:`, error);
        throw error;
      }
    }
    
    console.log('✅ All challenges initialized successfully!');
    console.log('==========================================');
    
  } catch (error) {
    console.error('❌ Error initializing challenges:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Fetch all challenges from Firestore
export const getChallenges = async () => {
  try {
    if (!db) {
      throw new Error('Firestore database instance is not initialized');
    }

    const challengesRef = collection(db, 'challenges');
    const snapshot = await getDocs(challengesRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: parseInt(doc.id),
        title: data.title,
        desc: data.description, // map back to original field name
        path: data.path,
        isNew: data.isNew,
        rules: data.rules,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
}; 