const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require("express");

const client = new Client();
const app = express();

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

let connection;

async function joinVC() {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);

        connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true
        });

        console.log("Joined VC");

    } catch (err) {
        console.log("VC Join Error:", err);
    }
}

client.on("ready", async () => {

    console.log("Logged in as " + client.user.tag);

    await joinVC();

    // repeat every hour
    setInterval(async () => {

        console.log("1 hour completed → leaving VC");

        try {
            if (connection) connection.destroy();
        } catch {}

        console.log("Waiting 1 minute...");

        setTimeout(async () => {
            await joinVC();
        }, 60 * 1000);

    }, 60 * 60 * 1000);

});

client.login(TOKEN);

// keep render service alive
app.get("/", (req,res)=>res.send("running"));
app.listen(3000);
