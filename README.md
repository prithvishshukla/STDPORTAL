# 🎓 College Attendance Tracker

> A comprehensive web-based attendance management system designed for college students to track, analyze, and optimize their class attendance.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)]()
[![License](https://img.shields.io/badge/License-Educational-blue)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [File Structure](#file-structure)
- [Usage Guide](#usage-guide)
- [Key Features Explained](#key-features-explained)
- [Screenshots](#screenshots)
- [Browser Compatibility](#browser-compatibility)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

The **College Attendance Tracker** is a modern, user-friendly web application that helps college students monitor and manage their attendance effectively. Built with pure HTML, CSS, and JavaScript, this application provides real-time insights into attendance percentages, calculates required classes to meet minimum attendance criteria, and offers personalized recommendations.

### Why This Project?

- **Zero Server Dependencies**: Runs entirely in the browser using LocalStorage
- **Smart Calculations**: Mathematical formulas to predict attendance outcomes
- **Professional Design**: Clean, ERP-style interface for better user experience
- **Instant Feedback**: Real-time color-coded attendance status
- **Portable**: Works offline, no installation required

---

## ✨ Features

### 🔐 Authentication System
- Secure client-side login with credential validation
- Session management using browser LocalStorage
- Multiple user account support
- Automatic session persistence

### 📊 Interactive Dashboard
- **At-a-glance Overview**: View overall attendance statistics
- **Subject Cards**: Individual cards showing attendance per subject
- **Quick Navigation**: Easy access to all modules
- **Real-time Updates**: Instant reflection of data changes

### 📈 Attendance Tracking
- **Subject-wise Breakdown**: Detailed view of each subject's attendance
- **Visual Progress Bars**: Color-coded indicators for quick assessment
- **Percentage Calculations**: Automatic computation of attendance rates
- **Status Indicators**:
  - 🟢 **Green (≥75%)**: Safe zone - Good attendance
  - 🟡 **Yellow (60-74%)**: Warning - Attention needed
  - 🔴 **Red (<60%)**: Critical - Immediate action required

### 🎯 Intelligent Leave Tracker
The standout feature that makes this application unique:

- **Smart Predictions**: Calculate exactly how many classes you can miss while staying above 75%
- **Recovery Planning**: Shows number of consecutive classes needed to reach minimum attendance
- **Mathematical Accuracy**: Uses the formula `(attended + x) / (total + x) ≥ 0.75`
- **Personalized Advice**: Context-aware recommendations based on current status
- **Critical Alerts**: Highlights subjects requiring immediate attention

### 👤 Profile Management
- View and update student information
- Personal dashboard customization
- Quick access to account details

---

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox/Grid
- **Vanilla JavaScript**: Pure ES6+ with no frameworks

### Storage
- **Browser LocalStorage**: Client-side data persistence
- **JSON**: Structured data format

### Design Philosophy
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG compliant elements
- **Performance**: Minimal footprint, instant loading
- **No Dependencies**: Zero external libraries or frameworks

---

## 🚀 Installation

### Quick Start (Recommended)

1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/yourusername/attendance-tracker.git
   cd attendance-tracker
   ```

2. **Open in Browser**:
   - Simply open `index.html` in your preferred web browser
   - That's it! No build process or server setup required

### Using a Local Server (Optional)

For a better development experience, you can run a local server:

**Option 1 - Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2 - Node.js:**
```bash
npx serve .
```

**Option 3 - VS Code:**
- Install "Live Server" extension
- Right-click on `index.html`
- Select "Open with Live Server"

Then navigate to `http://localhost:8000` (or the port shown).

---

## 📁 File Structure

```
WEBD ATTENDENCE TRACKER/
│
├── index.html                      # Login/Landing page
├── README.md                       # Project documentation
│
└── src/
    ├── html/
    │   ├── dashboard.html          # Main dashboard interface
    │   ├── attendance.html         # Attendance tracking page
    │   ├── leave-tracker.html      # Leave calculator page
    │   └── profile.html            # User profile page
    │
    ├── css/
    │   └── style.css               # Global styles and themes
    │
    ├── js/
    │   └── script.js               # Application logic and data management
    │
    └── images/                     # Assets and icons
```

---

## 📖 Usage Guide

### Default Login Credentials

The system comes with pre-configured demo accounts:

| Student | Username | Password |
|---------|----------|----------|
| Prithvish | `Prithvish` | `123` |
| Kavya Singh | `Kavya` | `123` |

### Navigation Flow

1. **Login** → Enter credentials on `index.html`
2. **Dashboard** → View overall attendance summary
3. **Attendance** → See detailed subject-wise breakdown
4. **Leave Tracker** → Calculate classes needed/available to miss
5. **Profile** → View/edit student information

### Using the Leave Tracker

1. Navigate to the Leave Tracker page
2. View your current attendance status for each subject
3. For **attendance < 75%**: See how many classes you need to attend
4. For **attendance ≥ 75%**: See how many classes you can safely miss
5. Follow personalized recommendations

---

## 🔍 Key Features Explained

### Leave Tracker Formula

The application uses a mathematical approach to calculate attendance requirements:

#### For Students Below 75%

**Formula:**
```
(attended + x) / (total + x) ≥ 0.75
```

Solving for x (classes needed):
```
x ≥ (0.75 × total - attended) / 0.25
```

**Example:**
- Current: 18 attended / 30 total = 60%
- Calculation: `(0.75 × 30 - 18) / 0.25 = 12`
- Result: **Attend 12 consecutive classes to reach 75%**

#### For Students Above 75%

**Formula:**
```
(attended - y) / (total + y) ≥ 0.75
```

Solving for y (classes can miss):
```
y ≤ (attended - 0.75 × total) / 1.75
```

**Example:**
- Current: 45 attended / 50 total = 90%
- Calculation: `(45 - 0.75 × 50) / 1.75 ≈ 4`
- Result: **Can miss up to 4 classes and stay above 75%**

### Data Storage

All data is stored locally in the browser's LocalStorage:

```javascript
// Student credentials
localStorage.setItem('currentUser', JSON.stringify(userObject));

// Attendance records
localStorage.setItem('attendance_' + userId, JSON.stringify(attendanceData));

// Session information
localStorage.setItem('sessionActive', 'true');
```

### Color Coding System

Visual indicators help students quickly assess their status:

| Color | Range | Status | Action |
|-------|-------|--------|--------|
| 🟢 Green | ≥75% | Safe | Maintain attendance |
| 🟡 Yellow | 60-74% | Warning | Improve attendance |
| 🔴 Red | <60% | Critical | Urgent attention needed |

---

## 📸 Screenshots

> Add screenshots of your application here to showcase the UI/UX

---

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 60+ | ✅ Fully Supported |
| Firefox | 55+ | ✅ Fully Supported |
| Safari | 11+ | ✅ Fully Supported |
| Edge | 16+ | ✅ Fully Supported |
| Opera | 47+ | ✅ Fully Supported |

**Requirements:**
- JavaScript enabled
- LocalStorage support
- Modern CSS3 support

---

## 💻 Development

### Customization

#### Adding New Students

Edit the student data in [src/js/script.js](src/js/script.js):

```javascript
const students = [
    {
        id: "S003",
        name: "New Student",
        username: "student3",
        password: "password789",
        email: "student3@college.edu"
    }
];
```

#### Adding Subjects

Modify the default attendance data in [src/js/script.js](src/js/script.js):

```javascript
const defaultAttendanceData = {
    "S003": [
        {
            subject: "New Subject",
            totalClasses: 40,
            attendedClasses: 30,
            percentage: 75
        }
    ]
};
```

#### Styling

All styles are in [src/css/style.css](src/css/style.css). Key CSS variables:

```css
:root {
    --primary-color: #4CAF50;
    --warning-color: #FFC107;
    --danger-color: #f44336;
    --background-color: #f5f5f5;
}
```

### Future Enhancements

- [ ] Database integration (MongoDB/MySQL)
- [ ] Admin panel for instructors
- [ ] Email/SMS notifications
- [ ] Export attendance reports (PDF/Excel)
- [ ] Attendance marking system
- [ ] Mobile application (React Native/Flutter)
- [ ] Calendar integration
- [ ] Class schedule management
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA) support
- [ ] Offline data synchronization

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow existing code style and conventions
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📄 License

This project is created for **educational purposes** as a college project demonstration.

**MIT License** - Feel free to use, modify, and distribute this project for learning purposes.

---

## 👨‍💻 Author

Created with ❤️ for college students to track and improve their attendance!

**Project Maintainer**: Your Name  
**Contact**: your.email@example.com  
**LinkedIn**: [Your Profile](#)  
**GitHub**: [@yourusername](#)

---

## 🙏 Acknowledgments

- Inspired by modern ERP systems used in educational institutions
- Built with the goal of helping students maintain minimum attendance requirements
- Thanks to all college students who face attendance challenges

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Usage Guide](#usage-guide)
2. Review existing [Issues](https://github.com/yourusername/attendance-tracker/issues)
3. Create a new issue with detailed information
4. Contact the maintainer

---

## ⭐ Show Your Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**[⬆ Back to Top](#-college-attendance-tracker)**

Made with ☕ and 💻 | © 2026 College Attendance Tracker

</div>#


