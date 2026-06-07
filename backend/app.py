from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import json
from datetime import datetime

app = Flask(__name__)

# CORS configuration - lebih lengkap
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

# Load XGBoost model
print("Loading XGBoost churn model...")
model = joblib.load('models/xgboost_churn_model.joblib')
print("Model loaded successfully!")

# Model membutuhkan 71 fitur
TOTAL_FEATURES = 71

# Daftar fitur yang kita ketahui (20 fitur dasar)
KNOWN_FEATURES = [
    'Age', 'Membership_Years', 'Login_Frequency', 'Session_Duration_Avg',
    'Pages_Per_Session', 'Cart_Abandonment_Rate', 'Wishlist_Items',
    'Total_Purchases', 'Average_Order_Value', 'Days_Since_Last_Purchase',
    'Discount_Usage_Rate', 'Returns_Rate', 'Email_Open_Rate',
    'Customer_Service_Calls', 'Product_Reviews_Written',
    'Social_Media_Engagement_Score', 'Mobile_App_Usage',
    'Payment_Method_Diversity', 'Lifetime_Value', 'Credit_Balance'
]

# Threshold untuk setiap fitur (sama seperti sebelumnya)
THRESHOLDS = {
    'Customer_Service_Calls': {'high': 5, 'medium': 3, 'impact_high': 0.25, 'impact_medium': 0.15},
    'Payment_Method_Diversity': {'low': 0.3, 'medium': 0.5, 'impact_low': 0.18, 'impact_medium': 0.10},
    'Product_Reviews_Written': {'none': 0, 'few': 2, 'impact_none': 0.14, 'impact_few': 0.07},
    'Lifetime_Value': {'low': 500, 'medium': 1000, 'impact_low': 0.12, 'impact_medium': 0.06},
    'Cart_Abandonment_Rate': {'high': 60, 'medium': 40, 'impact_high': 0.11, 'impact_medium': 0.06},
    'Days_Since_Last_Purchase': {'high': 60, 'medium': 30, 'impact_high': 0.08, 'impact_medium': 0.04},
    'Discount_Usage_Rate': {'high': 70, 'medium': 50, 'impact_high': 0.08, 'impact_medium': 0.04},
    'Wishlist_Items': {'none': 0, 'few': 2, 'impact_none': 0.09, 'impact_few': 0.04},
    'Email_Open_Rate': {'low': 20, 'medium': 35, 'impact_low': 0.05, 'impact_medium': 0.02}
}

# Action mapping untuk setiap faktor
ACTIONS = {
    'Customer_Service_Calls': {
        'action': 'Implement proactive support and self-service options',
        'campaign': 'Support ticket review',
        'channel': 'Customer Support'
    },
    'Payment_Method_Diversity': {
        'action': 'Add more payment methods and simplify checkout flow',
        'campaign': 'Payment optimization',
        'channel': 'Product'
    },
    'Product_Reviews_Written': {
        'action': 'Launch review incentive program with discounts',
        'campaign': 'Review rewards campaign',
        'channel': 'Email'
    },
    'Lifetime_Value': {
        'action': 'Create upsell and cross-sell campaigns',
        'campaign': 'Value growth program',
        'channel': 'Email & Push'
    },
    'Cart_Abandonment_Rate': {
        'action': 'Optimize checkout process and send recovery emails',
        'campaign': 'Cart recovery flow',
        'channel': 'Email'
    },
    'Days_Since_Last_Purchase': {
        'action': 'Send re-engagement campaign with personalized offers',
        'campaign': 'Reactivation series',
        'channel': 'Email & SMS'
    },
    'Wishlist_Items': {
        'action': 'Personalized recommendations and discovery features',
        'campaign': 'Discovery engine',
        'channel': 'Push Notification'
    },
    'Discount_Usage_Rate': {
        'action': 'Balance promotional strategy with loyalty program',
        'campaign': 'Loyalty program',
        'channel': 'Email'
    },
    'Email_Open_Rate': {
        'action': 'Improve email content and sending frequency',
        'campaign': 'Email optimization',
        'channel': 'Marketing'
    }
}

