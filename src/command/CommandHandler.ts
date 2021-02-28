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

export class CommandHandler {
    private static _instance: CommandHandler;
    private map: Map<string, Command> = new Map<string, Command>();

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
        if (!msg.content.startsWith(process.env.PREFIX ?? "") || msg.content.length < 2) return;
        let args = msg.content.split(" ");
        let cmd: Command | undefined = this.map.get(args[0].substring(1));
        if (!(cmd instanceof Command)) return;

        let result : string = cmd.execute(msg, args.slice(1));
        if (result != "") msg.reply(result);
    }

    constructor() {
        CommandHandler._instance = this;
    }
}