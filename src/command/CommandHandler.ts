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

import {Message} from "discord.js";
import {Command} from "./Command";
import {RateLimiter} from "../RateLimiter";
import {Config} from "../Config";

export class CommandHandler {
    private static _instance: CommandHandler;
    private map: Map<string, Command> = new Map<string, Command>();
    private ratelimit: RateLimiter = new RateLimiter(15000, 3); // 3 every 15 secs
    private prefix: string;

    static get instance() {
        return CommandHandler._instance;
    }

    register(cmd: Command): void {
        this.map.set(cmd.name, cmd);
    }

    registerManual(name: string, cmd: Command): void {
        this.map.set(name, cmd);
    }

    handle(msg: Message): void {
        if (!msg.content.startsWith(this.prefix) || msg.content.length < 2) return;
        if (!this.ratelimit.act(msg.author.id)) {
            if (this.ratelimit.shouldPrompt(msg.author.id))
                msg.reply("you're doing that too fast, please slow down!")
            return;

        }
        let args = msg.content.split(" ");
        let cmd: Command | undefined = this.map.get(args[0].substring(this.prefix.length));
        if (!(cmd instanceof Command)) return;

        let result: string = cmd.execute(msg, args.slice(1));
        if (result != "") msg.reply(result);
    }

    constructor() {
        CommandHandler._instance = this;
        this.prefix = Config.getString("prefix");
    }
}