import dotenv from 'dotenv';
dotenv.config();

console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Loaded ✓' : 'Not Loaded ✗');
console.log('PORT:', process.env.PORT);
