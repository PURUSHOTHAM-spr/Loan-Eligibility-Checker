#  Loan Eligibility Predictor

A full-stack web application that predicts loan eligibility using Machine Learning.

## Features

* Predict loan eligibility (Eligible / Not Eligible)
* Real-time form input with validation
* ML-based prediction (not rule-based)
* Feature engineering (income ratios, EMI ratio, etc.)
* Interactive dashboard with charts

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Machine Learning

* Python (Scikit-learn / Pandas / NumPy)

---

## 📂 Project Structure

```
Loan-Eligibility-Checker/
│
├── frontend/
│   ├── src/
│   ├── package.json
│
├── backend/
│   ├── server.js
│
├── model/
│   ├── model.pkl
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone <your-repo-url>
cd Loan-Eligibility-Checker
```

---

### 2️⃣ Install Frontend Dependencies

```
cd frontend
npm install
```

---

### 3️⃣ Install Backend Dependencies

```
cd ../backend
npm install
```

---

### 4️⃣ Install Python Dependencies

```
pip install pandas numpy scikit-learn flask
```

---

## ▶️ Running the Application

### Start Backend

```
cd backend
npm start
```

---

### Start Frontend

```
cd frontend
npm run dev
```

---

### Run ML Model (if separate service)

```
python app.py
```

---

## Access Application

* Frontend: http://localhost:5173
* Backend: http://localhost:5000

---

##  Input Features

* Loan Amount
* Annual Income
* Interest Rate
* Term
* Debt-to-Income Ratio
* Credit Score
* Employment Length
* Credit History Length
* Delinquencies
* Credit Utilization

---

## Model Details

* Algorithm: Logistic Regression / Random Forest
* Feature Engineering:

  * Loan-to-Income Ratio
  * EMI-to-Income Ratio
* Output:

  * Eligibility (0 / 1)
  * Risk Score

---

##  Future Improvements

* Add user authentication
* Deploy using Docker
* Improve model accuracy
* Add more financial features

---
