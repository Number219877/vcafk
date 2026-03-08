const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require("express");

const client = new Client({
  checkUpdate: false
});
const app = express();

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const GUILD_ID = process.env.GUILD_ID;

console.log("Starting bot...");
console.log("TOKEN:", TOKEN ? "Loaded" : "Missing");

let connection;

async function joinVC() {
    try {

        const channel = await client.channels.fetch(CHANNEL_ID);

        if (!channel) {
            console.log("Channel not found");
            return;
        }

        connection = joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: GUILD_ID,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true
        });

        console.log("Joined VC");

    } catch (err) {
        console.log("VC Join Error:", err);
    }
}

client.once("ready", async () => {

    console.log("Logged in as " + client.user.tag);

    await joinVC();

    setInterval(async () => {

        console.log("1 hour completed → leaving VC");

        try {
            if (connection) connection.destroy();
        } catch {}

        console.log("Waiting 1 minute before rejoining");

        setTimeout(async () => {
            await joinVC();
        }, 60000);

    }, 3600000);

});

client.login(TOKEN).catch(err => {
console.log("Login Error:", err);
});

app.get("/", (req,res)=>res.send("running"));

app.listen(process.env.PORT || 3000);
