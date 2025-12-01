import { Telegraf } from "telegraf";

export const bot = new Telegraf(
  "7483133104:AAHNctCp8xKXxWwHGo-CFo_hb13iM9wz-mY"
);

// Store for warnings, banned words, and group settings
const groupData = new Map();

// Helper function to get group data
function getGroupData(chatId) {
  if (!groupData.has(chatId)) {
    groupData.set(chatId, {
      warnings: new Map(),
      bannedWords: new Set(),
      welcomeMessage: "Welcome to the group, {user}!",
      rules: "No rules set yet. Admins can set rules with /setrules",
      antiSpam: true,
      maxWarnings: 3,
    });
  }
  return groupData.get(chatId);
}

// Helper function to check if user is admin
async function isAdmin(ctx, userId) {
  try {
    const member = await ctx.telegram.getChatMember(ctx.chat.id, userId);
    return ["creator", "administrator"].includes(member.status);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Helper function to get user mention
function getUserMention(user) {
  return user.username ? `@${user.username}` : user.first_name;
}

// ==================== WELCOME MESSAGE ====================
bot.on("new_chat_members", async (ctx) => {
  const data = getGroupData(ctx.chat.id);
  const newMembers = ctx.message.new_chat_members;

  for (const member of newMembers) {
    const mention = getUserMention(member);
    const welcomeMsg = data.welcomeMessage.replace("{user}", mention);
    await ctx.reply(welcomeMsg);
  }
});

// ==================== ADMIN COMMANDS ====================

// Start command
bot.command("start", async (ctx) => {
  await ctx.reply(
    "*Group Controller Bot*\n\n" +
      "I help manage your Telegram groups!\n\n" +
      "*Admin Commands:*\n" +
      "/kick - Kick a user\n" +
      "/ban - Ban a user\n" +
      "/unban - Unban a user\n" +
      "/mute - Mute a user\n" +
      "/unmute - Unmute a user\n" +
      "/warn - Warn a user\n" +
      "/warnings - Check user warnings\n" +
      "/resetwarnings - Reset user warnings\n" +
      "/pin - Pin a message\n" +
      "/unpin - Unpin a message\n" +
      "/setrules - Set group rules\n" +
      "/setwelcome - Set welcome message\n" +
      "/addword - Add banned word\n" +
      "/removeword - Remove banned word\n" +
      "/listwords - List banned words\n\n" +
      "*User Commands:*\n" +
      "/rules - View group rules\n" +
      "/info - Get user info\n" +
      "/help - Show this message",
    { parse_mode: "Markdown" }
  );
});

// Help command
bot.command("help", async (ctx) => {
  await ctx.reply(
    "*Help Menu*\n\n" +
      "*For Users:*\n" +
      "/rules - View group rules\n" +
      "/info - Get information about a user\n\n" +
      "*For Admins:*\n" +
      "Use /start to see all admin commands",
    { parse_mode: "Markdown" }
  );
});

// Kick command
bot.command("kick", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("You need to be an admin to use this command!");
  }

  const userId = ctx.message.reply_to_message?.from.id;
  if (!userId) {
    return ctx.reply("Reply to a user's message to kick them!");
  }

  try {
    await ctx.telegram.banChatMember(ctx.chat.id, userId);
    await ctx.telegram.unbanChatMember(ctx.chat.id, userId);
    const user = ctx.message.reply_to_message.from;
    await ctx.reply(`${getUserMention(user)} has been kicked!`);
  } catch (error) {
    await ctx.reply("Failed to kick user. Make sure I have admin rights!");
  }
});

// Ban command
bot.command("ban", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const userId = ctx.message.reply_to_message?.from.id;
  if (!userId) {
    return ctx.reply("Reply to a user's message to ban them!");
  }

  try {
    await ctx.telegram.banChatMember(ctx.chat.id, userId);
    const user = ctx.message.reply_to_message.from;
    await ctx.reply(`${getUserMention(user)} has been banned!`);
  } catch (error) {
    await ctx.reply("Failed to ban user. Make sure I have admin rights!");
  }
});

// Unban command
bot.command("unban", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const userId = ctx.message.reply_to_message?.from.id;
  if (!userId) {
    return ctx.reply("Reply to a user's message to unban them!");
  }

  try {
    await ctx.telegram.unbanChatMember(ctx.chat.id, userId);
    const user = ctx.message.reply_to_message.from;
    await ctx.reply(`${getUserMention(user)} has been unbanned!`);
  } catch (error) {
    await ctx.reply("Failed to unban user.");
  }
});

// Mute command
bot.command("mute", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const userId = ctx.message.reply_to_message?.from.id;
  if (!userId) {
    return ctx.reply("Reply to a user's message to mute them!");
  }

  try {
    await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
      permissions: {
        can_send_messages: false,
        can_send_media_messages: false,
        can_send_polls: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
        can_change_info: false,
        can_invite_users: false,
        can_pin_messages: false,
      },
    });
    const user = ctx.message.reply_to_message.from;
    await ctx.reply(`${getUserMention(user)} has been muted!`);
  } catch (error) {
    await ctx.reply("Failed to mute user. Make sure I have admin rights!");
  }
});

