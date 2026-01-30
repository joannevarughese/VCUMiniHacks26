// Example test file for testing the Claude API endpoint
// Run with: node test-api.js

const API_URL = 'http://localhost:3001';

async function testChat() {
  console.log('Testing /api/chat endpoint...\n');
  
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello! Can you tell me a short fun fact about hackathons?',
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✓ Success!');
      console.log('\nResponse:', data.response);
      console.log('\nModel:', data.model);
      console.log('Token usage:', data.usage);
    } else {
      console.log('✗ Error:', data.error);
    }
  } catch (error) {
    console.error('✗ Request failed:', error.message);
  }
}

async function testHealth() {
  console.log('\nTesting /health endpoint...\n');
  
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✓ Health check:', data);
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
  }
}

// Run tests
(async () => {
  await testHealth();
  await testChat();
})();
