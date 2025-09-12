
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
 name: "font",
 version: "1.1.1",
 hasPermssion: 0,
 credits: "Islamick Cyber Chat", // **Don't change my stall code
 description: "Converts text into any Font",
 commandCategory: "Tools",
 usages: "<fontType> <input>",
 cooldowns: 5,
};

module.exports.run = async ({ event, api, args }) => {
 // Define the font maps for different font types
 const fontMaps = [
 {
 name: "a",
 map: {
 " ": " ",
 a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱",
 i: "𝓲", j: "𝓳", k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹", q: "𝓺",
 r: "𝓻", s: "𝓼", t: "𝓽", u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁", y: "𝔂", z: "𝔃",
 A: "𝓐", B: "𝓑", C: "𝓒", D: "𝓓", E: "𝓔", F: "𝓕", G: "𝓖", H: "𝓗",
 I: "𝓘", J: "𝓙", K: "𝓚", L: "𝓛", M: "𝓜", N: "𝓝", O: "𝓞", P: "𝓟", Q: "𝓠",
 R: "𝓡", S: "𝓢", T: "𝓣", U: "𝓤", V: "𝓥", W: "𝓦", X: "𝓧", Y: "𝓨", Z: "𝓩",
 },
 },
 {
 name: "b",
 map: {
 " ": " ",
 a: "𝕒", b: "𝕓", c: "𝕔", d: "𝕕", e: "𝕖", f: "𝕗", g: "𝕘", h: "𝕙",
 i: "𝕚", j: "𝕛", k: "𝕜", l: "𝕝", m: "𝕞", n: "𝕟", o: "𝕠", p: "𝕡", q: "𝕢",
 r: "𝕣", s: "𝕤", t: "𝕥", u: "𝕦", v: "𝕧", w: "𝕨", x: "𝕩", y: "𝕪", z: "𝕫",
 A: "𝔸", B: "𝔹", C: "ℂ", D: "𝔻", E: "𝔼", F: "𝔽", G: "𝔾", H: "ℍ",
 I: "𝕀", J: "𝕁", K: "𝕂", L: "𝕃", M: "𝕄", N: "ℕ", O: "𝕆", P: "ℙ", Q: "ℚ",
 R: "ℝ", S: "𝕊", T: "𝕋", U: "𝕌", V: "𝕍", W: "𝕎", X: "𝕏", Y: "𝕐", Z: "ℤ",
 0: "𝟘", 1: "𝟙", 2: "𝟚", 3: "𝟛", 4: "𝟜", 5: "𝟝", 6: "𝟞", 7: "𝟟", 8: "𝟠", 9: "𝟡",
 },
 },
 {
 name: "c",
 map: {
 " ": " ",
 a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵",
 i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾",
 r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
 A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛",
 I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤",
 R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
 },
 },
 {
 name: "d",
 map: {
 " ": " ",
 a: "𝑎", b: "𝑏", c: "𝑐", d: "𝑑", e: "𝑒", f: "𝑓", g: "𝑔", h: "𝒉",
 i: "𝒊", j: "𝒋", k: "𝒌", l: "𝒍", m: "𝒎", n: "𝒏", o: "𝒐", p: "𝒑", q: "𝒒",
 r: "𝒓", s: "𝒔", t: "𝒕", u: "𝒖", v: "𝒗", w: "𝒘", x: "𝒙", y: "𝒚", z: "𝒛",
 A: "𝑨", B: "𝑩", C: "𝑪", D: "𝑫", E: "𝑬", F: "𝑭", G: "𝑮", H: "𝑯",
 I: "𝑰", J: "𝑱", K: "𝑲", L: "𝑳", M: "𝑴", N: "𝑵", O: "𝑶", P: "𝑷", Q: "𝑸",
 R: "𝑹", S: "𝑺", T: "𝑻", U: "𝑼", V: "𝑽", W: "𝑾", X: "𝑿", Y: "𝒀", Z: "𝒁",
 },
 },
 {
 name: "i",
 map: {
 " ": " ",
 a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡",
 i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦", n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪",
 r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
 A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇",
 I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌", N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐",
 R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
 0: "𝟎", 1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗",
 },
 },
 ];

 if (args.length === 0) {
 return api.sendMessage(
 "•┄┅════❁🌺❁════┅┄•\n\nআসসালামু আলাইকুম-!!🖤💫\nইংলিশ Stylish Font ব্যবহার করার জন্য Font command ব্যবহার করেন উদাহরণ: font a assalamu alaikum\n\nFont list: a-i\n\n•┄┅════❁🌺❁════┅┄•",
 event.threadID,
 event.messageID
 );
 }

 if (args[0].toLowerCase() === "list") {
 const availableFontTypes = fontMaps.map((item) => item.name).join(", ");
 return api.sendMessage(
 `𝗙𝗼𝗻𝘁 𝗹𝗶𝘀𝘁: ${availableFontTypes}`,
 event.threadID,
 event.messageID
 );
 }

 const fontType = args.shift().toLowerCase();
 const inputText = args.join(" ");

 const fontMap = fontMaps.find((item) => item.name === fontType);

 if (!fontMap) {
 const availableFontTypes = fontMaps.map((item) => item.name).join(", ");
 return api.sendMessage(
 `Invalid font type '${fontType}'. Available font types: ${availableFontTypes}`,
 event.threadID,
 event.messageID
 );
 }

 const outputText = inputText
 .split("")
 .map((char) => fontMap.map[char] || char)
 .join("");

 const gifUrl = "https://i.imgur.com/4mFdoDc.jpeg";
 const cachePath = path.join(__dirname, "cache", "font.jpg");

 try {
 const response = await axios.get(gifUrl, { responseType: "arraybuffer" });
 fs.writeFileSync(cachePath, Buffer.from(response.data, "utf-8"));

 return api.sendMessage(
 {
 body: outputText,
 attachment: fs.createReadStream(cachePath),
 },
 event.threadID,
 () => fs.unlinkSync(cachePath),
 event.messageID
 );
 } catch (e) {
 return api.sendMessage(outputText, event.threadID, event.messageID);
 }
};