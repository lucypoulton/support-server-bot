import * as Discord from "discord.js";
import * as dotenv from 'dotenv';
import {DeveloperManager} from "./developer/DeveloperManager";
import {ChannelManager} from "./ChannelManager";
import {ReactionManager} from "./ReactionManager";
import {CommandHandler} from "./command/CommandHandler";

const client : Discord.Client = new Discord.Client();
const manager : DeveloperManager = new DeveloperManager();
let channelManager: ChannelManager;
let reactionManager: ReactionManager;
let commandHandler: CommandHandler;

client.on('ready', () => {
    // this will never happen, it's just to shut ts up
    if (client.user == null) return;

    console.log(`Logged in as ${client.user.tag}!`);
    console.log(manager.developers);
    channelManager = new ChannelManager(client);
    reactionManager = new ReactionManager(client, manager, channelManager);
    commandHandler = new CommandHandler(client);

})

client.on("message", (message) => {
    commandHandler.handle(message);
})

function run() {
    console.log("Starting")
    dotenv.config();
    client.login(process.env["BOT_TOKEN"] ?? "")
        .then(() => { console.log("Login success")});
}

run();