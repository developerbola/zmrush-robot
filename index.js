import http from "http";
import { bot } from "./bot.js"; // your Telegram bot code

// Start your Telegram bot (polling mode)
bot.launch().then(() => {
  console.log("Bot is running...");
});

// Minimal HTTP server required only for Render
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Telegram bot is running!");
}).listen(PORT, () => {
  console.log("HTTP server listening on port " + PORT);
});

// Graceful shutdown for Render
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
