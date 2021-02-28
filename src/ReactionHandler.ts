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
import * as assert from "assert";
import {MessageReaction, PartialUser, TextChannel, User} from "discord.js";
import {DeveloperManager} from "./developer/DeveloperManager";
import {ChannelManager} from "./ChannelManager";
import {Developer} from "./developer/Developer";

export class ReactionHandler {
    private reactionMessage: string = "";
    private channelManager: ChannelManager;
    private devManager: DeveloperManager;
    private bot: Discord.Client;

    private handleTicketReaction(reaction: MessageReaction, user: User, manager: ReactionHandler): void {
        if (user.bot) return;
        let dev: Developer | undefined = manager.devManager.developers.find(dev => dev.emoji == reaction.emoji.toString());
        if (dev instanceof Developer) this.channelManager.createChannel(dev, user);
        reaction.users.remove(user).catch(console.warn);
    }

    public onReact(reaction: MessageReaction, user: User | PartialUser, channelManager: ChannelManager): void {
        if (!(user instanceof User) || user.bot || !channelManager.channels.includes(reaction.message.channel.id)) return;
        assert.ok(reaction.message.channel instanceof TextChannel);
        if (reaction.message.author.id != this.bot.user?.id) return;
        switch (reaction.emoji.name) {
            case "\ud83d\udd12": // closed padlock
                this.channelManager.closeTicket(reaction.message.channel);
                break;
            case "\ud83d\udd13": // open padlock
                this.channelManager.openTicket(reaction.message.channel);
                break;
            case "\ud83d\uddd1\ufe0f": // waste basket
                this.channelManager.deleteTicket(reaction.message.channel);
                break;
        }
        reaction.users.remove(user).catch(console.warn);
    }

    public regenMessage() {
        this.bot.channels.fetch(process.env["CHANNEL_ID"] ?? "")
            .then(x => {
                assert.ok(x instanceof TextChannel);
                x.messages.fetch({limit: 50}).then(hist => hist.forEach(c => c.delete()));
                let description: String = "";
                this.devManager.developers.forEach(dev => {
                    description += `React with ${dev.emoji} for ${dev.displayName} ` +
                        `${dev.message != null ? `(note: ${dev.displayName} is ${dev.message})` : ""}\n`
                })
                x.send(new Discord.MessageEmbed()
                    .setTitle("Open a Ticket")
                    .setColor("#ff77ff")
                    .setDescription(description)
                )
                    .then(msg => {
                        this.reactionMessage = msg.id;
                        this.devManager.developers.forEach(dev => msg.react(dev.emoji));
                        msg.createReactionCollector(x => true, {})
                            .on("collect", (a, b) => this.handleTicketReaction(a, b, this));
                    })
            });
    }

    constructor(bot: Discord.Client, devManager: DeveloperManager, channelManager: ChannelManager) {
        this.devManager = devManager;
        this.channelManager = channelManager;
        this.bot = bot;
        this.regenMessage();
        bot.on("messageReactionAdd", (a,b) => this.onReact(a, b, this.channelManager));
    }
}