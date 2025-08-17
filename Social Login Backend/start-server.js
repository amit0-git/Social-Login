import { spawn } from 'child_process';
import axios from 'axios';

console.log('Starting server...');

const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

// Wait a moment for server to start
setTimeout(async () => {
  try {
    const response = await axios.get('http://localhost:5000/auth/test');
    console.log('✅ Server is running!');
    console.log('Response:', response.data);
  } catch (err) {
    console.log('❌ Server test failed:', err.message);
  }
}, 2000);

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
}); 