/*
 * Copyright (C) 2021 Lucy Poulton https://lucyy.me
 * This file is part of ticketbot.
 *
 * ticketbot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ticketbot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ticketbot.  If not, see <http://www.gnu.org/licenses/>.
 */

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