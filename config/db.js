const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    return conn;
  } catch (err) {
    isConnected = false;
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
    console.warn('\n[Notice] MongoDB is not running locally. Database features will be simulated with default portfolio data.\n');
  }
}

function getIsConnected() {
  return isConnected;
}

module.exports = {
  connectDB,
  getIsConnected
};