// Unmute command
bot.command("unmute", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const userId = ctx.message.reply_to_message?.from.id;
  if (!userId) {
    return ctx.reply("Reply to a user's message to unmute them!");
  }

  try {
    await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
      permissions: {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: false,
        can_invite_users: true,
        can_pin_messages: false,
      },
    });
    const user = ctx.message.reply_to_message.from;
    await ctx.reply(`${getUserMention(user)} has been unmuted!`);
  } catch (error) {
    await ctx.reply("Failed to unmute user.");
  }
});

// ==================== WARNING SYSTEM ====================

// Warn command
bot.command("warn", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const userId = ctx.message.reply_to_message?.from.id;
  if (!userId) {
    return ctx.reply("Reply to a user's message to warn them!");
  }

  const data = getGroupData(ctx.chat.id);
  const currentWarnings = data.warnings.get(userId) || 0;
  const newWarnings = currentWarnings + 1;
  data.warnings.set(userId, newWarnings);

  const user = ctx.message.reply_to_message.from;
  const reason =
    ctx.message.text.split(" ").slice(1).join(" ") || "No reason provided";

  if (newWarnings >= data.maxWarnings) {
    try {
      const untilDate = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
        permissions: {
          can_send_messages: false,
          can_send_media_messages: false,
          can_send_polls: false,
          can_send_other_messages: false,
          can_add_web_page_previews: false,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false,
        },
        until_date: untilDate,
      });

      const unmuteTime = new Date(untilDate * 1000).toLocaleTimeString(
        "en-US",
        {
          timeZone: "Asia/Kolkata", // Adjust timezone as needed or make it dynamic
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      await ctx.reply(
        `${getUserMention(user)} has been muted for 1 hour!\n` +
          `Reason: Reached maximum warnings (${data.maxWarnings})\n` +
          `They will be unmuted at ${unmuteTime}`
      );
      data.warnings.delete(userId);
    } catch (error) {
      console.error("Failed to mute user:", error);
      await ctx.reply(
        "Failed to mute user after max warnings. Make sure I have admin rights!"
      );
    }
  } else {
    await ctx.reply(
      `${getUserMention(user)} has been warned!\n` +
        `Warnings: ${newWarnings}/${data.maxWarnings}\n` +
        `Reason: ${reason}`
    );
  }
});

// Check warnings
bot.command("warnings", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const userId = ctx.message.reply_to_message?.from.id || ctx.from.id;
  const data = getGroupData(ctx.chat.id);
  const warnings = data.warnings.get(userId) || 0;
  const user = ctx.message.reply_to_message?.from || ctx.from;

  await ctx.reply(
    `Warnings for ${getUserMention(user)}: ${warnings}/${data.maxWarnings}`
  );
});

// Reset warnings
bot.command("resetwarnings", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const userId = ctx.message.reply_to_message?.from.id;
  if (!userId) {
    return ctx.reply("❌ Reply to a user's message to reset their warnings!");
  }

  const data = getGroupData(ctx.chat.id);
  data.warnings.delete(userId);
  const user = ctx.message.reply_to_message.from;
  await ctx.reply(`Warnings reset for ${getUserMention(user)}`);
});

// ==================== GROUP SETTINGS ====================

// Set rules
bot.command("setrules", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const rules = ctx.message.text.split(" ").slice(1).join(" ");
  if (!rules) {
    return ctx.reply("Please provide rules! Usage: /setrules <rules>");
  }

  const data = getGroupData(ctx.chat.id);
  data.rules = rules;
  await ctx.reply("Group rules have been updated!");
});

// View rules
bot.command("rules", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const data = getGroupData(ctx.chat.id);
  await ctx.reply(`*Group Rules:*\n\n${data.rules}`, {
    parse_mode: "Markdown",
  });
});

// Set welcome message
bot.command("setwelcome", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const message = ctx.message.text.split(" ").slice(1).join(" ");
  if (!message) {
    return ctx.reply(
      "Please provide a welcome message! Use {user} for username.\nUsage: /setwelcome Welcome {user}!"
    );
  }

  const data = getGroupData(ctx.chat.id);
  data.welcomeMessage = message;
  await ctx.reply("Welcome message has been updated!");
});

// ==================== WORD FILTER ====================

// Add banned word
bot.command("addword", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const word = ctx.message.text.split(" ").slice(1).join(" ").toLowerCase();
  if (!word) {
    return ctx.reply("Please provide a word to ban! Usage: /addword <word>");
  }

  const data = getGroupData(ctx.chat.id);
  data.bannedWords.add(word);
  await ctx.reply(`Added "${word}" to banned words list!`);
});

