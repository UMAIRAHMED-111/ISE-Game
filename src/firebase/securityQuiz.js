import { db } from './config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Initial questions data
const initialQuestions = [
  {
    question: "What is phishing?",
    options: [
      { id: "A", text: "A type of fish" },
      { id: "B", text: "A cyberattack via email" },
      { id: "C", text: "A secure protocol" },
      { id: "D", text: "A programming language" }
    ],
    correctAnswer: "B",
    explanation: "Phishing is a type of cyberattack where attackers send fraudulent emails pretending to be from a legitimate source to trick users into providing sensitive information.",
    securityTip: "Always verify the sender's email address and avoid clicking on suspicious links in emails.",
    difficulty: "easy",
    points: 10
  },
  {
    question: "What does a strong password typically include?",
    options: [
      { id: "A", text: "Your name and birth year" },
      { id: "B", text: "A combination of letters, numbers, and symbols" },
      { id: "C", text: 'The word "password"' },
      { id: "D", text: "Only lowercase letters" }
    ],
    correctAnswer: "B",
    explanation: "A strong password includes a mix of letters, numbers, and special symbols to make it hard to crack.",
    securityTip: "Use a password manager to generate and store complex passwords securely.",
    difficulty: "easy",
    points: 10
  },
  {
    question: "What is two-factor authentication (2FA)?",
    options: [
      { id: "A", text: "A type of firewall" },
      { id: "B", text: "A second password" },
      { id: "C", text: "An extra layer of security using a second verification method" },
      { id: "D", text: "A type of malware" }
    ],
    correctAnswer: "C",
    explanation: "Two-factor authentication adds a layer of security by requiring a second form of verification.",
    securityTip: "Enable 2FA on all your accounts to protect against unauthorized access.",
    difficulty: "medium",
    points: 15
  },
  {
    question: "What is ransomware?",
    options: [
      { id: "A", text: "Software used to improve device performance" },
      { id: "B", text: "Malicious software that locks or encrypts your data until a ransom is paid" },
      { id: "C", text: "A secure way to back up files" },
      { id: "D", text: "A type of antivirus program" }
    ],
    correctAnswer: "B",
    explanation: "Ransomware locks your data and demands payment to regain access.",
    securityTip: "Back up your important data to avoid being a victim of ransomware.",
    difficulty: "medium",
    points: 15
  },
  {
    question: "Why should you avoid using public Wi-Fi for sensitive activities?",
    options: [
      { id: "A", text: "It's usually slow" },
      { id: "B", text: "It may not be encrypted, making your data vulnerable" },
      { id: "C", text: "It requires a password" },
      { id: "D", text: "It's only for public use" }
    ],
    correctAnswer: "B",
    explanation: "Public Wi-Fi networks are often unencrypted, allowing attackers to intercept your data, such as login credentials or personal information.",
    securityTip: "Use a VPN (Virtual Private Network) when connecting to public Wi-Fi to encrypt your connection.",
    difficulty: "medium",
    points: 15
  }
];

// Initialize questions in Firestore
export const initializeSecurityQuizQuestions = async () => {
  try {
    const questionsRef = collection(db, 'securityQuizQuestions');
    const snapshot = await getDocs(questionsRef);
    
    if (snapshot.empty) {
      console.log('Initializing security quiz questions...');
      for (const question of initialQuestions) {
        await addDoc(questionsRef, {
          ...question,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Security quiz questions initialized successfully!');
    } else {
      console.log('Security quiz questions already exist in the database.');
    }
  } catch (error) {
    console.error('Error initializing security quiz questions:', error);
    throw error;
  }
};

// Get random questions from Firestore
export const getRandomQuestions = async (count = 5) => {
  try {
    const questionsRef = collection(db, 'securityQuizQuestions');
    const snapshot = await getDocs(questionsRef);
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Shuffle and select random questions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}; 