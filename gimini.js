const axios = require("axios");

const Akash = "Akash Mahmud";

module.exports.config = {
 name: "gemini",
 version: "6.0.0",
 hasPermssion: 0,
 credits: Akash,
 description: "Gemini API command + reply trigger",
 usages: ".gemini <prompt> or reply to gemini message",
 cooldowns: 3,
 commandCategory: "AI"
};

module.exports.run = async function ({ api, event, args }) {
 const { threadID, messageID } = event;
 if (module.exports.config.credits !== Akash) return api.sendMessage("**Matherfuker**", threadID, messageID);
 const akashPrompt = args && args.length ? args.join(" ") : "";
 if (!akashPrompt.trim()) return api.sendMessage("**Usage: .gemini <prompt>**", threadID, messageID);
 try { if (api.setMessageReaction) await api.setMessageReaction("✅", messageID, () => {}, true); } catch {}
 return akashCall(api, event, akashPrompt);
};

module.exports.handleEvent = async function ({ api, event }) {
 try {
 if (module.exports.config.credits !== Akash) return api.sendMessage("**Matherfuker**", event.threadID, event.messageID);
 if (event.type === "message_reply") {
 const akashMsg = event.body ? event.body.trim() : "";
 if (!akashMsg) return;
 if (event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) {
 try { if (api.setMessageReaction) await api.setMessageReaction("✅", event.messageID, () => {}, true); } catch {}
 return akashCall(api, event, akashMsg);
 }
 }
 } catch {}
};

async function akashCall(api, akashEvent, akashPrompt) {
 const { threadID, messageID } = akashEvent;
 try { if (api.sendTypingIndicator) api.sendTypingIndicator(threadID); } catch {}
 const akasHUrl = "https://apis-toop.vercel.app/aryan/gemini";
 try {
 const akashResp = await axios.get(akasHUrl, { params: { prompt: akashPrompt }, timeout: 20000 });
 let akashReply = "";
 if (akashResp.data && akashResp.data.response) akashReply = akashResp.data.response;
 else if (typeof akashResp.data === "string") akashReply = akashResp.data;
 else akashReply = "API response invalid.";
 return api.sendMessage("**" + akashReply + "**", threadID, messageID);
 } catch (err) { return api.sendMessage("**Error: " + (err.message || err) + "**", threadID); }
}