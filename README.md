# PassGuard - Advanced Password Generator & Strength Analyzer

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A professional, security-focused web application designed to generate cryptographically strong passwords and analyze their strength using real entropy calculations. Built with modern web technologies and a focus on UX/UI.

🔗 **Repository**: [https://github.com/Pusri27/advanced-password-generator](https://github.com/Pusri27/advanced-password-generator)

## 🚀 Overview

PassGuard is not just a random string generator. It is a comprehensive security tool that helps users create robust passwords while educating them on password strength. It features a custom-built strength estimation engine that calculates entropy bits and detects common patterns (sequences, keyboard walks, repetitions) to provide accurate security feedback.

## ✨ Key Features

### 🛡️ Advanced Generator
- **Customizable Length**: Generate passwords from 8 to 64 characters.
- **Granular Control**: Toggle Uppercase, Lowercase, Numbers, and Symbols.
- **Smart Exclusions**: Options to exclude ambiguous characters (e.g., `l`, `1`, `O`, `0`) to avoid confusion.
- **Pattern Prevention**: Algorithms to prevent sequential characters (e.g., `abc`, `123`) and repeated characters (e.g., `aaa`).

### 📊 Intelligent Strength Analysis
- **Entropy Calculation**: Uses the formula $E = \log_2(R^L)$ to determine the true information density of the password.
- **Crack Time Estimation**: Estimates how long it would take to brute-force the password using modern hardware.
- **Pattern Detection**: Identifies weak patterns like keyboard walks (`qwerty`), sequences, and dictionary words.
- **Visual Feedback**: Real-time strength meter and actionable suggestions to improve security.

### 💾 User Experience & Persistence
- **History Tracking**: Securely stores the last 10 generated passwords in local storage.
- **Custom Presets**: Save your favorite configurations (e.g., "Banking", "Social Media", "PIN").
- **Dark/Light Mode**: Fully responsive theme switching with system preference detection.
- **Modern UI**: Designed with a "Glassmorphism" aesthetic, featuring smooth animations and interactive elements.

## 🛠️ Tech Stack

- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: CSS Variables, Flexbox, CSS Grid
- **Icons**: SVG
- **Storage**: Web LocalStorage API
- **No External Dependencies**: Lightweight and fast.

## 📦 Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pusri27/advanced-password-generator.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd advanced-password-generator
   ```

3. **Run the application**
   Simply open `index.html` in your preferred web browser.
   
   *Or serve it locally:*
   ```bash
   python3 -m http.server 8080
   ```
   Then visit `http://localhost:8080`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Developed by [Pusri27](https://github.com/Pusri27)*
