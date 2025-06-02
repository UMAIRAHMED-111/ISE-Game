import { db } from './config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Initial questions data for each challenge
const initialQuestions = {
  "Cipher Quest": [
    {
      question: "What is the Caesar cipher shift value in the following encrypted message: 'Khoor Zruog'?",
      options: ["3", "5", "7", "9"],
      correctAnswer: "3",
      explanation: "The message 'Khoor Zruog' is 'Hello World' shifted by 3 positions in the alphabet.",
      difficulty: "easy",
      points: 10
    },
    {
      question: "Which encryption method is considered more secure: AES-128 or DES?",
      options: ["AES-128", "DES", "Both are equally secure", "Neither is secure"],
      correctAnswer: "AES-128",
      explanation: "AES-128 is more secure than DES because it uses a larger key size and more complex encryption algorithm.",
      difficulty: "medium",
      points: 15
    }
  ],
  "Security Quiz": [
    {
      question: "What is the most common type of social engineering attack?",
      options: ["Phishing", "Shoulder surfing", "Dumpster diving", "Tailgating"],
      correctAnswer: "Phishing",
      explanation: "Phishing is the most common social engineering attack, where attackers impersonate legitimate entities to steal information.",
      difficulty: "easy",
      points: 10
    },
    {
      question: "Which of the following is NOT a best practice for password security?",
      options: [
        "Using the same password for multiple accounts",
        "Using a password manager",
        "Enabling two-factor authentication",
        "Using a mix of letters, numbers, and symbols"
      ],
      correctAnswer: "Using the same password for multiple accounts",
      explanation: "Using the same password for multiple accounts is a security risk. If one account is compromised, all accounts become vulnerable.",
      difficulty: "medium",
      points: 15
    }
  ],
  "Cyber Escape Room": [
    {
      question: "You find a USB drive in the parking lot. What should you do?",
      options: [
        "Plug it into your computer to check its contents",
        "Take it to IT security",
        "Give it to a colleague",
        "Throw it away"
      ],
      correctAnswer: "Take it to IT security",
      explanation: "Unknown USB drives can contain malware. Always report found devices to security personnel.",
      difficulty: "easy",
      points: 10
    },
    {
      question: "You receive an email from your boss asking for urgent wire transfer. What should you do first?",
      options: [
        "Process the transfer immediately",
        "Call your boss to verify",
        "Forward the email to IT",
        "Reply asking for more details"
      ],
      correctAnswer: "Call your boss to verify",
      explanation: "Always verify unusual requests through a different communication channel to prevent business email compromise.",
      difficulty: "medium",
      points: 15
    }
  ],
  "Master the Passwords": [
    {
      question: "Which of these is the strongest password?",
      options: [
        "password123",
        "P@ssw0rd!",
        "CorrectHorseBatteryStaple",
        "12345678"
      ],
      correctAnswer: "CorrectHorseBatteryStaple",
      explanation: "A passphrase using random words is more secure than a complex but short password.",
      difficulty: "easy",
      points: 10
    },
    {
      question: "What is the recommended minimum length for a strong password?",
      options: ["8 characters", "12 characters", "16 characters", "20 characters"],
      correctAnswer: "16 characters",
      explanation: "Longer passwords are more secure. 16 characters is recommended for high-security accounts.",
      difficulty: "medium",
      points: 15
    }
  ],
  "Attack Simulator": [
    {
      question: "What is the first step in responding to a ransomware attack?",
      options: [
        "Pay the ransom",
        "Disconnect infected systems",
        "Restore from backup",
        "Contact the attacker"
      ],
      correctAnswer: "Disconnect infected systems",
      explanation: "Isolating infected systems prevents the ransomware from spreading to other devices.",
      difficulty: "medium",
      points: 15
    },
    {
      question: "Which of these is NOT a common indicator of a phishing attempt?",
      options: [
        "Urgent action required",
        "Poor grammar and spelling",
        "Legitimate company logo",
        "Generic greeting"
      ],
      correctAnswer: "Legitimate company logo",
      explanation: "Attackers often use legitimate logos to make their emails appear authentic.",
      difficulty: "easy",
      points: 10
    }
  ],
  "Hack The Hacker": [
    {
      question: "What is the purpose of a honeypot in cybersecurity?",
      options: [
        "To store sensitive data",
        "To attract and monitor attackers",
        "To speed up network performance",
        "To backup important files"
      ],
      correctAnswer: "To attract and monitor attackers",
      explanation: "Honeypots are decoy systems designed to attract and study cyber attacks.",
      difficulty: "medium",
      points: 15
    },
    {
      question: "Which of these is a common vulnerability in web applications?",
      options: [
        "SQL Injection",
        "Power Surge",
        "Hardware Failure",
        "User Interface"
      ],
      correctAnswer: "SQL Injection",
      explanation: "SQL Injection is a common web vulnerability where attackers manipulate database queries.",
      difficulty: "easy",
      points: 10
    }
  ]
};

// Initialize questions in Firestore
export const initializeQuestions = async () => {
  try {
    console.log('==========================================');
    console.log('📝 Starting Questions Initialization...');
    console.log('==========================================');

    const questionsRef = collection(db, 'questions');
    console.log('📚 Created questions collection reference');
    
    // Check if questions already exist
    console.log('🔍 Checking for existing questions...');
    const snapshot = await getDocs(questionsRef);
    console.log(`📊 Found ${snapshot.size} existing questions`);
    
    if (!snapshot.empty) {
      console.log('⏭️ Questions already exist, skipping initialization');
      console.log('==========================================');
      return;
    }

    console.log('📝 No existing questions found, starting initialization...');
    
    // Add questions for each challenge
    for (const [challengeName, questions] of Object.entries(initialQuestions)) {
      console.log(`📦 Adding questions for ${challengeName}...`);
      
      for (const question of questions) {
        try {
          const questionData = {
            ...question,
            challengeName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          console.log(`📝 Adding question: ${question.question.substring(0, 50)}...`);
          await addDoc(questionsRef, questionData);
          console.log(`✅ Added question for ${challengeName}`);
        } catch (error) {
          console.error(`❌ Error adding question for ${challengeName}:`, error);
          throw error;
        }
      }
    }
    
    console.log('✅ All questions initialized successfully!');
    console.log('==========================================');
    
  } catch (error) {
    console.error('❌ Error initializing questions:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Fetch questions for a specific challenge
export const getQuestionsForChallenge = async (challengeName) => {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(questionsRef, where('challengeName', '==', challengeName));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}; 