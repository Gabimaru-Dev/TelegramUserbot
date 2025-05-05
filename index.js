const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require("fs");

const apiId = "23824688"; // Replace with your actual API ID
const apiHash = "3d08115cb319531a527d12dda2ac4e6a"; // Replace with your actual API Hash

// Try load saved session
let savedSession = "";
if (fs.existsSync("session.txt")) {
  savedSession = fs.readFileSync("session.txt", "utf8").trim();
}
const stringSession = new StringSession(savedSession);

(async () => {
  const dave = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  if (!savedSession) {
    console.log("== First time login ==");

    await dave.start({
      phoneNumber: async () => await input.text("Enter your phone number: "),
      password: async () => await input.text("2FA password (if any): "),
      phoneCode: async () => await input.text("Enter the code you received: "),
      onError: (err) => console.log(err),
    });

    const session = dave.session.save();
    fs.writeFileSync("session.txt", session);
    console.log(">> Login success. Session saved to session.txt");
  } else {
    await dave.connect();
    console.log(">> Logged in using saved session!");
  }

  await dave.sendMessage("me", { message: "Userbot is online and listening!" });

  // Listen for all messages
  dave.addEventHandler(async (update) => {
    const msg = update.message;
    if (!msg || !msg.message) return;

    const text = msg.message;
    const sender = await msg.getSender();

    if (text.toLowerCase().startsWith(".active")) {
      await dave.sendMessage(msg.chatId, {
        message: `Yes boss! I dey active for this chat.`,
        replyTo: msg.id,
      });
    }
  }, "updates");
})();
console.log("User bot is running");