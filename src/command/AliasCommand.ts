import {Command} from "./Command";
import {Message, MessageEmbed} from "discord.js";
import {CommandHandler} from "./CommandHandler";
import fs from "fs/promises";
import {Developer} from "../developer/Developer";

export class AliasCommand extends Command {
    private aliases: Map<string, string> = new Map<string, string>();

    get name(): string {
        return "aliases";
    }

    execute(message: Message, args: string[]): string {
        let cmd: string = message.content.split(" ")[0].substring(1);
        if (cmd == "aliases") {
            let embed = new MessageEmbed()
                .setTitle("All Aliases");
            this.aliases.forEach((v, k) => embed.addField(k, v, true));
            message.channel.send(embed);
            return "";
        }
        message.channel.send(this.aliases.get(cmd) ?? "");
        return "";
    }

    constructor() {
        super();

        fs.open(process.env["ALIASES_FILE"] ?? "aliases.json", "r")
            .then((file) => {
                file.readFile()
                    .then(data => {
                        let json = JSON.parse(data.toString());
                        for (let value in json) {
                            this.aliases.set(value, json[value]);
                            CommandHandler.instance.registerManual(value, this);
                        }
                    })
                    .finally(() => file.close());
            })
            .catch();
    }
}