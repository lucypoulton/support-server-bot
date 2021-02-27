import * as fs from "fs/promises";
import {Developer} from "./Developer";
import * as assert from "assert";

export class DeveloperManager {
    private _developers: Map<string, Developer> = new Map<string, Developer>();
    private readonly _dataPath: string;

    private static mapToJson(map: Map<string, Developer>): string {
        return JSON.stringify(Object.values(map).map(d => d.asObject()));
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
        fs.writeFile(this._dataPath, DeveloperManager.mapToJson(this._developers));
    }

    public addOrUpdateDev(dev: Developer): void {
        this._developers.set(dev.gitName, dev);
        this.save();
    }

    get developers(): Developer[] {
        return Array.from(this._developers.values());
    }

    constructor() {
        this._dataPath = process.env["DATAFILE"] ?? "data.json"
        fs.open(this._dataPath, "r")
            .then((file) => {
                file.readFile()
                    .then(data => {
                        this._developers = this.jsonToMap(data.toString())
                    })

                    .finally(() => file.close());
            })
            .catch(_ => {
                this._developers = new Map<string, Developer>();
                this.save();
            });
    }
}