def prepare_features(customer):
    """Prepare features for XGBoost model - menghasilkan 71 fitur dengan zero padding"""
    # Fitur dasar (20 fitur)
    base_features = [
        float(customer.get('Age', 30)),
        float(customer.get('Membership_Years', 1)),
        float(customer.get('Login_Frequency', 10)),
        float(customer.get('Session_Duration_Avg', 30)),
        float(customer.get('Pages_Per_Session', 5)),
        float(customer.get('Cart_Abandonment_Rate', 30)),
        float(customer.get('Wishlist_Items', 2)),
        float(customer.get('Total_Purchases', 10)),
        float(customer.get('Average_Order_Value', 100)),
        float(customer.get('Days_Since_Last_Purchase', 15)),
        float(customer.get('Discount_Usage_Rate', 30)),
        float(customer.get('Returns_Rate', 5)),
        float(customer.get('Email_Open_Rate', 40)),
        float(customer.get('Customer_Service_Calls', 1)),
        float(customer.get('Product_Reviews_Written', 2)),
        float(customer.get('Social_Media_Engagement_Score', 50)),
        float(customer.get('Mobile_App_Usage', 1)),
        float(customer.get('Payment_Method_Diversity', 0.5)),
        float(customer.get('Lifetime_Value', 1000)),
        float(customer.get('Credit_Balance', 2000))
    ]
    
    # Tambahkan fitur lainnya dengan nilai 0 sampai total 71 fitur
    features = base_features + [0] * (TOTAL_FEATURES - len(base_features))
    
    return features

