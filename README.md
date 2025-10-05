# 🛒 Full Stack E-Commerce Web Application

This project is a **full-stack e-commerce web application** developed using **Laravel 10** (Backend) and **Next.js** (Frontend).  
It was created as part of a **Skill & Performance Test** to evaluate both backend and frontend development proficiency.

The system includes three main roles: **Admin**, **User**, and **Customer**, each with distinct permissions and functionality.  
It supports responsive design, light/dark mode, and form validation across all modules.

---

## 🌐 Project Overview

### 🎯 Objective
To develop a complete, responsive e-commerce system covering:
- Customer registration, login, and product interaction.
- Admin and user dashboards for managing products, customers, and privileges.
- Product searching, rating, and CRUD operations.
- Modern UI/UX design with light/dark mode toggle.

---

## 👥 System Users
- **Admin** — Full control over the system.
- **User** — Limited privileges set by admin.
- **Customer** — Can browse and shop for products.

---

## 🚀 Features

### 🧍 Customer Module
- **Customer Registration** – First name, last name, email (unique), contact number, and password.
- **Customer Login** – Secure authentication.
- **Profile Management** – View and edit personal details.
- **Product Listing Page** – View all active products with pagination.
- **Product Search** – Filter by name, brand, price, and rating (minimum 4 filters).
- **Product View Page** – View single product details and image.
- **Shopping Cart** – Add, update, and delete items in cart.

---

### 🧑‍💼 Admin & User Module
- **Admin/User Login**
- **Dashboard Overview**
  - Total Products
  - Total Customers
  - Total Users
- **Product Management**
  - Add / Update / Delete Products
  - Activate / Deactivate Products
  - Product fields: Brand, Product Name, Image Upload, Quantity, Cost Price, Selling Price, Description, Rating (1–5)
- **Customer Management**
  - Search / Delete / Activate / Deactivate Customers
- **User Management**
  - Add / Update / Delete / Search Users
  - Activate / Deactivate Users
- **User Privileges**
  - Admin can enable/disable permissions (e.g., allow/disallow product edits)
- **Profile Management**
  - Admin and users can edit their profiles

---

### 🎨 UI / UX
- Fully responsive design for desktop, tablet, and mobile.
- Modern layout using **Tailwind CSS**.
- **Light/Dark Mode** toggle.
- Clean and attractive template.
- Validated all forms (both client and server side).

---

## 🔗 Application Access

| Role | URL |
|------|------|
| 🧑‍💼 Admin Panel | [http://localhost:3000/login](http://localhost:3000/login) |
| 👥 Customer Panel | [http://localhost:3000/customer/login](http://localhost:3000/customer/login) |

---

## ⚙️ Technologies Used

| Layer | Technology |
|-------|-------------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Laravel 10, PHP 8.1+ |
| Database | MySQL |
| Authentication | Laravel Sanctum / JWT |
| Version Control | Git & GitHub |
| Design | Responsive UI with Dark Mode |

---

## 🧩 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js (v18+)](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [PHP 8.1+](https://www.php.net/)
- [Composer](https://getcomposer.org/)
- [MySQL](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com/)

---

## 🖥️ Frontend Setup (Next.js)

```bash
# 1️⃣ Navigate to frontend directory
cd frontend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run development server
npm run dev
```

## ⚙️ Backend Setup (Laravel 10)
```bash
# 1️⃣ Navigate to backend directory
cd backend

# 2️⃣ Install dependencies
composer install

# 3️⃣ Copy environment file
cp .env.example .env

# 4️⃣ Update .env file with your database credentials

# 5️⃣ Generate application key
php artisan key:generate

# 6️⃣ Run database migrations
php artisan migrate

# 7️⃣ Start development server
php artisan serve
```



