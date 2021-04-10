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
import {Config} from "../Config";
import Discord from "discord.js";

const fetch = require("node-fetch");

export class BstatsCommmand extends Command {
    private idMap: Map<string, string> = new Map<string, string>();

    constructor() {
        super();

        // @ts-ignore
        let json: object = Config.config.data["bstats"]["plugins"];
        for (let value in json) {
            if (!json.hasOwnProperty(value)) continue;
            // @ts-ignore
            this.idMap.set(value, json[value]);
        }
    }

    static caps(input: string) : string {
        return input[0].toUpperCase() + input.substring(1).toLowerCase();
    }

    static async getChart(id: string, chart: string): Promise<string> {
        let chartData = await fetch(`https://bstats.org/api/v1/plugins/${id}/charts/${chart}/data`);
        let chartJson = await chartData.json();
        return chartJson[chartJson.length - 1][1];
    }

    static async getCharts(id: string): Promise<Map<string, string>> {
        let out: Map<string, string> = new Map<string, string>();
        let promises: Promise<string>[] = [];
        // @ts-ignore
        for (let chart of Config.config.data["bstats"]["charts"]) {
            let promise: Promise<string> = this.getChart(id, chart);
            promises.push(promise);
            promise.then(x => {
                if (x != "") out.set(BstatsCommmand.caps(chart), x)
            });
        }
        await Promise.all(promises);

        return out;
    }

    execute(message: Message, args: string[]): string {
        if (args.length != 1 || !this.idMap.has(args[0])) return "";
        let pluginId: string = <string>this.idMap.get(args[0])
        fetch(`https://bstats.org/api/v1/plugins/${pluginId}`)
            .then((result: Response) => result.json())
            .then((json: any) => {
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`${json["name"]} by ${json["owner"]["name"]}`);
                embed.setURL(`https://bstats.org/plugin/bukkit/${json["name"]}/${pluginId}`);
                BstatsCommmand.getCharts(pluginId)
                    .then((charts: Map<string, string>) => {
                        for (let chart of charts.keys()) {
                            embed.addField(chart, charts.get(chart), true)
                        }
                        message.channel.send(embed);
                    });
            })

        return "";
    }

    get name(): string {
        return "stats";
    }
}