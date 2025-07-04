# 🚛 Transport Management System – Frontend

[🔧 Backend GitHub](https://github.com/IgorPetrovKrsk/capstone_orders_delivery_system_backend)

[🔗 Live Site](https://transport-management-system-frontend.onrender.com/)  

## 📘 Overview

This is the frontend of the Transport Management System. It allows Admins, Dispatchers, and Drivers to interact with trucks, orders, users, and messaging. The app is built with React (Vite + TypeScript) and uses Google Maps for live route visualization, WebSockets for real-time updates, and AWS S3 for image uploads.

---

## Main Users for testing

Username: admin  
Password: admin 

Username: dispatcher  
Password: dispatcher

Username: driver  
Password: driver

---

## 🚀 Features

- 🔐 JWT authentication via cookies
- 🧭 Role-based routing for Admin, Dispatcher, and Driver
- 📍 Google Maps integration with polyline route rendering
- 💬 WebSocket real-time chat between Dispatcher and Driver
- 🚚 Order and truck management interfaces
- 📷 Image uploads to AWS S3 (via backend)
- 🌐 Responsive layout with interactive maps and dashboards

---

## ⚙️ Tech Stack

- **React** + **TypeScript** (Vite)
- **React Router**
- **Context API** for global auth state
- **Axios** for API requests
- **WebSocket** communication
- **Google Maps JavaScript API**
- **AWS S3** via backend for file uploads

---

## 🗺️ Google Maps

- Uses the Google Maps JS API via `@vis.gl/react-google-maps`
- Draws delivery routes using encoded polylines from the backend
- Center coordinates are configured via environment variables

---

## 📡 WebSocket Messaging

- Real-time communication between Dispatcher and Drivers
- Supports chat messages and live updates to active orders

---

## 📷 Image Uploads

- Profile and truck images are uploaded to **AWS S3** via the backend
- AWS credentials are **not exposed** on the frontend

---
Login page:

![image](https://github.com/user-attachments/assets/b949d2e1-fbf6-4835-a7d6-a411e6d70d20)

Users page:

![image](https://github.com/user-attachments/assets/ddcfac16-781f-4436-aa4e-a5810220195b)

User edit page:

![image](https://github.com/user-attachments/assets/b869735e-3f52-4460-b738-bb788919abae)

Dispatcher Dashboard:

![image](https://github.com/user-attachments/assets/1795da07-8758-45e8-9688-3547bd42f709)

Driver Dashboard with the message from dispatcher:

![image](https://github.com/user-attachments/assets/034dc509-0130-4386-9062-e74b97db0c0b)



