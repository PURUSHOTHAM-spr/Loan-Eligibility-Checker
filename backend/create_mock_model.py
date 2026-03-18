import pandas as pd
import numpy as np
import xgboost as xgb
import os

print("Generating dummy data for local model training...")

# Generate simple dummy data to train a model with the exact 15 features 
# required by the inference pipeline so we have a valid xgboost_model.json locally.

def create_mock_data(n_samples=2000):
    np.random.seed(42)
    loan_amnt = np.random.uniform(1000, 40000, n_samples)
    term = np.random.choice([36, 60], n_samples)
    int_rate = np.random.uniform(5.0, 25.0, n_samples)
    annual_inc = np.random.uniform(20000, 150000, n_samples)
    dti = np.random.uniform(0.0, 40.0, n_samples)
    fico_range_high = np.random.randint(600, 850, n_samples)
    
    # Simple installment calculation approx
    installment = loan_amnt * (int_rate/100/12) / (1 - (1 + int_rate/100/12)**(-term))
    
    df = pd.DataFrame({
        'loan_amnt': loan_amnt,
        'term': term,
        'int_rate': int_rate,
        'installment': installment,
        'annual_inc': annual_inc,
        'dti': dti,
        'fico_range_high': fico_range_high
    })
    
    # Apply feature engineering
    df['loan_income_ratio'] = df['loan_amnt'] / df['annual_inc']
    df['emi_income_ratio'] = df['installment'] / df['annual_inc']
    df['income_per_installment'] = df['annual_inc'] / df['installment']
    df['credit_score_income'] = df['fico_range_high'] / df['annual_inc']
    df['loan_term_ratio'] = df['loan_amnt'] / df['term']
    df['interest_income_ratio'] = df['int_rate'] / df['annual_inc']
    df['emi_loan_ratio'] = df['installment'] / df['loan_amnt']
    df['fraud_flag'] = (df['loan_amnt'] > df['annual_inc'] * 2).astype(int)
    
    # Create simple target variable logic for the mock
    # If FICO high and DTI low -> Approved (1)
    target_score = (fico_range_high/850) - (dti/40) + (annual_inc/150000)
    median_score = np.median(target_score)
    df['loan_status'] = (target_score > median_score).astype(int)
    
    return df

df_mock = create_mock_data()
X = df_mock.drop('loan_status', axis=1)
y = df_mock['loan_status']

# Train XGBoost
print("Training mock XGBoost model...")
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    random_state=42,
    eval_metric='logloss'
)

model.fit(X, y)

# Save the model
model_path = os.path.join(os.path.dirname(__file__), 'xgboost_model.json')
model.save_model(model_path)
print(f"✅ Saved mock model to {model_path}")
