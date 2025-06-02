import { db } from './config';
import { collection, addDoc } from 'firebase/firestore';

const escapeRoomQuestions = [
  {
    question: "What is the primary purpose of a firewall in network security?",
    options: [
      { id: "A", text: "To block all incoming traffic" },
      { id: "B", text: "To monitor and control network traffic based on security rules" },
      { id: "C", text: "To encrypt data transmission" },
      { id: "D", text: "To store backup data" }
    ],
    correctAnswer: "B",
    explanation: "A firewall acts as a barrier between trusted and untrusted networks, monitoring and controlling traffic based on predefined security rules.",
    securityTip: "Always keep your firewall updated and properly configured to protect your network.",
    difficulty: "easy",
    points: 10
  },
  {
    question: "Which of the following is NOT a common type of cyber attack?",
    options: [
      { id: "A", text: "Phishing" },
      { id: "B", text: "SQL Injection" },
      { id: "C", text: "Data Backup" },
      { id: "D", text: "Ransomware" }
    ],
    correctAnswer: "C",
    explanation: "Data backup is a security measure, not an attack. Phishing, SQL Injection, and Ransomware are all common types of cyber attacks.",
    securityTip: "Regular data backups are essential for protecting against cyber attacks.",
    difficulty: "easy",
    points: 10
  },
  {
    question: "What is the purpose of encryption in cybersecurity?",
    options: [
      { id: "A", text: "To make data unreadable to unauthorized users" },
      { id: "B", text: "To increase internet speed" },
      { id: "C", text: "To store more data" },
      { id: "D", text: "To reduce storage space" }
    ],
    correctAnswer: "A",
    explanation: "Encryption converts data into a secure format that can only be read by authorized users with the correct decryption key.",
    securityTip: "Always use strong encryption for sensitive data, both in transit and at rest.",
    difficulty: "medium",
    points: 15
  },
  {
    question: "Which of these is a best practice for password security?",
    options: [
      { id: "A", text: "Using the same password for multiple accounts" },
      { id: "B", text: "Using personal information in passwords" },
      { id: "C", text: "Using a password manager" },
      { id: "D", text: "Writing passwords down on paper" }
    ],
    correctAnswer: "C",
    explanation: "Password managers help create and store strong, unique passwords for each account, making it easier to maintain good password security.",
    securityTip: "Use a password manager to generate and store strong, unique passwords for all your accounts.",
    difficulty: "medium",
    points: 15
  },
  {
    question: "What is the main purpose of a VPN?",
    options: [
      { id: "A", text: "To increase internet speed" },
      { id: "B", text: "To create a secure, encrypted connection over a public network" },
      { id: "C", text: "To store files online" },
      { id: "D", text: "To block advertisements" }
    ],
    correctAnswer: "B",
    explanation: "A VPN creates a secure, encrypted tunnel between your device and the internet, protecting your data from potential eavesdroppers.",
    securityTip: "Use a VPN when connecting to public Wi-Fi networks to protect your data.",
    difficulty: "medium",
    points: 15
  },
  {
    question: "What is social engineering in cybersecurity?",
    options: [
      { id: "A", text: "A type of software development" },
      { id: "B", text: "A method of manipulating people to gain unauthorized access" },
      { id: "C", text: "A network protocol" },
      { id: "D", text: "A hardware security feature" }
    ],
    correctAnswer: "B",
    explanation: "Social engineering involves manipulating people into revealing sensitive information or performing actions that compromise security.",
    securityTip: "Be cautious of unsolicited requests for information, even if they appear to come from trusted sources.",
    difficulty: "hard",
    points: 20
  },
  {
    question: "What is the purpose of two-factor authentication (2FA)?",
    options: [
      { id: "A", text: "To make login faster" },
      { id: "B", text: "To reduce storage space" },
      { id: "C", text: "To add an extra layer of security beyond passwords" },
      { id: "D", text: "To increase internet speed" }
    ],
    correctAnswer: "C",
    explanation: "2FA adds an additional verification step beyond passwords, making it harder for attackers to gain unauthorized access.",
    securityTip: "Enable 2FA on all accounts that support it, especially for sensitive services like banking and email.",
    difficulty: "hard",
    points: 20
  },
  {
    question: "What is a zero-day vulnerability?",
    options: [
      { id: "A", text: "A security flaw that is known and patched" },
      { id: "B", text: "A security flaw that is discovered and exploited before a fix is available" },
      { id: "C", text: "A type of antivirus software" },
      { id: "D", text: "A backup system" }
    ],
    correctAnswer: "B",
    explanation: "A zero-day vulnerability is a security flaw that is discovered and exploited by attackers before the software vendor can create and distribute a fix.",
    securityTip: "Keep all software and systems updated to minimize the risk of zero-day vulnerabilities.",
    difficulty: "hard",
    points: 20
  }
];

const attackScenarios = [
  {
    type: "Phishing",
    description: "You receive an email from your bank asking to verify your account details.",
    options: [
      { id: "A", text: "Click the link and enter your details" },
      { id: "B", text: "Forward the email to your bank" },
      { id: "C", text: "Delete the email and contact your bank directly" },
      { id: "D", text: "Reply to the email with your information" }
    ],
    correctOption: "C",
    explanation: "Legitimate banks never ask for sensitive information via email. Always contact your bank directly through official channels.",
    difficulty: "easy",
    points: 10
  },
  {
    type: "Social Engineering",
    description: "A caller claims to be from IT support and asks for your password to fix an issue.",
    options: [
      { id: "A", text: "Provide your password" },
      { id: "B", text: "Ask for their employee ID and verify with IT" },
      { id: "C", text: "Hang up and report to security" },
      { id: "D", text: "Give them a fake password" }
    ],
    correctOption: "C",
    explanation: "Never share passwords with anyone, even if they claim to be from IT. Report suspicious calls to security.",
    difficulty: "medium",
    points: 15
  },
  {
    type: "Ransomware",
    description: "Your computer shows a message demanding payment to unlock your files.",
    options: [
      { id: "A", text: "Pay the ransom immediately" },
      { id: "B", text: "Disconnect from the network and contact IT" },
      { id: "C", text: "Try to delete the message" },
      { id: "D", text: "Restart the computer" }
    ],
    correctOption: "B",
    explanation: "Disconnect from the network to prevent spread and contact IT immediately. Never pay the ransom without consulting security experts.",
    difficulty: "hard",
    points: 20
  }
];

export const initializeGames = async () => {
  try {
    // Initialize escape room questions
    const escapeRoomRef = collection(db, 'escapeRoomQuestions');
    for (const question of escapeRoomQuestions) {
      await addDoc(escapeRoomRef, {
        ...question,
        createdAt: new Date().toISOString()
      });
    }
    console.log('Escape room questions initialized successfully');

    // Initialize attack scenarios
    const attackScenariosRef = collection(db, 'attackScenarios');
    for (const scenario of attackScenarios) {
      await addDoc(attackScenariosRef, {
        ...scenario,
        createdAt: new Date().toISOString()
      });
    }
    console.log('Attack scenarios initialized successfully');
  } catch (error) {
    console.error('Error initializing games:', error);
  }
}; 