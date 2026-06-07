const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.useMock = true;
    }

    async checkHealth() {
        try {
            console.log('Checking backend health...');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Backend connected:', data);
                this.useMock = false;
                return data;
            }
        } catch (error) {
            console.warn('Backend not available:', error.message);
            this.useMock = true;
        }

        return { status: 'mock', model_loaded: false };
    }

    async predictChurn(customerData) {
        if (this.useMock) {
            console.log('Using mock prediction');
            return this.mockPrediction(customerData);
        }

        try {
            console.log('Sending prediction request for:', customerData);

            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(customerData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Prediction API error:', response.status, errorText);
                throw new Error(`Prediction failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Prediction received:', data);
            return data;

        } catch (error) {
            console.error('Prediction error:', error);
            this.useMock = true;
            return this.mockPrediction(customerData);
        }
    }

    async predictBatch(customers) {
        if (this.useMock) {
            return this.mockBatchPrediction(customers);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/predict/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customers }),
            });

            if (!response.ok) throw new Error('Batch prediction failed');
            return await response.json();
        } catch (error) {
            console.error('Batch prediction failed:', error);
            return this.mockBatchPrediction(customers);
        }
    }

    async getFeatureImportance() {
        if (this.useMock) {
            return {
                success: true,
                features: [
                    { feature: "Customer Service Calls", importance: 0.123834, percentage: "12.38%" },
                    { feature: "Payment Method Diversity", importance: 0.089173, percentage: "8.92%" },
                    { feature: "Product Reviews Written", importance: 0.063960, percentage: "6.40%" }
                ]
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/feature-importance`);
            return await response.json();
        } catch (error) {
            console.error('Failed to get feature importance:', error);
            return { success: false, features: [] };
        }
    }

    mockPrediction(customerData) {
        let score = 0.15;

        if (customerData.Customer_Service_Calls > 5) score += 0.25;
        else if (customerData.Customer_Service_Calls > 3) score += 0.15;

        if (customerData.Cart_Abandonment_Rate > 60) score += 0.20;
        else if (customerData.Cart_Abandonment_Rate > 40) score += 0.10;

        if (customerData.Days_Since_Last_Purchase > 60) score += 0.20;
        else if (customerData.Days_Since_Last_Purchase > 30) score += 0.10;

        if (customerData.Total_Purchases > 10) score -= 0.20;
        else if (customerData.Total_Purchases > 5) score -= 0.10;

        if (customerData.Lifetime_Value > 2000) score -= 0.15;
        else if (customerData.Lifetime_Value > 1000) score -= 0.08;

        score = Math.min(0.95, Math.max(0.05, score));

        return {
            success: true,
            churn_probability: score,
            risk_percentage: `${(score * 100).toFixed(1)}%`,
            risk_level: score >= 0.7 ? 'High' : (score >= 0.4 ? 'Medium' : 'Low'),
            risk_color: score >= 0.7 ? "#ef4444" : (score >= 0.4 ? "#f59e0b" : "#10b981"),
            prediction: score > 0.5 ? 1 : 0,
            recommendations: [
                {
                    priority: 'High',
                    factor: 'Customer Service Calls',
                    current_value: `${customerData.Customer_Service_Calls || 0} calls`,
                    impact: 'Increases churn significantly',
                    action: 'Implement proactive support',
                    campaign: 'Support improvement',
                    channel: 'Customer Support'
                }
            ],
            top_factors: []
        };
    }

    mockBatchPrediction(customers) {
        const predictions = customers.map(customer => {
            const pred = this.mockPrediction(customer);
            return {
                customer_id: customer.customer_id,
                churn_probability: pred.churn_probability,
                risk_level: pred.risk_level
            };
        });

        const probabilities = predictions.map(p => p.churn_probability);

        return {
            success: true,
            total_customers: customers.length,
            predictions: predictions,
            summary: {
                avg_churn_probability: probabilities.reduce((a, b) => a + b, 0) / probabilities.length,
                high_risk_count: predictions.filter(p => p.risk_level === 'High').length,
                medium_risk_count: predictions.filter(p => p.risk_level === 'Medium').length,
                low_risk_count: predictions.filter(p => p.risk_level === 'Low').length
            }
        };
    }
}

export default new ApiService();