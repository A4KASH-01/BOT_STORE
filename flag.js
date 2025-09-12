
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// File paths
const balancePath = path.join(__dirname, "nix/balance.json");
const winsPath = path.join(__dirname, "nix/flagWins.json");

// Ensure files exist
if (!fs.existsSync(balancePath)) fs.writeFileSync(balancePath, "{}");
if (!fs.existsSync(winsPath)) fs.writeFileSync(winsPath, "{}");

// Read/write helpers
function readJSON(filePath) {
 try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
 catch { return {}; }
}
function writeJSON(filePath, data) {
 fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Reward function
function rewardUser(uid, amount) {
 const balance = readJSON(balancePath);
 if (!balance[uid]) balance[uid] = 0;
 balance[uid] += amount;
 writeJSON(balancePath, balance);
 return balance[uid];
}

// Record win
function recordWin(uid) {
 const wins = readJSON(winsPath);
 if (!wins[uid]) wins[uid] = 0;
 wins[uid] += 1;
 writeJSON(winsPath, wins);
 return wins[uid];
}

// ===== Flag Game =====
module.exports.config = {
 name: "flag",
 version: "1.0.3",
 credits: "Akash _Vau",
 hasPermission: 0,
 cooldowns: 0,
 description: "Guess the flag name",
 commandCategory: "game",
};

module.exports.handleReply = async function ({ api, event, handleReply, Users }) {
 const { country, attempts, messageID: replyMessageID, author } = handleReply;
 const maxAttempts = 5;
 if (event.senderID != author) return;

 const answer = event.body.toLowerCase();

 if (attempts >= maxAttempts) {
 await api.unsendMessage(replyMessageID);
 return api.sendMessage(
 `🚫 Max attempts reached!\n✅ Correct answer: ${country}`,
 event.threadID,
 event.messageID
 );
 }

 if (answer === country.toLowerCase()) {
 await api.unsendMessage(replyMessageID);

 const prize = 300; // prize updated to 300
 const newBalance = rewardUser(event.senderID, prize);
 const totalWins = recordWin(event.senderID);

 await api.sendMessage(
 `✅ Correct!\n💰 Prize: ${prize}$\n💵 New Balance: ${newBalance}$\n🏆 Total Wins: ${totalWins}`,
 event.threadID,
 event.messageID
 );

 global.client.handleReply = global.client.handleReply.filter(h => h.messageID !== replyMessageID);
 } else {
 handleReply.attempts += 1;
 api.sendMessage(
 `❌ Wrong answer. Attempts left: ${maxAttempts - handleReply.attempts}`,
 event.threadID,
 event.messageID
 );
 }
};

module.exports.run = async function ({ api, args, event }) {
 try {
 const n = "https://flag-nix.vercel.app";
 const res = await axios.get(`${n}/flagGame?type=random`);
 const { country, image } = res.data;
 const imagePath = path.join(__dirname, `${country}.png`);
 const imageStream = await axios.get(image, { responseType: "stream" });

 imageStream.data.pipe(fs.createWriteStream(imagePath)).on("finish", async () => {
 await api.sendMessage(
 { body: "🌍 Guess this flag name:", attachment: fs.createReadStream(imagePath) },
 event.threadID,
 (err, info) => {
 if (err) return api.sendMessage("❌ Error sending image.", event.threadID);
 global.client.handleReply.push({
 name: module.exports.config.name,
 author: event.senderID,
 messageID: info.messageID,
 country,
 attempts: 0,
 });
 fs.unlink(imagePath, () => {});
 },
 event.messageID
 );
 });
 } catch (err) {
 console.error(err);
 return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
 }
};