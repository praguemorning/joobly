import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	// Reuse only a fully open connection (readyState 1).
	if (cached.conn && mongoose.connection.readyState === 1) {
		return cached.conn;
	}

	// Drop stale cache after disconnect / failed connect.
	if (mongoose.connection.readyState === 0) {
		cached.conn = null;
		cached.promise = null;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			serverSelectionTimeoutMS: 10000,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		cached.conn = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;
