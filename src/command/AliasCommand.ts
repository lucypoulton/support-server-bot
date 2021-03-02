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

import {Command} from "./Command";
import {Message, MessageEmbed} from "discord.js";
import {CommandHandler} from "./CommandHandler";
import fs from "fs/promises";
import {Developer} from "../developer/Developer";
import {Config} from "../Config";

export class AliasCommand extends Command {
    private aliases: Map<string, string> = new Map<string, string>();

    get name(): string {
        return "aliases";
    }

    execute(message: Message, args: string[]): string {
        let cmd: string = message.content.split(" ")[0].substring(Config.getString("prefix").length);
        if (cmd == "aliases") {
            let embed = new MessageEmbed()
                .setTitle("All Aliases");
            this.aliases.forEach((v, k) => embed.addField(k, v, true));
            message.channel.send(embed);
            return "";
        }
        message.channel.send(this.aliases.get(cmd) ?? "");
        return "";
    }

    constructor() {
        super();
        // @ts-ignore
        let json: object = Config.config.data["aliases"];
        for (let value in json) {
            if (!json.hasOwnProperty(value)) continue;
            // @ts-ignore
            this.aliases.set(value, json[value]);
            CommandHandler.instance.registerManual(value, this);
        }
    }
}