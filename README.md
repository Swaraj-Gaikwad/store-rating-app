# 🏪 Store Rating App

## 🚀 Overview
A full-stack web application that allows users to rate stores. The system supports multiple roles with different functionalities:

- 🔴 Admin
- 🟢 Normal User
- 🔵 Store Owner

This project demonstrates role-based access control, authentication, database relationships, and full-stack integration.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js

### Database
- MySQL

---

## 👥 User Roles & Features

### 🔴 Admin
- Add new stores
- View all stores
- Delete stores

### 🟢 Normal User
- View all stores
- Submit ratings (1–5)
- Update ratings

### 🔵 Store Owner
- View users who rated their store
- See average rating of their store

---

## 🧠 Key Concepts Implemented

- JWT Authentication
- Role-Based Access Control (RBAC)
- REST APIs
- Relational Database Design (MySQL)
- CRUD Operations
- Protected Routes (Frontend + Backend)

---


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository


- git clone https://github.com/Swaraj-Gaikwad/store-rating-app.git
- cd store-rating-app

- 2️⃣ Backend Setup
- npm install
- node src/server.js

- Backend runs on:

- http://localhost:5000

- 3️⃣ Frontend Setup
- cd frontend
- npm install
- npm run dev

Frontend runs on:

http://localhost:5173

Database Setup (MySQL)

Create a database:

CREATE DATABASE store_rating_app;

Users Table

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  address VARCHAR(400),
  role ENUM('admin','user','store_owner'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

- Stores Table
- CREATE TABLE stores (
-   id INT AUTO_INCREMENT PRIMARY KEY,
-   name VARCHAR(100),
-   email VARCHAR(100),
-   address VARCHAR(400),
-   owner_id INT,
-   FOREIGN KEY (owner_id) REFERENCES users(id)
- );

- Ratings Table
- CREATE TABLE ratings (
-   id INT AUTO_INCREMENT PRIMARY KEY,
-   user_id INT,
-   store_id INT,
-   rating INT CHECK (rating >= 1 AND rating <= 5),
-   UNIQUE (user_id, store_id),
-   FOREIGN KEY (user_id) REFERENCES users(id),
-   FOREIGN KEY (store_id) REFERENCES stores(id)
- );



- Credentials

- Email: admin@test.com

- Password: Password@123



- Email: user@test.com

- Password: Password@123


- Email: owner@test.com

- Password: Password@123


- Application Flow:
- Admin creates stores and users
- Users log in and rate stores
- Ratings are stored in database
- Store owners view ratings and average score