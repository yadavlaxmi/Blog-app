require('dotenv').config(); // Load environment variables at the start
const app = require('./app');

const PORT = process.env.PORT || 5000;
console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging line

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
