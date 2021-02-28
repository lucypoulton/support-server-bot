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

import {AbstractDeveloperCommand} from "./AbstractDeveloperCommand";
import {Developer} from "../../developer/Developer";
import {DeveloperManager} from "../../developer/DeveloperManager";
import {ReactionHandler} from "../../ReactionHandler";

export class StatusCommand extends AbstractDeveloperCommand {
    private reactHandler: ReactionHandler;

    public get name() {
        return "status";
    }

    protected execChannelAction(dev: Developer, args: string[]): string {
        let message: string;
        if (args.length == 0) {
            dev.message = null;
            message = "Cleared status message";
        } else {
            dev.message = args.join(" ");
            message = `Set status message to "${dev.message}"`;
        }
        this.devMan.addOrUpdateDev(dev);
        this.reactHandler.regenMessage();
        return message;
    }

    public constructor(devMan: DeveloperManager, reactHandler: ReactionHandler) {
        super(devMan);
        this.reactHandler = reactHandler;
    }
}
