const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Enable CORS for all origins (you can restrict later)
app.use(cors({ origin: true }));

// 🔧 Change this to your backend server (HTTP endpoint from FileZilla)
const backendUrl = "http://your-backend-domain-or-ip:your-port";

// Proxy API requests from Firebase Hosting → your backend
app.use("/api", createProxyMiddleware({
  target: backendUrl,
  changeOrigin: true,
  secure: false, // allows connecting to HTTP backend
}));

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
