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

import {DeveloperManager} from "./DeveloperManager";

export class Developer {

    // @ts-ignore
    private _id: string;
    // @ts-ignore
    private _displayName: string;
    // @ts-ignore
    private _emoji: string;
    private _ticketCounter: number = 0;

    private readonly _gitName: string | null = null;
    private _message: string | null = null;

    private _manager: DeveloperManager;

    get id(): string {
        return this._id;
    }

    get displayName(): string {
        return this._displayName;
    }

    get emoji(): string {
        return this._emoji;
    }

    set emoji(value : string) {
        this._emoji = value;
    }

    set displayName(value: string) {
        this._displayName = value;
    }

    get message(): string | null {
        return this._message;
    }

    set message(value: string | null) {
        this._message = value;
    }

    get gitName(): string {
        return this._gitName  ?? this.displayName;
    }

    get ticketCounter(): number {
        return this._ticketCounter;
    }

    incrementTicketCounter() : number
    {
        this._ticketCounter++;
        this._manager.addOrUpdateDev(this);
        return this._ticketCounter;
    }

    set ticketCounter(value: number) {
        this._ticketCounter = value;
        this._manager.addOrUpdateDev(this);
    }

    asObject(): object {
        return {
            "_id": this.id,
            "_displayName": this.displayName,
            "_emoji": this.emoji,
            "_gitName": this._gitName,
            "_message": this.message,
            "_ticketCounter": this.ticketCounter
        }
    };

    constructor(manager: DeveloperManager, data: object) {
        this._manager = manager;
        Object.assign(this, data);
    }
}