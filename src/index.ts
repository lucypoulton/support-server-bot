import * as Discord from "discord.js";
import * as dotenv from 'dotenv';
import {DeveloperManager} from "./developer/DeveloperManager";
import {ChannelManager} from "./ChannelManager";
import {ReactionHandler} from "./ReactionHandler";
import {CommandHandler} from "./command/CommandHandler";
import {CloseCommand} from "./command/channel/CloseCommand";
import {DeleteCommand} from "./command/channel/DeleteCommand";
import {AddUserCommand} from "./command/channel/AddUserCommand";
import {ReopenCommand} from "./command/channel/ReopenCommand";
import {StatusCommand} from "./command/developer/StatusCommand";
import {AliasCommand} from "./command/AliasCommand";

const client : Discord.Client = new Discord.Client();
const developerManager : DeveloperManager = new DeveloperManager();
let channelManager: ChannelManager;
let reactionHandler: ReactionHandler;
let commandHandler: CommandHandler;

client.on('ready', () => {
    // this will never happen, it's just to shut ts up
    if (client.user == null) return;

    console.log(`Logged in as ${client.user.tag}!\nCaching developers`);
    channelManager = new ChannelManager(client, developerManager);
    reactionHandler = new ReactionHandler(client, developerManager, channelManager);
    commandHandler = new CommandHandler();

    new CloseCommand(channelManager);
    new DeleteCommand(channelManager);
    new AddUserCommand(channelManager);
    new ReopenCommand(channelManager);

    new StatusCommand(developerManager, reactionHandler);



    new AliasCommand();

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