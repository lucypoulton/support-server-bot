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
        let json: object = Config.config.data["bstatsPlugins"];
        for (let value in json) {
            if (!json.hasOwnProperty(value)) continue;
            // @ts-ignore
            this.idMap.set(value, json[value]);
        }
    }

    static transformData(input: string[][]): object[] {
        let out: object[] = [];
        for (let datum of input) out.push({
            "timestamp": datum[0],
            "value": datum[1]
        });
        return out;
    }

    static async getCharts(id: string): Promise<Map<string, string>> {
        let out: Map<string, string> = new Map<string, string>();
        let chartsRaw = await fetch(`https://bstats.org/api/v1/plugins/${id}/charts`);
        let charts = await chartsRaw.json();
        let serverCount: number = 0;
        for (let chart of Object.keys(charts)) {
            let chartData = await fetch(`https://bstats.org/api/v1/plugins/${id}/charts/${chart}/data`);
            let chartJson = await chartData.json();
            let chartName = charts[chart]["title"];
            if (chart == "servers") serverCount = chartJson[chartJson.length - 1][1];
            switch (charts[chart]["type"]) {
                case "single_linechart":
                    out.set(chartName, chartJson[chartJson.length - 1][1]);
                    break;
                case "simple_pie":
                    let output = "";
                    for (let datum of chartJson) output += `${((datum["y"] / serverCount) * 100).toFixed(2)}% ${datum["name"]}\n`
                    out.set(chartName, output);
                    break;
            }
        }

        return out;
    }

    execute(message: Message, args: string[]): string {
        if (args.length != 1 || !this.idMap.has(args[0])) return "";
        let pluginId: string = <string>this.idMap.get(args[0])
        fetch(`https://bstats.org/api/v1/plugins/${pluginId}`)
            .then((result: Response) => result.json())
            .then((json: any) => {
                const embed = new Discord.MessageEmbed();
                embed.setTitle(json["name"]);
                embed.setDescription(`by ${json["owner"]["name"]}`);
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