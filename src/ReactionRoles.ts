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
import {Client, Guild, GuildMember, MessageReaction, PartialUser, Role, TextChannel, User} from "discord.js";
import {DeveloperManager} from "./developer/DeveloperManager";
import {ChannelManager} from "./ChannelManager";
import {Developer} from "./developer/Developer";
import {Config} from "./Config";
import instantiate = WebAssembly.instantiate;
import {CommandHandler} from "./command/CommandHandler";

export class ReactionRoles {
    private reactionMessage: string = "";
    private bot: Client;
    // @ts-ignore
    private guild: Guild;
    private roleMap: Map<string, string> = new Map<string, string>();

    private handleTicketReaction(reaction: MessageReaction, user: User, roles: ReactionRoles): void {
        if (user.bot) return;
        let roleId: string | undefined = this.roleMap.get(reaction.emoji.toString());
        if (roleId != null) {
            let member: GuildMember | null = this.guild.member(user);
            assert.ok(member instanceof GuildMember);
            let role: Role | undefined = member.roles.cache.find(x => x.id == roleId);
            if (role instanceof Role) {
                member.roles.remove(roleId)
                    .then(
                        // @ts-ignore
                        _ => reaction.message.channel.send(
                            new Discord.MessageEmbed()
                                .setTitle("Role removed")
                                .setColor("#ff77ff")
                                // @ts-ignore
                                .setDescription(`You removed yourself from the role ${role.name}`))
                            .then(x => x.delete({timeout: 5000})));
            } else {
                this.guild.roles.fetch(roleId)
                    .then(roleFetched => {
                        assert.ok(roleFetched instanceof Role);
                        // @ts-ignore
                        member.roles.add(roleFetched)
                            .then(member => reaction.message.channel.send(
                                new Discord.MessageEmbed()
                                    .setTitle("Role given")
                                    .setColor("#ff77ff")
                                    .setDescription(`You were given the role ${roleFetched.name}`)
                            ))
                            .then(x => x.delete({timeout: 5000}));

                    });
            }
        }
        reaction.users.remove(user).catch(console.warn);
    }

    public async regenMessage() {
        let chan = await this.bot.channels.fetch(Config.getString("reactionRoleChannelId"))

        assert.ok(chan instanceof TextChannel);
        let hist = await chan.messages.fetch({limit: 50});
        for (let c of hist) {
            c[1].delete().catch(console.warn);
        }
        let description: String = "";
        this.roleMap.forEach((a, b) => {
            description += `React with ${b} for ${a}\n`;
        })
        let msg = await chan.send(new Discord.MessageEmbed()
            .setTitle("Reaction Roles")
            .setColor("#ff77ff")
            .setDescription(description)
        )
        this.reactionMessage = msg.id;
        this.roleMap.forEach((_, emoji) => msg.react(emoji));
        msg.createReactionCollector(x => true, {})
            .on("collect", (a, b) => this.handleTicketReaction(a, b, this));
    }

    constructor(bot
                    :
                    Discord.Client
    ) {
        this.bot = bot;
        // @ts-ignore
        let json: object = Config.config.data["reactionRoles"];
        for (let value in json) {
            if (!json.hasOwnProperty(value)) continue;
            // @ts-ignore
            this.roleMap.set(value, json[value]);
        }
        bot.guilds.fetch(Config.getString("guildId"))
            .then(g => {
                this.guild = g;
                this.regenMessage();
            });
    }
}