const mongoose = require('mongoose');

let connectionPromise = null;
let configuredUri = null;

function clearCachedConnection() {
  connectionPromise = null;
}

mongoose.connection.on('disconnected', clearCachedConnection);
mongoose.connection.on('close', clearCachedConnection);
mongoose.connection.on('error', (err) => {
  // Mongoose emits connection errors asynchronously as well as rejecting
  // initial connect attempts. Log here so middleware can return a 503 without
  // logging the same error again.
  console.error('[Database] MongoDB connection error:', err.message);
});

mongoose.connection.on('connected', () => {
  configuredUri = process.env.MONGODB_URI || configuredUri;
});

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is missing.');

  if (mongoose.connection.readyState === 1) {
    if (configuredUri && configuredUri !== uri) {
      throw new Error('MONGODB_URI changed after the MongoDB connection was established.');
    }
    return mongoose.connection;
  }

  if (connectionPromise) return connectionPromise;

  configuredUri = uri;
  connectionPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 10000,
    maxPoolSize: 10,
    minPoolSize: 0
  }).then(() => {
    console.log('[Database] MongoDB connected successfully.');
    return mongoose.connection;
  }).catch((err) => {
    clearCachedConnection();
    configuredUri = null;
    throw err;
  });

  return connectionPromise;
}

function getIsConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, getIsConnected };
