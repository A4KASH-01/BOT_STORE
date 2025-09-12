const axios = require("axios");
const fs = require("fs");
const path = require("path");

const balanceFile = path.join(__dirname, "nix", "balance.json");

// Ensure balance file exists
function ensureBalanceFile() {
  if (!fs.existsSync(path.dirname(balanceFile))) {
    fs.mkdirSync(path.dirname(balanceFile), { recursive: true });
  }
  if (!fs.existsSync(balanceFile)) {
    fs.writeFileSync(balanceFile, JSON.stringify({}, null, 2));
  }
}

// Read balance
function readBalance() {
  ensureBalanceFile();
  return JSON.parse(fs.readFileSync(balanceFile, "utf8"));
}

// Save balance
function saveBalance(data) {
  fs.writeFileSync(balanceFile, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "quiz",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "ArYAN",
  description: "Play quiz game in Bangla or English",
  commandCategory: "game",
  usages: "[bn/en]",
  cooldowns: 0
};

async function getBaseUrl() {
  return "https://quiz2-nix.onrender.com";
}

// Run command
module.exports.run = async function ({ api, event, args, Users }) {
  const available = ["bangla", "english"];
  let category;

  if (!args[0]) category = available[Math.floor(Math.random() * available.length)];
  else {
    const input = args[0].toLowerCase();
    if (input === "bn" || input === "bangla") category = "bangla";
    else if (input === "en" || input === "english") category = "english";
    else return api.sendMessage(
      "❌ Invalid category\nAvailable: " + available.join(", "),
      event.threadID,
      event.messageID
    );
  }

  try {
    const r = await axios.get(`${await getBaseUrl()}/quiz?category=${category}&q=random`);
    const q = r.data.question;
    const { question, correctAnswer, options } = q;
    const { a: oA, b: oB, c: oC, d: oD } = options;
    const n = await Users.getNameUser(event.senderID);

    const m = `\n╭──✦ ${question}\n├‣ 𝐀• ${oA}\n├‣ 𝐁• ${oB}\n├‣ 𝐂• ${oC}\n├‣ 𝐃• ${oD}\n╰──────────────‣\nReply with your answer (A B C D)`;

    api.sendMessage(m, event.threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        type: "quiz",
        name: module.exports.config.name,
        author: event.senderID,
        messageID: info.messageID,
        correctAnswer,
        nameUser: n,
        attempts: 0
      });
    }, event.messageID);

  } catch (e) {
    console.error(e);
    api.sendMessage("⚠️ Failed to fetch quiz. Try again later.", event.threadID, event.messageID);
  }
};

// Handle reply
module.exports.handleReply = async function ({ api, event, handleReply, Users }) {
  const { correctAnswer: ca, author: u } = handleReply;
  if (event.senderID !== u) 
    return api.sendMessage("❌ Only the original player can answer this quiz.", event.threadID, event.messageID);

  const max = 2;
  const ans = event.body.trim().toLowerCase();

  if (handleReply.attempts >= max) {
    await api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`[⭕]➜ You reached the maximum attempts (${max}).\n✅ Correct answer: ${ca}`, event.threadID, event.messageID);
  }

  if (ans === ca.toLowerCase()) {
    await api.unsendMessage(handleReply.messageID).catch(() => {});
    const coins = 300, exp = 100;

    // Users data update
    const userData = await Users.getData(u);
    const updatedData = {
      ...userData,
      money: (userData.money || 0) + coins,
      exp: (userData.exp || 0) + exp
    };
    await Users.setData(u, updatedData);

    // Balance save with UID
    const balanceData = readBalance();
    if (!balanceData[u]) balanceData[u] = 0; // u = UID
    balanceData[u] += coins;
    saveBalance(balanceData);

    return api.sendMessage(
      `🎉 Congratulations 🎉\n👤 Name: ${await Users.getNameUser(u)}\n✅ Correct Answer!\n💰 Coins: +${coins}\n🌟 EXP: +${exp}`,
      event.threadID,
      event.messageID
    );
  } else {
    handleReply.attempts += 1;
    return api.sendMessage(`[❌]➜ Wrong answer. Attempts left: ${max - handleReply.attempts}`, event.threadID, event.messageID);
  }
};
