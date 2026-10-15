import { app } from "./app.js";
import { config } from "./config/index.js";

const PORT = config.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 DropPilot REST API Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🌐 Allowed Client Origin: ${config.CLIENT_ORIGIN}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Gracefully shutting down HTTP server...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Gracefully shutting down HTTP server...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});
