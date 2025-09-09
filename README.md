# URL Shortener Web App with Logging Middleware

## 🚀 Project Overview

This is a simple **URL Shortener Web Application** built using **React**.  
It allows users to shorten URLs, manage them, and view analytics—all handled on the **client side** with localStorage for persistence.

A key part of this project is the **Logging Middleware** that records important actions (like validation errors, URL creation, redirects, and stats view) by sending log data to a custom API endpoint.

---

## ✅ Folder Structure

![Log API Call Screenshot](https://drive.google.com/uc?id=1Kf9MbFtSJt2BlFbHyJNt9NE0yM4avKH3)


## 🧱 Architecture & Key Design Decisions

### ⚡ Logging Middleware
- Reusable function `Log(stack, level, package, message)`
- Hardcoded access token
- Logs key actions:
    - Validation failures  
    - URL shortener creation  
    - Redirection events  
    - Statistics page access

🔀 Routing Strategy
/ → Shortener Page

/stats → Statistics Page

/:shortcode → Redirect Page

⚙️ How to Run Locally
bash
Copy code
git clone https://github.com/swatejsr/2201641720133.git
cd Frontend Test Submission
npm install
npm start
📸 Screenshots
✅ Registration API Call

✅ Authentication Token API Call

✅ Desktop View

✅ Mobile View

📋 Important Notes
No authentication UI (access token hardcoded).

Up to 5 URLs can be shortened concurrently.

Validity period default: 30 minutes.

Client-side validation for URL format and validity period.

Material UI used for styling.

Logs all key events via Log() function.