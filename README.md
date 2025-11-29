# 🤖 Telegram Group Controller Bot

A powerful Telegram bot for managing groups with comprehensive moderation and administration features.

## Features

### 🛡️ Moderation Commands

- **Kick Users** - Remove users from the group temporarily
- **Ban/Unban Users** - Permanently ban or unban users
- **Mute/Unmute Users** - Restrict or restore user messaging permissions
- **Warning System** - Issue warnings with automatic ban after max warnings (default: 3)
- **Word Filter** - Automatically delete messages containing banned words

### 📋 Group Management

- **Custom Welcome Messages** - Greet new members with personalized messages
- **Group Rules** - Set and display group rules
- **Pin/Unpin Messages** - Manage pinned messages
- **User Information** - Get detailed info about users including warnings

### 🔧 Admin Features

- **Configurable Settings** - Customize welcome messages, rules, and more
- **Banned Words List** - Add, remove, and view banned words
- **Warnings Tracking** - Track and reset user warnings

## Installation

1. Clone or download this repository
2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Update the bot token in `index.js`:

   ```javascript
   const bot = new Telegraf("YOUR_BOT_TOKEN_HERE");
   ```

4. Run the bot:
   ```bash
   node index.js
   # or
   bun index.js
   ```

## Commands

### For All Users

| Command     | Description                                               |
| ----------- | --------------------------------------------------------- |
| `/start`    | Show bot information and command list                     |
| `/help`     | Display help menu                                         |
| `/rules`    | View group rules                                          |
| `/info`     | Get user information (reply to a user or use on yourself) |
| `/warnings` | Check warnings for yourself or another user               |

### For Admins Only

#### User Management

| Command   | Usage                   | Description                          |
| --------- | ----------------------- | ------------------------------------ |
| `/kick`   | Reply to user's message | Kick a user from the group           |
| `/ban`    | Reply to user's message | Ban a user permanently               |
| `/unban`  | Reply to user's message | Unban a previously banned user       |
| `/mute`   | Reply to user's message | Mute a user (remove all permissions) |
| `/unmute` | Reply to user's message | Unmute a user (restore permissions)  |

#### Warning System

| Command          | Usage                                     | Description                             |
| ---------------- | ----------------------------------------- | --------------------------------------- |
| `/warn`          | Reply to user's message + optional reason | Warn a user (auto-ban after 3 warnings) |
| `/resetwarnings` | Reply to user's message                   | Reset a user's warnings to 0            |

#### Group Settings

| Command       | Usage                         | Description                                     |
| ------------- | ----------------------------- | ----------------------------------------------- |
| `/setrules`   | `/setrules <rules text>`      | Set group rules                                 |
| `/setwelcome` | `/setwelcome Welcome {user}!` | Set welcome message (use `{user}` for username) |

#### Word Filter

| Command       | Usage                | Description                        |
| ------------- | -------------------- | ---------------------------------- |
| `/addword`    | `/addword <word>`    | Add a word to the banned list      |
| `/removeword` | `/removeword <word>` | Remove a word from the banned list |
| `/listwords`  | `/listwords`         | View all banned words              |

#### Utilities

| Command  | Usage              | Description                      |
| -------- | ------------------ | -------------------------------- |
| `/pin`   | Reply to a message | Pin a message                    |
| `/unpin` | `/unpin`           | Unpin the current pinned message |

## Usage Examples

### Setting Up Your Group

1. **Add the bot to your group** and make it an admin with these permissions:

   - Delete messages
   - Ban users
   - Restrict members
   - Pin messages
   - Invite users via link

2. **Set group rules:**

   ```
   /setrules
   1. Be respectful to all members
   2. No spam or advertising
   3. No offensive language
   4. Stay on topic
   ```

3. **Set a welcome message:**

   ```
   /setwelcome Welcome {user}! Please read /rules before chatting.
   ```

4. **Add banned words:**
   ```
   /addword spam
   /addword badword
   ```

### Moderating Users

**Warn a user:**

```
Reply to their message: /warn Spamming
```

**Mute a disruptive user:**

```
Reply to their message: /mute
```

**Ban a user:**

```
Reply to their message: /ban
```

**Check user info:**

```
Reply to their message: /info
```

## Configuration

The bot stores group-specific data in memory including:

- User warnings
- Banned words
- Welcome messages
- Group rules
- Maximum warnings before auto-ban (default: 3)

**Note:** Data is stored in memory and will be lost when the bot restarts. For persistent storage, you'll need to implement a database.

## Bot Permissions Required

Make sure the bot has these admin permissions in your group:

- ✅ Delete messages (for word filter)
- ✅ Ban users (for kick/ban commands)
- ✅ Restrict members (for mute command)
- ✅ Pin messages (for pin/unpin commands)
- ✅ Invite users via link

## Features in Detail

### Warning System

- Users can receive up to 3 warnings (configurable)
- After reaching max warnings, users are automatically banned
- Admins can reset warnings for users
- Warnings are tracked per group

### Word Filter

- Automatically deletes messages containing banned words
- Case-insensitive matching
- Admins are exempt from word filter
- Sends a notification when a message is deleted

### Welcome Messages

- Automatically greets new members
- Supports `{user}` placeholder for username/mention
- Customizable per group

## Troubleshooting

**Bot not responding:**

- Make sure the bot is running (`node index.js`)
- Check that the bot token is correct
- Verify the bot is an admin in the group

**Commands not working:**

- Ensure you're using commands in a group (not private chat)
- Verify you have admin permissions for admin commands
- Check that the bot has necessary admin permissions

**Word filter not working:**

- Confirm the bot has "Delete messages" permission
- Make sure words are added correctly with `/addword`

## Development

The bot is built with:

- **Node.js** - Runtime environment
- **Telegraf** - Telegram Bot Framework
- **ES Modules** - Modern JavaScript syntax

### File Structure

```
zmrush_bot/
├── index.js          # Main bot code
├── package.json      # Dependencies
├── README.md         # Documentation
└── node_modules/     # Dependencies
```

## Security Notes

⚠️ **Important:** Your bot token is currently hardcoded in `index.js`. For production use:

1. Move the token to an environment variable
2. Use a `.env` file with `dotenv` package
3. Never commit your bot token to version control

Example:

```javascript
import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
```

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review Telegram Bot API documentation
3. Check Telegraf documentation: https://telegraf.js.org/

---

**Made with ❤️ for better Telegram group management**
