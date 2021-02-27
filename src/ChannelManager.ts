import * as Discord from "discord.js";
import {Developer} from "./developer/Developer";

export class ChannelManager {
    private bot: Discord.Client;
    // @ts-ignore
    private guild: Discord.Guild;
    // @ts-ignore
    private channel: Discord.Channel;

    constructor(bot: Discord.Client) {
        this.bot = bot;
        bot.guilds.fetch(process.env["GUILD_ID"] ?? "")
            .then(x => this.guild = x);
        bot.channels.fetch(process.env["CATEGORY_ID"] ?? "")
            .then(x => this.channel = x);
    }

    public createChannel(developer: Developer, client: Discord.User): void {
        this.guild.channels.create(`${developer.displayName}-` + client.username,
            {
                parent: this.channel,
                permissionOverwrites: [
                    {
                        id: client.id,
                        allow: ['VIEW_CHANNEL'],
                    }
                ]
            })
            .then(ch => {
                ch.send(new Discord.MessageEmbed()
                    .setTitle("Ticket")
                    .setColor("#ff77ff")
                    .setDescription(client.toString() + ` Please describe your issue below.\n
                ${developer.message == null ? "" : `Please note that ${developer.displayName} is ${developer.message}.\n`}
                ||<@${developer.id.toString()}>||`
                    ));
            });
    }
}