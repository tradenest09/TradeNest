const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const GATEWAY_URL = 'http://localhost:8080/api';
const ORDER_SERVICE_URL = 'http://localhost:8080/api';

async function runTests() {
    console.log("Starting Gateway E2E Tests...\n");
    let jwtToken = "";
    let userId = null;
    let productId = null;
    let testEmail = `testuser_${Date.now()}@test.com`;
    let randomContact = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    // 1. Register User
    try {
        console.log(`Testing: POST /api/users/register with ${testEmail}`);
        const regRes = await axios.post(`${GATEWAY_URL}/users/register`, {
            uname: `user_${Date.now()}`,
            fname: "Test",
            lname: "User",
            contactNumber: randomContact,
            email: testEmail,
            password: "Password123!"
        });
        console.log(`✅ Registration successful. Status: ${regRes.status}`);
        userId = regRes.data.uid || regRes.data.id || regRes.data || 2;
    } catch (e) {
        console.error(`❌ Registration failed:`, e.response?.data || e.message);
        return;
    }

    // 2. Login User
    try {
        console.log(`\nTesting: POST /api/users/login`);
        const loginRes = await axios.post(`${GATEWAY_URL}/users/login`, {
            email: testEmail,
            password: "Password123!"
        });
        console.log(`✅ Login successful. Status: ${loginRes.status}`);
        
        jwtToken = loginRes.data.jwt || loginRes.data.token || loginRes.data;
        if(typeof loginRes.data === 'string' && loginRes.data.length > 20) {
            jwtToken = loginRes.data;
        } else if (loginRes.data.token) {
            jwtToken = loginRes.data.token;
        } else if (loginRes.data.jwt) {
            jwtToken = loginRes.data.jwt;
        }
        
        console.log(`✅ Extracted JWT: ${jwtToken.substring(0, 10)}...`);
    } catch (e) {
        console.error(`❌ Login failed:`, e.response?.data || e.message);
        return;
    }

    const authConfig = { headers: { Authorization: `Bearer ${jwtToken}` } };

    // 3. GET /api/products
    try {
        console.log(`\nTesting: GET /api/products`);
        const prodRes = await axios.get(`${GATEWAY_URL}/products`);
        console.log(`✅ GET Products successful. Status: ${prodRes.status}, count: ${prodRes.data.length}`);
    } catch (e) {
        console.error(`❌ GET Products failed:`, e.response?.data || e.message);
        return;
    }

    // 4. GET /api/categories
    try {
        console.log(`\nTesting: GET /api/categories`);
        const catRes = await axios.get(`${GATEWAY_URL}/categories`);
        console.log(`✅ GET Categories successful. Status: ${catRes.status}, count: ${catRes.data.length}`);
    } catch (e) {
        console.error(`❌ GET Categories failed:`, e.response?.data || e.message);
        return;
    }

    // 5. Authenticated Product Creation
    try {
        console.log(`\nTesting: POST /api/products (Add product)`);
        const prodAddRes = await axios.post(`${GATEWAY_URL}/products`, {
            pname: "Test Product",
            pdesc: "Gateway test",
            price: 100.0,
            cid: 1, 
            type: "SELL",
            uid: userId
        }, authConfig);
        console.log(`✅ Product Creation successful. Status: ${prodAddRes.status}`);
        productId = prodAddRes.data.pid || prodAddRes.data.id || prodAddRes.data;
        if (typeof productId === 'object') productId = productId.pid || 1;
        console.log(`Created Product ID: ${productId}`);
    } catch (e) {
        console.error(`❌ Product Creation failed:`, e.response?.data || e.message);
    }

    // 6. Multipart Image Upload
    if (productId) {
        try {
            console.log(`\nTesting: POST /api/products/${productId}/images`);
            const formData = new FormData();
            formData.append('file', Buffer.from('test image content'), { filename: 'test.png', contentType: 'image/png' });
            
            const uploadConfig = {
                headers: { 
                    ...authConfig.headers,
                    ...formData.getHeaders()
                }
            };
            const uploadRes = await axios.post(`${GATEWAY_URL}/products/${productId}/images`, formData, uploadConfig);
            console.log(`✅ Image Upload successful. Status: ${uploadRes.status}`);
        } catch (e) {
            console.error(`❌ Image Upload failed:`, e.response?.data || e.message);
        }
    }

    // 7. Purchase Workflow - Direct
    if (productId) {
        try {
            console.log(`\nTesting: POST /api/purchases `);
            const purchaseRes = await axios.post(`${ORDER_SERVICE_URL}/purchases`, {
                buyerId: userId,
                sellerId: 3,
                pid: productId,
                amount: 100.0,
                purchaseDate: new Date()
            }, authConfig);
            console.log(`✅ Purchase Workflow successful. Status: ${purchaseRes.status}`);
        } catch (e) {
            console.error(`❌ Purchase Workflow failed:`, e.response?.data || e.message);
        }
    }

    // 8. Rental Workflow - Direct
    if (productId) {
        try {
            console.log(`\nTesting: POST /api/rentals `);
            const rentRes = await axios.post(`${ORDER_SERVICE_URL}/rentals`, {
                renterId: userId,
                ownerId: 3,
                pid: productId,
                amount: 50.0,
                startDate: new Date(),
                endDate: new Date()
            }, authConfig);
            console.log(`✅ Rental Workflow successful. Status: ${rentRes.status}`);
        } catch (e) {
            console.error(`❌ Rental Workflow failed:`, e.response?.data || e.message);
        }
    }

    // 9. Profile Update
    try {
        console.log(`\nTesting: PUT /api/users/${userId} (Profile Update)`);
        const profRes = await axios.put(`${GATEWAY_URL}/users/${userId}`, {
            fname: "Updated Gateway Test",
            lname: "User",
            contactNumber: randomContact
        }, authConfig);
        console.log(`✅ Profile Update successful. Status: ${profRes.status}`);
    } catch (e) {
        console.error(`❌ Profile Update failed:`, e.response?.data || e.message);
    }

    // 10. Change Password
    try {
        console.log(`\nTesting: PUT /api/users/change-password`);
        const passRes = await axios.put(`${GATEWAY_URL}/users/change-password`, {
            currentPassword: "Password123!",
            newPassword: "NewPassword123!",
            confirmPassword: "NewPassword123!"
        }, authConfig);
        console.log(`✅ Change Password successful. Status: ${passRes.status}`);
    } catch (e) {
        console.error(`❌ Change Password failed:`, e.response?.data || e.message);
    }

    console.log(`\nAll tests completed!`);
}

runTests();
