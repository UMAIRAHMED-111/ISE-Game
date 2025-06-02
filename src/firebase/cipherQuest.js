import { db } from './config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const initialLevels = [
  {
    level: 1,
    title: "Caesar Cipher Challenge",
    scenario: 'Alice finds her grandfather\'s old safe, locked with a 4-letter code. She remembers he loved the Caesar cipher. On the safe is the note: "FDVH".',
    question: "Decode the note:",
    type: "input",
    correctAnswer: "CASE",
    feedback: "The Caesar cipher shifts letters. Shifting F-D-V-H back by 3 gives C-A-S-E."
  },
  {
    level: 2,
    title: "One-Time Pad Fix",
    scenario: "Alice and Bob are reusing one-time pad keys across messages. Select steps to fix this.",
    question: "Select all correct steps in order:",
    type: "multi-choice",
    options: [
      "Use each key only once and discard it after use.",
      "Switch to a Caesar cipher with a fixed shift.",
      "Generate a long pseudo-random key stream from a shared seed.",
      "Keep reusing the key but add a salt to each message.",
      "Switch to symmetric encryption with a secure key exchange mechanism."
    ],
    correctAnswer: [0, 4],
    feedback: "Correct! Step 1 ensures uniqueness, Step 5 provides a scalable fix."
  },
  {
    level: 3,
    title: "Digital Signature Check",
    scenario: 'Bob receives an email from "Alice" asking for data. Validate the signature with these steps.',
    question: "Arrange steps in correct order:",
    type: "ordered-choice",
    options: [
      "Use Alice's public key to decrypt the signed hash",
      "Hash the message using the agreed-upon algorithm",
      "Compare the hash from signature with the hash of the message",
      "Encrypt the message using Bob's private key",
      "Replace the hash algorithm with MD5 instead"
    ],
    correctAnswer: [0, 1, 2],
    feedback: "Correct! These are the steps to verify digital signatures. The rest are either irrelevant or insecure."
  },
  {
    level: 4,
    title: "Key Management Mistake",
    scenario: "Customer data was encrypted using AES, but keys were left in plaintext.",
    question: "Pick correct steps to improve key handling:",
    type: "multi-choice",
    options: [
      "Move encryption keys to a secure hardware module (HSM).",
      "Encrypt the encryption key using Base64 encoding.",
      "Use access controls to restrict key file access to specific services.",
      "Implement key rotation policies.",
      "Store the keys in a hidden folder on the same server."
    ],
    correctAnswer: [0, 2, 3],
    feedback: "Storing keys securely, limiting access, and rotating keys strengthens protection."
  },
  {
    level: 5,
    title: "RSA Broadcast Flaw",
    scenario: "Same plaintext sent with RSA (e=3) to 3 recipients. An attacker decrypts.",
    question: "Pick all correct steps to fix this vulnerability:",
    type: "multi-choice",
    options: [
      "Use message padding (e.g., OAEP) before encryption.",
      "Decrease the public exponent to 1.",
      "Use the same modulus across all users.",
      "Randomize the plaintext before encryption.",
      "Switch to AES for broadcast messaging."
    ],
    correctAnswer: [0, 3, 4],
    feedback: "Padding, randomness, and symmetric encryption prevent this RSA flaw."
  }
];

export const initializeCipherQuestLevels = async () => {
  try {
    console.log('==========================================');
    console.log('🎮 Starting CipherQuest Levels Initialization...');
    console.log('==========================================');

    const levelsRef = collection(db, 'cipherQuestLevels');
    console.log('📚 Created cipherQuestLevels collection reference');
    
    // Check if levels already exist
    console.log('🔍 Checking for existing levels...');
    const snapshot = await getDocs(levelsRef);
    console.log(`📊 Found ${snapshot.size} existing levels`);
    
    if (!snapshot.empty) {
      console.log('⏭️ Levels already exist, skipping initialization');
      console.log('==========================================');
      return;
    }

    console.log('📝 No existing levels found, starting initialization...');
    
    // Add each level
    for (const level of initialLevels) {
      try {
        console.log(`📝 Adding level ${level.level}: ${level.title}...`);
        await addDoc(levelsRef, {
          ...level,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log(`✅ Added level ${level.level}`);
      } catch (error) {
        console.error(`❌ Error adding level ${level.level}:`, error);
        throw error;
      }
    }
    
    console.log('✅ All CipherQuest levels initialized successfully!');
    console.log('==========================================');
    
  } catch (error) {
    console.error('❌ Error initializing CipherQuest levels:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const getCipherQuestLevels = async () => {
  try {
    const levelsRef = collection(db, 'cipherQuestLevels');
    const snapshot = await getDocs(levelsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => a.level - b.level); // Sort by level number
  } catch (error) {
    console.error('Error fetching CipherQuest levels:', error);
    throw error;
  }
}; 