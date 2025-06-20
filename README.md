# 🩸 RedDrop – Blood Donation Management System

RedDrop is a full-stack blood donation management system developed using **React.js** for the frontend and **Node.js/Express** for the backend, with a **MongoDB Atlas** database. This system makes donor registration, health evaluation, and donation tracking faster, more accurate, and easier to manage — especially compared to manual methods.

---

## 📌 Features

- 🧍‍♂️ **Donor Registration & Login** – Create donor accounts with secure login.
- 🩺 **Health Evaluation** – Donors are screened for eligibility before donation.
- 📅 **Donation Scheduling** – Donors can book time slots for donation.
- 📖 **Donation History** – Donors can view their previous donation records.
- 🛠️ **Admin Dashboard** – Admins manage health checks, donors, and donations.
- 🔐 **JWT Authentication** – Role-based access control for Donors and Admins.

---

## ❓ Problem It Solves

Traditional blood donation processes are slow, paper-based, and unorganized. This leads to:

- Data loss and delays during emergencies  
- Inability to verify donor eligibility quickly  
- Poor record management and donor tracking

**RedDrop** addresses all of this by offering:
- A digitized system  
- Real-time health status and donor availability  
- Automated donor-donation history tracking

---

## 🧰 Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT (JSON Web Token)  
- **Other:** Mongoose, Axios, dotenv, bcrypt

---

## 📁 Project Folder Structure

```

RedDrop/
├── frontend/           # React app
│   ├── public/
│   └── src/
├── backend/            # Node.js server
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── middleware/
└── README.md

````

---

## 🧪 How to Run RedDrop Locally

### 🔁 Step 1: Clone the Repository

```bash
git clone https://github.com/SSaabir/RedDrop-Project-Advanced-Blood-Donation-System.git
cd RedDrop
````

---

### 📦 Step 2: Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

---

### ⚙️ Step 3: Set Up Environment Variables

Inside the `backend` folder, create a file named `.env` and paste the following content:

```env
# Use one of the two MongoDB URIs depending on local/cloud preference
MONGO=mongodb+srv://<username>:<password>@reddrop.eceue.mongodb.net/RedDrop?retryWrites=true&w=majority
# OR
# MONGO=mongodb://localhost:27017/RedDrop

JWT_SECRET=your_jwt_secret
PORT=3020

# Optional
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

```

> ⚠️ **Important:** This `.env` file contains sensitive information. Never upload it to a public repository. Use `.gitignore` to exclude it from commits.

---

### ▶️ Step 4: Start the Application

#### Start Backend

```bash
cd backend
npm run dev
```

#### Start Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

Now open your browser and visit:
🌐 `http://localhost:`

---

## 🧪 Sample Demo Credentials

Use the following credentials for testing:

| Role           | Email                                                       | Password |
| -------------- | ----------------------------------------------------------- | -------- |
| Donor          | [donor@test.com](mailto:donor@test.com)                     | donor123 |
| Hospital Admin | [admin.test@health.gov.lk](mailto:admin.test@health.gov.lk) | admin123 |
| Hospital       | [test@health.gov.lk](mailto:test@health.gov.lk)             | admin123 |
| Manager        | [admin1@bloodbank.lk](mailto:admin1@bloodbank.lk)           | admin123 |

--

> ⚠️ **Note:**  
> A **Manager account** is required to create a new **Hospital** and assign the first **Hospital Admin** to it.  
>  
> Once the hospital and its initial admin are created, **any existing Hospital Admin** of that hospital can create additional admins for their hospital.

---

## 📚 School Project Notice

This is an academic project built to demonstrate full-stack web development. It is **not hosted online** but runs fully on localhost for demonstration purposes.

---

## 🤝 Contributions

Pull requests aren’t expected, but suggestions and improvements are always welcome.
This project was created to showcase full-stack skills in a school setting.

---

## 📄 License

MIT License — free to use, adapt, or learn from.

---

## 🙋‍♂️ Contact

👨‍💻 Lead by: **Siraaj Saabir**
🌐 GitHub: [github.com/SSaabir](https://github.com/SSaabir)
📧 Email: *[siraajsaabir@gmail.com](mailto:siraajsaabir@gmail.com)*

---
