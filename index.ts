import * as Discord from "discord.js";
import * as ConfigFile from "./config";
import { IBotCommand } from "./api";

const client: Discord.Client = new Discord.Client();

let commands: IBotCommand[] = [];

loadCommands(`${__dirname}/commands`)

client.on("ready", () => {

     // Let us know that the bot is online
     console.log("Ready to boot!");
})

client.on("message", msg => {

    //Ignore the message if it was sent by the bot
    if(msg.author.bot) { return; }

    //Ignore messages that don't start with the prefix
    if (!msg.content.startsWith(ConfigFile.config.prefix)) { return; }

    //Handle the command
    handleCommand(msg);
})

async function handleCommand(msg: Discord.Message) {

    //Split the string into the command and all of the args
    let command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "");
    let args = msg.content.split(" ").slice(1);

    //Loop through all of our loaded commands
    for(const commandClass of commands){

        //Attempt to execute code but ready in case of a possible error
        try{

            //Check if our command class is the correct one
            if(!commandClass.isThisCommand(command)){

                //Go next to the next iteration of the loop if this isn't the correct command class
                continue;
            }

            //Pause execution whilst we run the command's code
            await commandClass.runCommand(args, msg, client);

        }
        catch(exception){

            //If there is an error, then log the exception
            console.log(exception);
        }
    }
}

function loadCommands(commandsPath: string) {

    //Exit if there are no commands
    if (!ConfigFile.config || (ConfigFile.config.commands as string []).length === 0) { return ;}

    //Loop through all the commands in our config file
    for(const commandName of ConfigFile.config.commands as string []) {

        const commandsClass = require(`${commandsPath}/${commandName}`).default;

        const command = new commandsClass() as IBotCommand;

        commands.push(command);
    }
}

client.login(ConfigFile.config.token);