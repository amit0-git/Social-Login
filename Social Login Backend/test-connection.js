import axios from 'axios';

async function testServer() {
  console.log('Testing server connection...');
  
  try {
    const response = await axios.get('http://localhost:5000/auth/test');
    console.log('✅ Server is running!');
    console.log('Response:', response.data);
    return true;
  } catch (err) {
    console.log('❌ Server is not running or not responding');
    console.log('Error:', err.message);
    return false;
  }
}

testServer(); 