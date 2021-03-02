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

// Is this a stupid idea? Yes, yes it is.

import fs from "fs/promises";

export class Config {
    private static readonly _instance: Config = new Config();

    static get config() {
        return Config._instance;
    }

    static getString(key: string): string {
        // @ts-ignore
        let value: any = this.config.data[key];
        if (typeof value == "string") return value;
        return "";
    }

    public data: object = {};
    private readonly filePath: string = "config.json";

    public save(): void {
        fs.open(this.filePath, "w")
            .then((file) => {
                file.write(JSON.stringify(this.data));
            })
    }

    async init() {
        let file = await fs.open(this.filePath, "r")
        let data = await file.readFile()
        this.data = JSON.parse(data.toString());
        await file.close();
    }
}