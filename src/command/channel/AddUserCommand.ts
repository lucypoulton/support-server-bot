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

import {TextChannel} from "discord.js";
import {AbstractChannelCommand} from "./AbstractChannelCommand";
import Discord from "discord.js";

export class AddUserCommand extends AbstractChannelCommand {
    public get name() {
        return "adduser";
    }

    protected execChannelAction(channel: TextChannel, args: string[]): void {
        if (args.length == 0) return;
        channel.guild.members.fetch({query: args[0]}).then(
            usr => {
                if (usr.size == 0) {
                    channel.send(
                        new Discord.MessageEmbed()
                            .setTitle("Failed")
                            .setColor("#ff77ff")
                            .setDescription(`Failed to find a user matching the name "${args[0]}".`)
                    );
                    return;
                }
                this.channelMan.addToTicket(channel, usr.keyArray()[0]);
            }
        );
    }
}