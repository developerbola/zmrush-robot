import http from "http";
import { bot } from "./bot.js";

// Force polling (remove webhook)
await bot.telegram.deleteWebhook({ drop_pending_updates: true });

// Start bot
bot.launch().then(() => {
  console.log("Bot is running...");
});

// Tiny HTTP server for Render
const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Telegram bot is running!");
}).listen(PORT, () => {
  console.log("HTTP server listening on port " + PORT);
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
