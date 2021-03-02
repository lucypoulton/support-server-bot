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
import {Message} from "discord.js";
import {DeveloperManager} from "../../developer/DeveloperManager";
import {Developer} from "../../developer/Developer";
import {Config} from "../../Config";

export abstract class AbstractRepositoryCommand extends Command {
    protected devMan: DeveloperManager;

    protected abstract execChannelAction(repo: string, args?: string[]): string | null;

    execute(message: Message, args: string[]): string {
        if (args.length == 0) return "";

        let repoName: string;
        if (args[0].includes("/")) {
            repoName = args[0];
        } else {
            let dev: Developer | undefined = this.devMan.developers.find(d => d.id == message.author.id);
            if (dev == undefined) {
                message.reply("you are not an authorised developer, please specify a developer i.e. Lucy/ProNouns")
                    .then(x => x.delete({timeout: 5000}));
                return "";
            }
            repoName = dev.gitName + "/" + args[0];
        }

        let result = this.execChannelAction(repoName, args) ?? "";
        if (result != "") message.channel.send(Config.getString("gitRepository") + result);
        return "";
    }

    constructor(devMan: DeveloperManager) {
        super();
        this.devMan = devMan;
    }
}

