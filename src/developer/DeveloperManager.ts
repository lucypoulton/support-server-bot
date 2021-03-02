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

import * as fs from "fs/promises";
import {Developer} from "./Developer";
import * as assert from "assert";

export class DeveloperManager {
    private _developers: Map<string, Developer> = new Map<string, Developer>();
    private readonly _dataPath: string = "data.json";

    private static arrayToJson(array: Developer[]): string {
        return JSON.stringify(array.map(d => d.asObject()));
    }

    private jsonToMap(jsonStr: string): Map<string, Developer> {
        let parsed: object = JSON.parse(jsonStr);
        assert.ok(Array.isArray(parsed));
        let ret : Map<string, Developer> = new Map<string, Developer>();
        for (let obj of parsed) {
            let dev : Developer = new Developer(this, obj);
            ret.set(dev.id, dev);
        }
        return ret;
    }

    public save(): void {
        fs.writeFile(this._dataPath, DeveloperManager.arrayToJson(this.developers));
    }

    public addOrUpdateDev(dev: Developer): void {
        this._developers.set(dev.id, dev);
        this.save();
    }

    get developers(): Developer[] {
        return Array.from(this._developers.values());
    }

    constructor() {
        fs.open(this._dataPath, "r")
            .then((file) => {
                file.readFile()
                    .then(data => {
                        this._developers = this.jsonToMap(data.toString());
                    })

                    .finally(() => file.close());
            })
            .catch(_ => {
                this._developers = new Map<string, Developer>();
                this.save();
            });
    }
}