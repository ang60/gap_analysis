const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testPaymentAPI() {
  try {
    console.log('🧪 Testing Payment API...\n');

    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/`);
      console.log('✅ Server is running');
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      return;
    }

    // Test 2: Test payment endpoints (without auth for now)
    console.log('\n2. Testing payment endpoints...');
    
    try {
      const paymentsResponse = await axios.get(`${BASE_URL}/payments`);
      console.log('✅ Payments endpoint accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Payments endpoint requires authentication (expected)');
      } else {
        console.log('❌ Payments endpoint error:', error.response?.status, error.response?.data);
      }
    }

    // Test 3: Test M-Pesa callback endpoint
    console.log('\n3. Testing M-Pesa callback endpoint...');
    try {
      const mpesaResponse = await axios.post(`${BASE_URL}/payments/mpesa/callback`, {
        Body: {
          stkCallback: {
            ResultCode: 0,
            ResultDesc: "The service request is processed successfully.",
            CheckoutRequestID: "ws_CO_27012024123456789",
            MerchantRequestID: "29115-34620561-1",
            CallbackMetadata: {
              Item: [
                { Name: "Amount", Value: 1000 },
                { Name: "MpesaReceiptNumber", Value: "NLJ7RT61SV" },
                { Name: "PhoneNumber", Value: "254708374149" },
                { Name: "TransactionDate", Value: "20240127123456" }
              ]
            }
          }
        }
      });
      console.log('✅ M-Pesa callback endpoint working');
    } catch (error) {
      console.log('❌ M-Pesa callback error:', error.response?.status, error.response?.data);
    }

    console.log('\n🎉 Payment API tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the frontend: cd frontend && npm run dev');
    console.log('2. Login as ADMIN or MANAGER');
    console.log('3. Navigate to Payments section');
    console.log('4. Test payment creation with M-Pesa, PayPal, or Stripe');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPaymentAPI();
