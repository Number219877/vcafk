const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require("express");

const client = new Client();
const app = express();

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const GUILD_ID = process.env.GUILD_ID;

client.on("ready", async () => {

    console.log("Logged in as " + client.user.tag);

    const channel = await client.channels.fetch(CHANNEL_ID);

    joinVoiceChannel({
        channelId: CHANNEL_ID,
        guildId: GUILD_ID,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
    });

    console.log("Joined VC");
});

client.login(TOKEN);

app.get("/", (req,res)=>res.send("running"));

app.listen(3000);
