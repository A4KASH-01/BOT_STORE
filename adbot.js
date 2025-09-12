
module.exports.config = {
 name: "adbot",
 version: "1.0.3",
 hasPermssion: 0,
 credits: "Rebel Akash",
 description: "MADE BY Rebel Akash",
 commandCategory: "info",
 usages: "",
 cooldowns: 4,
 dependencies: {
 "request": "",
 "fs-extra": ""
 }
};

module.exports.run = async ({ api, event, args }) => {
 const fs = global.nodemodule["fs-extra"];
 const request = global.nodemodule["request"];
 const prefix = global.config.PREFIX;

 if (!args[0]) {
 return api.sendMessage(
 `You can use:\n\n${prefix}${this.config.name} user => your information\n${prefix}${this.config.name} user @[Tag] => friend's information\n${prefix}${this.config.name} box => group info\n${prefix}${this.config.name} admin => Admin info`,
 event.threadID,
 event.messageID
 );
 }

 // ========== USER INFO ==========
 if (args[0] === "user") {
 try {
 let id;

 if (!args[1]) {
 id = event.type === "message_reply" && event.messageReply ? event.messageReply.senderID : event.senderID;
 } else if (event.mentions && Object.keys(event.mentions).length > 0) {
 id = Object.keys(event.mentions)[0];
 } else {
 id = args[1];
 }

 let data = await api.getUserInfo(id);
 if (!data[id]) return api.sendMessage("Can't fetch user info.", event.threadID, event.messageID);

 const user = data[id];
 const gender = user.gender === 2 ? "Male" : user.gender === 1 ? "Female" : "Undefined";
 const isFriend = user.isFriend ? "Yes" : "No";

 const msg = `Name: ${user.name}\nProfile URL: ${user.profileUrl}\nUsername: ${user.vanity || "None"}\nUID: ${id}\nGender: ${gender}\nFriend with bot: ${isFriend}\nCredits: Rebel Akash`;

 const callback = () => api.sendMessage(
 { body: msg, attachment: fs.createReadStream(__dirname + "/cache/1.png") },
 event.threadID,
 () => fs.unlinkSync(__dirname + "/cache/1.png"),
 event.messageID
 );

 return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
 .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
 .on('close', callback);

 } catch (err) {
 return api.sendMessage("Error fetching user info.", event.threadID, event.messageID);
 }
 }

 // ========== ADMIN INFO ==========
 if (args[0] === "admin") {
 const msg = `ADMIN BOT\n[1] NAME: Rebel Akash\n[2] Facebook: https://www.facebook.com/xnxx21.com1\nThanks for using ${global.config.BOTNAME}\nCredits: Rebel Akash`;
 const callback = () => api.sendMessage(
 { body: msg, attachment: fs.createReadStream(__dirname + "/cache/1.png") },
 event.threadID,
 () => fs.unlinkSync(__dirname + "/cache/1.png")
 );
 return request(encodeURI("https://graph.facebook.com/61553634015672/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"))
 .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
 .on('close', callback);
 }

 // ========== BOX INFO ==========
 if (args[0] === "box") {
 try {
 const tid = args[1] || event.threadID;
 const threadInfo = await api.getThreadInfo(tid);

 const male = Object.values(threadInfo.userInfo || {}).filter(u => u.gender === "MALE").length;
 const female = Object.values(threadInfo.userInfo || {}).filter(u => u.gender === "FEMALE").length;
 const approval = threadInfo.approvalMode ? "Turn on" : "Turn off";

 const msg = `Group name: ${threadInfo.threadName}\nTID: ${tid}\nApproved: ${approval}\nEmoji: ${threadInfo.emoji}\nInformation:\n- ${threadInfo.participantIDs.length} members, ${threadInfo.adminIDs.length} admins\n- Including ${male} male and ${female} female\n- Total messages: ${threadInfo.messageCount}\nCredits: Rebel Akash`;

 if (!threadInfo.imageSrc) return api.sendMessage(msg, event.threadID, event.messageID);

 const callback = () => api.sendMessage(
 { body: msg, attachment: fs.createReadStream(__dirname + "/cache/1.png") },
 event.threadID,
 () => fs.unlinkSync(__dirname + "/cache/1.png"),
 event.messageID
 );
 return request(encodeURI(threadInfo.imageSrc)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', callback);
 } catch {
 return api.sendMessage("Can't fetch group info.", event.threadID, event.messageID);
 }
 }
};