# HackAware: Interactive Security Education Game

HackAware is an interactive web application designed to raise cybersecurity awareness through engaging games, challenges, and simulations. Built with React, it provides a safe environment for users to learn about online threats, password security, phishing, and more—without ever putting real data at risk.

---

## 🚀 Features

- **Interactive Challenges:**  
  - Cipher Quest  
  - Security Quiz  
  - Cyber Escape Room  
  - Password Challenge  
  - Attack Simulator  
  - Hack the Hacker

- **Simulated Login/Sign-Up:**  
  Demonstrates the risks of sharing credentials on untrusted sites, with clear educational alerts.

- **Modern UI/UX:**  
  - Responsive design  
  - Animated effects  
  - Accessible navigation

- **Educational Focus:**  
  - Alerts and modals explain security concepts  
  - Encourages best practices for online safety

---

## 🖼️ Screenshots

![HackAware Home](./src/assets/HackWare.png)  
*Logo used in navigation bar*

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router
- **Styling:** CSS (custom, responsive, modern)
- **Assets:** Custom icons and images in `/src/assets/`

---

## 📁 Project Structure

```
src/
│
├── assets/                # Images and logo (HackWare.png, etc.)
├── App.jsx                # Main application component
├── Home.jsx / Home.css    # Landing page and styles
├── Challenges.jsx         # Challenge selection and routing
├── SecurityQuiz.jsx       # Security quiz game
├── CyberEscapeRoom.jsx    # Escape room game
├── PasswordChallenge.jsx  # Password strength game
├── AttackSimulator.jsx    # Phishing/attack simulation
├── HackTheHacker.jsx      # "Hack the Hacker" game
├── HackTheHackerComplete.jsx # End screen for Hack the Hacker
├── LoginModal.jsx         # Simulated login modal
├── SignUpModal.jsx        # Simulated sign-up modal
└── index.js               # Entry point
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/hackaware.git
   cd hackaware
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm start
   # or
   yarn start
   ```

4. **Open in your browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🧩 How It Works

- **Navigation:**  
  The top navbar features the HackWare logo and links to Home, Challenges, Login, and Sign Up.

- **Games & Challenges:**  
  Each challenge is accessible via the "Challenges" page or directly via routes.

- **Simulated Credentials:**  
  Login and Sign Up modals simulate credential entry and display educational alerts—no real data is stored or transmitted.

- **Alerts:**  
  After simulated actions, users receive clear, informative messages about online safety and best practices.

---

## 📝 Customization

- **Add new games:**  
  Create a new component in `src/`, add a route in `App.jsx`, and link it in the navigation or challenges grid.

- **Change logo:**  
  Replace `src/assets/HackWare.png` with your own image and update the import in `App.jsx`.

- **Styling:**  
  Modify `Home.css` and other CSS files for custom themes or layouts.

---

## 🤝 Contributing

Contributions are welcome!  
- Fork the repo  
- Create a feature branch  
- Submit a pull request

---

## ⚠️ Disclaimer

**This project is for educational and awareness purposes only.**  
No real credentials or sensitive data are collected or transmitted. All simulations are safe and intended to teach users about cybersecurity risks and best practices.

---

## 📄 License

[MIT License](LICENSE)

---

## 👨‍💻 Authors

- [Umair Ahmed](https://github.com/UMAAIRAHMED-111)
- [Contributors](https://github.com/your-username/hackaware/graphs/contributors)

---


---