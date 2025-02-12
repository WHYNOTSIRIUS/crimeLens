# 🛡️ Crime Reporting & Verification System

## **A Community-Driven Platform for Secure Crime Reporting, Verification, and AI-Powered Analysis**


---

## 📌 Table of Contents
- [🚀 Introduction](#-introduction)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📷 Media Handling](#-media-handling)
- [🤖 AI-Powered Features](#-ai-powered-features)
- [🔒 Security & Authentication](#-security--authentication)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🚀 API Endpoints](#-api-endpoints)
- [📜 License](#-license)

---

## 🚀 Introduction
The **Crime Reporting & Verification System** is a **Next.js & Node.js-powered** web application that allows users to report crimes, attach **evidence (images/videos)**, and enable the **community to verify** the authenticity of reports through **votes and AI-driven analysis**.

This platform ensures **transparency, accountability, and community involvement** in crime reporting while integrating **real-time notifications, AI-powered fraud detection, and secure authentication mechanisms**.

---

## ✨ Features

### 🔹 **User Authentication & Role Management**
✔️ Secure **JWT-based authentication**  
✔️ **Roles:** Unverified User, Verified User, Admin  
✔️ **Phone Number Verification** via Firebase OTP  
✔️ **Forgot Password with OTP-based Recovery**  

### 📢 **Crime Reporting & Community Verification**
✔️ Users can **report crimes** with images/videos  
✔️ AI-generated **crime descriptions** for uploaded images  
✔️ **Voting System (Upvote/Downvote)** to verify reports  
✔️ **Verified Badge** for highly upvoted reports  
✔️ Users can **comment on reports** (proof attachment required)  

### 🤖 **AI-Powered Fake Report Detection**
✔️ Google Gemini AI **detects fake/misleading reports**  
✔️ **Sentiment & Intent Analysis** on crime descriptions  
✔️ **Image Manipulation Detection** to flag suspicious reports  
✔️ AI assigns a **confidence score** for authenticity  

### 🔔 **Real-Time Notifications**
✔️ Users receive alerts for **new comments, upvotes/downvotes, and admin actions**  
✔️ Implemented using **Firebase Cloud Messaging (FCM)**  
✔️ Users can **customize their notification preferences**  

### 🏆 **Crime Report Verification Badge**
✔️ Reports with **high engagement & credibility** get a **"Verified" badge**  
✔️ Verification based on **upvotes, comments, and AI analysis**  
✔️ Admins can manually **override verification**  

### 🔍 **Crime Feed with Advanced Filtering & Sorting**
✔️ **Pagination support** for crime posts  
✔️ **Filter** by division, district, or verification score  
✔️ **Sort** by date, upvotes, or verification score  
✔️ **Search by keywords** in the title or description  

### 📷 **Media Handling (Image & Video Uploads)**
✔️ **Cloudinary** for secure & scalable media storage  
✔️ Supports **multiple images and video uploads**  
✔️ **Automatic watermarking** for content protection  
✔️ **AI-powered image description generation**  

### 🚨 **Emergency Contact Integration**
✔️ Fetches **local police & hospital contacts** based on crime location  
✔️ Users can **call/message emergency contacts** directly  
✔️ Feature to **report incorrect or outdated contact info**  

---

## 🛠️ Tech Stack
### **Frontend:**
- **Next.js** (React Framework)
- **Tailwind CSS** (UI Styling)
- **Firebase Messaging** (Real-Time Notifications)

### **Backend:**
- **Node.js & Express.js** (REST API)
- **MongoDB with Mongoose** (Database)
- **Cloudinary** (Image & Video Storage)
- **Google Gemini AI** (Image & Text Analysis)
- **Firebase Authentication** (Phone OTP Verification)

---

## 📷 Media Handling
✔️ **Uploaded images/videos** are stored securely in **Cloudinary**  
✔️ **Automatic AI-generated descriptions** for images  
✔️ **Watermarking** to prevent unauthorized use  
✔️ **Compression** to optimize storage & performance  

---

## 🤖 AI-Powered Features
✔️ **Google Gemini AI** for crime description & fake report detection  
✔️ **Analyzes text & images** for inconsistencies  
✔️ **Detects fake/misleading reports** based on sentiment analysis  
✔️ **Confidence scoring** to flag suspicious reports  

---

## 🔒 Security & Authentication
✔️ **JWT-based authentication** with role-based access  
✔️ **Secure password hashing (bcrypt)**  
✔️ **Firebase OTP verification for phone numbers**  
✔️ **Admin controls** for banning users & managing content  
✔️ **CSRF, XSS & SQL injection protection**  

---

## ⚙️ Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/crime-reporting.git
cd crime-reporting
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and add:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FIREBASE_ADMIN_SDK_PATH=your_firebase_sdk.json
```

### **4️⃣ Run the Development Server**
```sh
npm run dev
```

---

## 🚀 API Endpoints
| Method | Endpoint | Description |
|--------|------------|-------------|
| POST | `/api/users/signup` | Register a new user |
| POST | `/api/users/login` | User login |
| GET | `/api/users/profile` | Get user profile |
| POST | `/api/reports/create` | Create a new crime report |
| GET | `/api/reports/:id` | Get crime report details |
| POST | `/api/reports/:id/vote` | Upvote/Downvote a report |
| POST | `/api/reports/:id/comment` | Add a comment with proof |
| GET | `/api/reports/:id/verify` | Check report verification status |
| POST | `/api/users/reset-password` | Reset password with OTP |

---

## 📜 License
This project is licensed under the **MIT License**.

---

🚀 **Ready to enhance crime reporting transparency?**
💬 **Questions? Suggestions?** Feel free to open an **issue** or contribute to the project!
