"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const ConfigFile = require("./config");
const client = new Discord.Client();
client.on("ready", () => {
    console.log("Ready to boot!");
});
client.on("message", msg => {
    if (msg.author.bot) {
        return;
    }
    if (!msg.content.startsWith(ConfigFile.config.prefix)) {
        return;
    }
    msg.channel.send(`${msg.author.username} Just executed a command.`);
});
client.login(ConfigFile.config.token);