def generate_recommendations(customer, churn_probability):
    """Generate dynamic recommendations based on customer data"""
    recommendations = []
    
    # 1. Customer Service Calls
    service_calls = customer.get('Customer_Service_Calls', 0)
    if service_calls > THRESHOLDS['Customer_Service_Calls']['high']:
        recommendations.append({
            'priority': 'Critical',
            'factor': 'Customer Service Calls',
            'current_value': f'{service_calls} calls',
            'threshold': f"{THRESHOLDS['Customer_Service_Calls']['high']}+ calls",
            'impact': f'Increases churn by {THRESHOLDS["Customer_Service_Calls"]["impact_high"]*100:.0f}%',
            'action': ACTIONS['Customer_Service_Calls']['action'],
            'campaign': ACTIONS['Customer_Service_Calls']['campaign'],
            'channel': ACTIONS['Customer_Service_Calls']['channel']
        })
    elif service_calls > THRESHOLDS['Customer_Service_Calls']['medium']:
        recommendations.append({
            'priority': 'High',
            'factor': 'Customer Service Calls',
            'current_value': f'{service_calls} calls',
            'threshold': f"{THRESHOLDS['Customer_Service_Calls']['medium']}-{THRESHOLDS['Customer_Service_Calls']['high']} calls",
            'impact': f'Increases churn by {THRESHOLDS["Customer_Service_Calls"]["impact_medium"]*100:.0f}%',
            'action': 'Monitor support tickets and improve FAQ',
            'campaign': 'Self-service improvement',
            'channel': 'Support'
        })
    
    # 2. Payment Method Diversity
    payment_div = customer.get('Payment_Method_Diversity', 0.5)
    if payment_div < THRESHOLDS['Payment_Method_Diversity']['low']:
        recommendations.append({
            'priority': 'High',
            'factor': 'Payment Method Diversity',
            'current_value': f'{payment_div*100:.0f}% diversity',
            'threshold': f"<{THRESHOLDS['Payment_Method_Diversity']['low']*100:.0f}%",
            'impact': f'Increases churn by {THRESHOLDS["Payment_Method_Diversity"]["impact_low"]*100:.0f}%',
            'action': ACTIONS['Payment_Method_Diversity']['action'],
            'campaign': ACTIONS['Payment_Method_Diversity']['campaign'],
            'channel': ACTIONS['Payment_Method_Diversity']['channel']
        })
    elif payment_div < THRESHOLDS['Payment_Method_Diversity']['medium']:
        recommendations.append({
            'priority': 'Medium',
            'factor': 'Payment Method Diversity',
            'current_value': f'{payment_div*100:.0f}% diversity',
            'threshold': f"{THRESHOLDS['Payment_Method_Diversity']['low']*100:.0f}-{THRESHOLDS['Payment_Method_Diversity']['medium']*100:.0f}%",
            'impact': f'Increases churn by {THRESHOLDS["Payment_Method_Diversity"]["impact_medium"]*100:.0f}%',
            'action': 'Consider adding popular payment methods',
            'campaign': 'Payment expansion',
            'channel': 'Product'
        })
    
    # 3. Product Reviews
    reviews = customer.get('Product_Reviews_Written', 0)
    if reviews == THRESHOLDS['Product_Reviews_Written']['none']:
        recommendations.append({
            'priority': 'High',
            'factor': 'Product Reviews Written',
            'current_value': '0 reviews',
            'threshold': 'No reviews',
            'impact': f'Increases churn by {THRESHOLDS["Product_Reviews_Written"]["impact_none"]*100:.0f}%',
            'action': ACTIONS['Product_Reviews_Written']['action'],
            'campaign': ACTIONS['Product_Reviews_Written']['campaign'],
            'channel': ACTIONS['Product_Reviews_Written']['channel']
        })
    elif reviews < THRESHOLDS['Product_Reviews_Written']['few']:
        recommendations.append({
            'priority': 'Medium',
            'factor': 'Product Reviews Written',
            'current_value': f'{reviews} reviews',
            'threshold': '1-2 reviews',
            'impact': f'Increases churn by {THRESHOLDS["Product_Reviews_Written"]["impact_few"]*100:.0f}%',
            'action': 'Encourage more product reviews',
            'campaign': 'Review incentive',
            'channel': 'Email'
        })
    
    # 4. Lifetime Value
    ltv = customer.get('Lifetime_Value', 1000)
    if ltv < THRESHOLDS['Lifetime_Value']['low']:
        recommendations.append({
            'priority': 'High',
            'factor': 'Lifetime Value',
            'current_value': f'${ltv:.0f}',
            'threshold': f'<${THRESHOLDS["Lifetime_Value"]["low"]}',
            'impact': f'Increases churn by {THRESHOLDS["Lifetime_Value"]["impact_low"]*100:.0f}%',
            'action': ACTIONS['Lifetime_Value']['action'],
            'campaign': ACTIONS['Lifetime_Value']['campaign'],
            'channel': ACTIONS['Lifetime_Value']['channel']
        })
    elif ltv < THRESHOLDS['Lifetime_Value']['medium']:
        recommendations.append({
            'priority': 'Medium',
            'factor': 'Lifetime Value',
            'current_value': f'${ltv:.0f}',
            'threshold': f'${THRESHOLDS["Lifetime_Value"]["low"]}-${THRESHOLDS["Lifetime_Value"]["medium"]}',
            'impact': f'Increases churn by {THRESHOLDS["Lifetime_Value"]["impact_medium"]*100:.0f}%',
            'action': 'Offer bundle discounts to increase value',
            'campaign': 'Bundle offers',
            'channel': 'Email'
        })
    
    # 5. Cart Abandonment Rate
    cart_abandon = customer.get('Cart_Abandonment_Rate', 30)
    if cart_abandon > THRESHOLDS['Cart_Abandonment_Rate']['high']:
        recommendations.append({
            'priority': 'High',
            'factor': 'Cart Abandonment Rate',
            'current_value': f'{cart_abandon:.0f}%',
            'threshold': f'>{THRESHOLDS["Cart_Abandonment_Rate"]["high"]}%',
            'impact': f'Increases churn by {THRESHOLDS["Cart_Abandonment_Rate"]["impact_high"]*100:.0f}%',
            'action': ACTIONS['Cart_Abandonment_Rate']['action'],
            'campaign': ACTIONS['Cart_Abandonment_Rate']['campaign'],
            'channel': ACTIONS['Cart_Abandonment_Rate']['channel']
        })
    elif cart_abandon > THRESHOLDS['Cart_Abandonment_Rate']['medium']:
        recommendations.append({
            'priority': 'Medium',
            'factor': 'Cart Abandonment Rate',
            'current_value': f'{cart_abandon:.0f}%',
            'threshold': f"{THRESHOLDS['Cart_Abandonment_Rate']['medium']}-{THRESHOLDS['Cart_Abandonment_Rate']['high']}%",
            'impact': f'Increases churn by {THRESHOLDS["Cart_Abandonment_Rate"]["impact_medium"]*100:.0f}%',
            'action': 'Send cart recovery reminders',
            'campaign': 'Cart recovery',
            'channel': 'Email'
        })
    
    # 6. Days Since Last Purchase
    days_inactive = customer.get('Days_Since_Last_Purchase', 15)
    if days_inactive > THRESHOLDS['Days_Since_Last_Purchase']['high']:
        recommendations.append({
            'priority': 'High',
            'factor': 'Days Since Last Purchase',
            'current_value': f'{days_inactive:.0f} days',
            'threshold': f'>{THRESHOLDS["Days_Since_Last_Purchase"]["high"]} days',
            'impact': f'Increases churn by {THRESHOLDS["Days_Since_Last_Purchase"]["impact_high"]*100:.0f}%',
            'action': ACTIONS['Days_Since_Last_Purchase']['action'],
            'campaign': ACTIONS['Days_Since_Last_Purchase']['campaign'],
            'channel': ACTIONS['Days_Since_Last_Purchase']['channel']
        })
    elif days_inactive > THRESHOLDS['Days_Since_Last_Purchase']['medium']:
        recommendations.append({
            'priority': 'Medium',
            'factor': 'Days Since Last Purchase',
            'current_value': f'{days_inactive:.0f} days',
            'threshold': f"{THRESHOLDS['Days_Since_Last_Purchase']['medium']}-{THRESHOLDS['Days_Since_Last_Purchase']['high']} days",
            'impact': f'Increases churn by {THRESHOLDS["Days_Since_Last_Purchase"]["impact_medium"]*100:.0f}%',
            'action': 'Send win-back offers',
            'campaign': 'Win-back campaign',
            'channel': 'Email'
        })
    
    # Urutkan berdasarkan priority
    priority_order = {'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3}
    recommendations.sort(key=lambda x: priority_order.get(x['priority'], 3))
    
    return recommendations[:5]

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_type': 'XGBoost',
        'expected_features': TOTAL_FEATURES
    })

