const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require("express");

const client = new Client();
const app = express();

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const GUILD_ID = process.env.GUILD_ID;

let connection = null;

async function joinVC() {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);

        connection = joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: GUILD_ID,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true
        });

        console.log("Joined voice channel");
    } catch (err) {
        console.log("Join error:", err);
    }
}

client.on("ready", async () => {
    console.log("Logged in as " + client.user.tag);

    await joinVC();

    // Reconnect every 1 hour
    setInterval(async () => {
        console.log("Reconnecting to VC...");

        try {
            if (connection) {
                connection.destroy();
            }
        } catch {}

        await joinVC();

    }, 60 * 60 * 1000);
});

client.login(TOKEN);

app.get("/", (req,res)=>res.send("running"));
app.listen(3000);
