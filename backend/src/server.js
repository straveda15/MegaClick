import { createServer } from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startOverdueTaskScheduler } from "./modules/task/task.service.js";
import { startLeadAutoDistributeScheduler } from "./modules/sales/services/salesLead.service.js";
import { bootstrapNotificationListeners } from "./modules/notification/notification.eventListener.js";
import { initSocketServer } from "./shared/websocket/socketServer.js";
import { registerTaskNotificationHandlers } from "./modules/task/events/taskNotificationHandler.js";
import { warnIfContactMailerUnconfigured } from "./shared/infrastructure/mailer.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    warnIfContactMailerUnconfigured();

    // Start overdue-task background checker (runs every 15 minutes)
    startOverdueTaskScheduler();
    // Spread new/freed sales leads equally across the roster every 30 min
    startLeadAutoDistributeScheduler();
    bootstrapNotificationListeners();
    registerTaskNotificationHandlers();

    // Wrap Express app in an HTTP server so Socket.IO can share the same port
    const httpServer = createServer(app);
    initSocketServer(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Victory Media Dashboard API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[Startup] Failed to initialize backend:", error);
    process.exit(1);
  }
};

startServer();