@app.route('/api/predict', methods=['POST'])
def predict_churn():
    try:
        data = request.json
        
        # Prepare features (71 fitur dengan zero padding)
        features = prepare_features(data)
        
        # Untuk debug
        print(f"Prepared {len(features)} features")
        
        feature_df = pd.DataFrame([features])
        
        # Get prediction
        churn_probability = float(model.predict_proba(feature_df)[0][1])
        
        # Determine risk level
        if churn_probability >= 0.7:
            risk_level = "High"
            risk_color = "#ef4444"
        elif churn_probability >= 0.4:
            risk_level = "Medium"
            risk_color = "#f59e0b"
        else:
            risk_level = "Low"
            risk_color = "#10b981"
        
        # Generate dynamic recommendations
        recommendations = generate_recommendations(data, churn_probability)
        
        # Get top factors
        top_factors = []
        for rec in recommendations[:3]:
            top_factors.append({
                'factor': rec['factor'],
                'current_value': rec['current_value'],
                'impact': rec['impact']
            })
        
        return jsonify({
            'success': True,
            'churn_probability': churn_probability,
            'risk_percentage': f"{churn_probability * 100:.1f}%",
            'risk_level': risk_level,
            'risk_color': risk_color,
            'prediction': int(churn_probability > 0.5),
            'recommendations': recommendations,
            'top_factors': top_factors,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/predict/batch', methods=['POST'])
def predict_batch():
    try:
        data = request.json
        customers = data.get('customers', [])
        
        if not customers:
            return jsonify({'error': 'No customers provided'}), 400
        
        results = []
        for customer in customers:
            try:
                features = prepare_features(customer)
                feature_df = pd.DataFrame([features])
                proba = float(model.predict_proba(feature_df)[0][1])
                
                results.append({
                    'customer_id': customer.get('customer_id'),
                    'churn_probability': proba,
                    'risk_level': 'High' if proba >= 0.7 else 'Medium' if proba >= 0.4 else 'Low'
                })
            except Exception as e:
                results.append({
                    'customer_id': customer.get('customer_id'),
                    'error': str(e)
                })
        
        probabilities = [r['churn_probability'] for r in results if 'churn_probability' in r]
        
        return jsonify({
            'success': True,
            'total_customers': len(customers),
            'predictions': results,
            'summary': {
                'avg_churn_probability': np.mean(probabilities) if probabilities else 0,
                'high_risk_count': sum(1 for r in results if r.get('risk_level') == 'High'),
                'medium_risk_count': sum(1 for r in results if r.get('risk_level') == 'Medium'),
                'low_risk_count': sum(1 for r in results if r.get('risk_level') == 'Low')
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/feature-importance', methods=['GET'])
def get_feature_importance():
    try:
        importance = model.feature_importances_
        
        # Gunakan KNOWN_FEATURES untuk 20 fitur pertama
        features_importance = []
        for i, name in enumerate(KNOWN_FEATURES):
            if i < len(importance):
                features_importance.append({
                    'feature': name.replace('_', ' ').title(),
                    'importance': float(importance[i]),
                    'percentage': f"{importance[i] * 100:.1f}%"
                })
        
        features_importance.sort(key=lambda x: x['importance'], reverse=True)
        
        return jsonify({
            'success': True,
            'features': features_importance[:15]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    print(f"Model expects {TOTAL_FEATURES} features")
    app.run(host='0.0.0.0', port=5000, debug=True)