// Remove banned word
bot.command("removeword", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("You need to be an admin to use this command!");
  }

  const word = ctx.message.text.split(" ").slice(1).join(" ").toLowerCase();
  if (!word) {
    return ctx.reply(
      "Please provide a word to remove! Usage: /removeword <word>"
    );
  }

  const data = getGroupData(ctx.chat.id);
  if (data.bannedWords.delete(word)) {
    await ctx.reply(`Removed "${word}" from banned words list!`);
  } else {
    await ctx.reply(`"${word}" is not in the banned words list!`);
  }
});

// List banned words
bot.command("listwords", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const data = getGroupData(ctx.chat.id);
  if (data.bannedWords.size === 0) {
    return ctx.reply("No banned words set!");
  }

  const words = Array.from(data.bannedWords).join(", ");
  await ctx.reply(`*Banned Words:*\n${words}`, { parse_mode: "Markdown" });
});

// Check messages for banned words
bot.on("text", async (ctx, next) => {
  if (ctx.chat.type === "private") {
    return next();
  }

  const data = getGroupData(ctx.chat.id);
  const messageText = ctx.message.text.toLowerCase();

  for (const word of data.bannedWords) {
    if (messageText.includes(word)) {
      const isUserAdmin = await isAdmin(ctx, ctx.from.id);
      if (!isUserAdmin) {
        try {
          await ctx.deleteMessage();
          await ctx.reply(
            `${getUserMention(ctx.from)}, your message contained a banned word!`
          );
        } catch (error) {
          console.error("Failed to delete message:", error);
        }
        return;
      }
    }
  }

  return next();
});

// ==================== UTILITY COMMANDS ====================

// Pin message
bot.command("pin", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  const messageId = ctx.message.reply_to_message?.message_id;
  if (!messageId) {
    return ctx.reply("Reply to a message to pin it!");
  }

  try {
    await ctx.telegram.pinChatMessage(ctx.chat.id, messageId);
    await ctx.reply("Message pinned!");
  } catch (error) {
    await ctx.reply("Failed to pin message. Make sure I have admin rights!");
  }
});

// Unpin message
bot.command("unpin", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command only works in groups!");
  }

  const isUserAdmin = await isAdmin(ctx, ctx.from.id);
  if (!isUserAdmin) {
    return ctx.reply("❌ You need to be an admin to use this command!");
  }

  try {
    await ctx.telegram.unpinChatMessage(ctx.chat.id);
    await ctx.reply("Message unpinned!");
  } catch (error) {
    await ctx.reply("Failed to unpin message.");
  }
});

// User info
bot.command("info", async (ctx) => {
  const user = ctx.message.reply_to_message?.from || ctx.from;
  const userId = user.id;

  let info = `*User Info*\n\n`;
  info += `Name: ${user.first_name}`;
  if (user.last_name) info += ` ${user.last_name}`;
  info += `\nID: \`${userId}\``;
  if (user.username) info += `\nUsername: @${user.username}`;

  if (ctx.chat.type !== "private") {
    const isUserAdmin = await isAdmin(ctx, userId);
    info += `\nStatus: ${isUserAdmin ? "Admin" : "Member"}`;

    const data = getGroupData(ctx.chat.id);
    const warnings = data.warnings.get(userId) || 0;
    info += `\nWarnings: ${warnings}/${data.maxWarnings}`;
  }

  await ctx.reply(info, { parse_mode: "Markdown" });
});

// ==================== ERROR HANDLING ====================

bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("An error occurred while processing your request.");
});

// ==================== START BOT ====================

console.log("Bot is starting...");
bot
  .launch()
  .then(async () => {
    console.log("Bot is running!");

    // Set bot commands for autocomplete menu
    await bot.telegram.setMyCommands([
      {
        command: "start",
        description: "Show bot information and all commands",
      },
      { command: "help", description: "Display help menu" },
      { command: "rules", description: "View group rules" },
      { command: "info", description: "Get user information" },
      { command: "warnings", description: "Check user warnings" },
      { command: "kick", description: "Kick a user (admin only)" },
      { command: "ban", description: "Ban a user (admin only)" },
      { command: "unban", description: "Unban a user (admin only)" },
      { command: "mute", description: "Mute a user (admin only)" },
      { command: "unmute", description: "Unmute a user (admin only)" },
      { command: "warn", description: "Warn a user (admin only)" },
      {
        command: "resetwarnings",
        description: "Reset user warnings (admin only)",
      },
      { command: "setrules", description: "Set group rules (admin only)" },
      {
        command: "setwelcome",
        description: "Set welcome message (admin only)",
      },
      { command: "addword", description: "Add banned word (admin only)" },
      { command: "removeword", description: "Remove banned word (admin only)" },
      { command: "listwords", description: "List banned words (admin only)" },
      { command: "pin", description: "Pin a message (admin only)" },
      { command: "unpin", description: "Unpin a message (admin only)" },
    ]);
    console.log("Commands registered!");
  })
  .catch((err) => console.error("Failed to start bot:", err));

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
