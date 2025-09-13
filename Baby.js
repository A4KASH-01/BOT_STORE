const axios = require('axios');

const baseApiUrl = async () => {
 const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
 return base.data.api;
};

module.exports.config = {
 name: "baby",
 version: "6.9.9",
 credits: "dipto",
 cooldowns: 0,
 hasPermssion: 0,
 description: "better than all sim simi",
 commandCategory: "chat",
 category: "chat",
 usePrefix: true,
 prefix: true,
 usages: `[anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR\nall OR\nedit [YourMessage] - [NewMessage]`,
};

module.exports.run = async function ({ api, event, args, Users }) {
 try {
 const link = `${await baseApiUrl()}/baby`;
 const dipto = args.join(" ").toLowerCase();
 const uid = event.senderID;

 if (!args[0]) {
 const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
 const r = ran[Math.floor(Math.random() * ran.length)];
 return api.sendMessage(r, event.threadID, event.messageID);
 }

 if (args[0] === 'remove') {
 const fina = dipto.replace("remove ", "");
 const respons = await axios.get(`${link}?remove=${fina}&senderID=${uid}`);
 return api.sendMessage(respons.data.message, event.threadID, event.messageID);
 }

 if (args[0] === 'rm' && dipto.includes('-')) {
 const [fi, f] = dipto.replace("rm ", "").split(' - ');
 const respons = await axios.get(`${link}?remove=${fi}&index=${f}`);
 return api.sendMessage(respons.data.message, event.threadID, event.messageID);
 }

 if (args[0] === 'list') {
 if (args[1] === 'all') {
 const res = await axios.get(`${link}?list=all`);
 const data = res.data.teacher.teacherList;
 const teachers = await Promise.all(data.map(async (item) => {
 const number = Object.keys(item)[0];
 const value = item[number];
 const name = await Users.getName(number) || "unknown";
 return { name, value };
 }));
 teachers.sort((a, b) => b.value - a.value);
 const output = teachers.map((teacher, index) => `${index + 1}/ ${teacher.name}: ${teacher.value}`).join('\n');
 return api.sendMessage(`Total Teach = ${res.data.length}\n\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
 } else {
 const respo = await axios.get(`${link}?list=all`);
 return api.sendMessage(`Total Teach = ${respo.data.length}`, event.threadID, event.messageID);
 }
 }

 if (args[0] === 'msg' || args[0] === 'message') {
 const fuk = dipto.replace("msg ", "");
 const respo = await axios.get(`${link}?list=${fuk}`);
 return api.sendMessage(`Message ${fuk} = ${respo.data.data}`, event.threadID, event.messageID);
 }

 if (args[0] === 'edit') {
 const command = dipto.split(' - ')[1];
 if (command.length < 2) {
 return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
 }
 const res = await axios.get(`${link}?edit=${args[1]}&replace=${command}`);
 return api.sendMessage(`changed ${res.data.message}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
 const [comd, command] = dipto.split(' - ');
 const final = comd.replace("teach ", "");
 if (command.length < 2) {
 return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
 }
 const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
 const name = await Users.getName(re.data.teacher) || "";
 return api.sendMessage(`✅ Replies added ${re.data.message}\nTeacher: ${name || "unknown"}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] === 'amar') {
 const [comd, command] = dipto.split(' - ');
 const final = comd.replace("teach ", "");
 if (command.length < 2) {
 return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
 }
 const re = await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`);
 return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] === 'react') {
 const [comd, command] = dipto.split(' - ');
 const final = comd.replace("teach react ", "");
 if (command.length < 2) {
 return api.sendMessage('❌ | Invalid format! Use [teach] [YourMessage] - [Reply1], [Reply2], [Reply3]... OR [teach] [react] [YourMessage] - [react1], [react2], [react3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
 }
 const re = await axios.get(`${link}?teach=${final}&react=${command}`);
 return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);
 }

 if (['amar name ki', 'amr nam ki', 'amar nam ki', 'amr name ki'].some(phrase => dipto.includes(phrase))) {
 const response = await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`);
 return api.sendMessage(response.data.reply, event.threadID, event.messageID);
 }

 const a = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
 return api.sendMessage(a, event.threadID,
 (error, info) => {
 global.client.handleReply.push({
 name: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 lnk: a,
 apiUrl: link
 });
 }, event.messageID);

 } catch (e) {
 console.error('Error in command execution:', e);
 return api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
try{
 if (event.type == "message_reply") {
 const reply = event.body.toLowerCase();
 if (isNaN(reply)) {
 const b = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(reply)}&senderID=${event.senderID}&font=1`)).data.reply;
 await api.sendMessage(b, event.threadID, (error, info) => {
 global.client.handleReply.push({
 name: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 lnk: b
 });
 }, event.messageID,
 )}}
}catch(err){
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
}};

 
module.exports.handleEvent = async function ({ api, event }) {
try{
 const body = event.body ? event.body.toLowerCase() : ""
 if(body.startsWith("baby") || body.startsWith("bby") || body.startsWith("/bot")){
 const arr = body.replace(/^\S+\s*/, "")
 if(!arr) {
 await api.sendMessage("᛫──⃜͢͢🍒͟͟͞͞๛⃝আ্ঁজ্ঁ এ্ঁক্ঁটা্ঁ বা্ঁবু্ঁর্ঁ আ্ঁম্মুঁ নে্ঁই্ঁ ব্ঁলে্ঁ≛⃝|🐸😇😫","🐰বৃষ্টি হলেই -🌧️একটা বউ এর অভাব Feel করি-!!👨🥺","তুমি আমার জান❤️🫣\nহাপানি রোগের টান🤧🥴\nআস্ত মুরগির রান🐤🍗\nবাংলা সিনেমার গান🎵🎶\nআমার জমির ধান🌾\nআই লাভ ইউ জান❤️😜","-Dear শশুর আব্বা.........🥰😌\nGive me your ছেরি....... 😚☺️\nI will give you ডর্জন খানিক নাতিপুতি 😁😁","༆⛄ আমাকে inbox করে 💥জিতে নাও ☺🙈\n😎কচি একটা bf ° ᭄⎝⎝⚒\n🐻!!-🐸!!-🐸","🦋_____ Dear প্রিয়-- 😍 ----তুমি কার আকাশে\nউড়ো______🌺😤😼\n🌸____ দোয়া করি ঐ আকাশে_____🙂💔 🌺____ ঠাডা পইরা মরো ______💔😼😤","—•—ঐ চাঁদ_ও হার মানে\n—তোমার রূপের কাছে 💝😘","°- বেডি মানুষ বড় ভেজাইল্লা🤧🔪°","রাগের মাথায় কেউ girlfriend-বিক্রি করলে জানাবেন🐸","আজকে গরিব দেইখা কোন মেয়ের উপর Crush খাইতে পারিনা.. 😭😭","-💬\nতুমি বাঁশ দিবা❞ \nআগে বললেই পারতা...❞\nআমি ট্রাক পাঠিয়ে দিতাম-🐸\n-💬","-ছোটবেলায় ভাবতাম বাসর ঘর🙄 -মানে বাঁশ দিয়ে তৈরি ঘর🏡🤣","-  i Wish, কোনো এক দুপুরে, তুমি আমি পাশাপাশি বসে, চাঁদ দেখবো.!🙂","কালো রং পছন্দ করা মানুষটাও..💚🥀.একদিন সাদা কাপড় পড়ে‒‘ঘুমাবে’..😥💔","😎༊༉’খাট ভাঙ্গার কথা দিয়া🙂\n ༆༉࿐ মন ভেঙ্গে চলে গেলি 🙂\n ༆༉࿐তোর যৌবনে  কুত্তা কামড় দিবো🌸🖤","•🐰🍒___একটা মন দাও, ছিনিমিনি খেলবো🥺😚👉👈🐸•","⎯⃝🌼-চরিত্র যতটা পবিত্র_ব্যক্তিত্ব ততটাই সুন্দর⎯͢♡🖤  ","—বেডী মানুষের মন অনেক বড়১৩২ জিবি র‍্যাম-|♡(🙂🤝🏻.)  ","একটা ভাঙা’চুরা 𝐠𝐟 চাই….! 🥺🫶 ","কখনও মেয়েদের সাথে ইনবক্সে কথা বলি নাই _!! 🙂🙂 ","যার মনে আমি নাই🍒তার মনে কুত্তায় মুইতা দিক..!!😏🐸🍒  ","জামাই ছাড়া👳এতিম মেয়ে গুলা কোথায়🍁তোমরা সারা দাও..!!🤭🥴  ","মা হিসাবে সব নারী”ই ‘সেরা.!-🩷🪽 ","^নক না দিলে আইডি খুলছস ক্যান°!😾ননসেন্স বেডি..!🥲🥀  ","-শূন্য বিকেলে পূর্ন তুমি!🥰-তোমার হাসিতে মুগ্ধ আমি.😇  ","-যারে দেহি তারেই ভাল্লাগে..!🙈-মনে হয় রুচি বাড়ছে..!😀😋  ","ভুলে যাও Ex কে নক দাও আমাকে 😌🌚  ","_.!একদিন সব হবে ইনশাআল্লাহ.!>3🩷✨🤍🫶🏼>3🥰💜🌻  ","_পাওয়ার চেয়ে ধরে রাখা কঠিন-//🩷🪽 ","আমায় বিয়া করবানি🤤🐰  ","-যেহেতু তুমি সিঙ্গেল তাই./🙂মানবতার খাতিরে 𝗜 𝗟𝗼𝘃𝗲 𝗬𝗼𝘂./🙂👀","অর্ধেক খাট, অর্ধেক কম্বলভাড়া দেওয়া হবে🙂  ","বিরক্তিকর পৃথিবী ছেড়ে মঙ্গলে যেতে চাই। ","__ মন মেজাজ ঠিক নাই I love You🥺🐸  ","_রিলেশনে’র বাজারে আমি এক 𝐒𝐢𝐧𝐠𝐥𝐞 শিশু😳😕  ","𝗜 𝗟𝗼𝘃𝗲 𝗬𝗼𝘂 😻🙈Ummmmma😘😘 ৬ তানি করলাম 🐸🤣  ","সবাই প্রেমে পড়ে🥰আর মুই স্বপ্নে খাট থেকে পড়ি🤧  ","••••🤤খাট ভাঙ্গার শব্দ কেমন🤤••• ","★মন ডা খালি বেডি বেডি করে_//🥺💔★🤪🤪🤪  ","(🤰)-এই বেডির সর্বনাশ কে করলো_🙂  ","_ক..আমি তোর🫵 কী লাগি!> 🔪 😡","জামাই ডাকো আইডি ঘুরে আসবো!🥺🫶  ","কি জিগাবি জিগা? সব মি’ছা কথা কমু!🙂 ","Unmarried আছি, knock দিতে পারো!😒  ","প্রপোজ করতে পারো, আমিও তোমাকে পছন্দ করি! 😒  ","দিন শেষে একটা বউ নাই! 🥺😔  ","oii আসো ঝগরা করি জিতলে তুমি আমার হারলে আমি তোমার  ","কিসের পড়ালেখা, মাথা নষ্ট; লাগা বিয়া 🥹  ","-ডাক্তার বলছে প্রেমের প্রস্তাব না পেলে আমি নাকি বাঁচবো না🥺","𝐈 𝐋𝐨𝐯𝐞 𝐘𝐨𝐮 ইগনোর করিস না তুই পড়ছোস মানে তোরেই বলছি!","আমারে যে পাবে তার প্রতিদিন ই বিজয় দিবস। 😌","মন যেখানে পরিষ্কার গোসল করা সেখানে বিলাসিতা।","একটা বান্ধবীও নাই যারে রেস্টুরেন্টে নিয়ে গিয়ে ভালো মন্দ খাওয়াবো!:)😔","যদি 𝙆𝙖𝙧𝙊 সাথে খারাপ আচরণ করে থাকি তাহলে ✃𝙞 𝙇𝙤𝙫𝙀 𝙮𝙤𝙐🥺","এক ভুল আমি ২বার করিনা। ৮/১০বার করি!","তেলাপোকার মতো GF লাগবে জুতার বাড়ি মারলেও যেন উড়ে এসে জরিয়ে ধরে!🙂","কালো মানুষ ছবিতেই সুন্দর 🥰☺️🤍","আমার বস সাগর তোমাকে ভালোবাসে 😇 ", event.threadID, (error, info) => {
 global.client.handleReply.push({
 name: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID
 });
 }, event.messageID,
 )
 }
 const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply; 
 await api.sendMessage(a, event.threadID, (error, info) => {
 global.client.handleReply.push({
 name: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 lnk: a
 });
 }, event.messageID,
 )}
}catch(err){
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
}};