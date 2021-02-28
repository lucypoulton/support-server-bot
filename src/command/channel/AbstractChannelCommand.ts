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

import {Command} from "../Command";
import {Message, TextChannel} from "discord.js";
import {ChannelManager} from "../../ChannelManager";

export abstract class AbstractChannelCommand extends Command {
    protected channelMan: ChannelManager;
    protected abstract execChannelAction(channel: TextChannel, args?: string[]): void;

    execute(message: Message, args: string[]): string {
        if (!(message.channel instanceof TextChannel)) return "";
        let channel: string | undefined = this.channelMan.channels.find(chan => chan == message.channel.id);
        if (channel == undefined) {
            message.reply("this command can only be used in a ticket.")
                .then(x => x.delete({timeout: 5000}));
            return "";
        }
        this.execChannelAction(message.channel, args);
        return "";
    }

    constructor(channelMan: ChannelManager) {
        super();
        this.channelMan = channelMan;
    }

}