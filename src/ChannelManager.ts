import * as Discord from "discord.js";
import {Developer} from "./developer/Developer";
import fs from "fs/promises";
import {Channel, TextChannel, User} from "discord.js";
import * as assert from "assert";
import {DeveloperManager} from "./developer/DeveloperManager";

export class ChannelManager {
    private bot: Discord.Client;
    // @ts-ignore
    private guild: Discord.Guild;
    // @ts-ignore
    private channel: Discord.Channel;

    private _channels: string[] = [];
    get channels(): string[] {
        return this._channels;
    }

    private readonly channelsPath: string;

    private createPerms(ids: string[], perms: { allow?: string[], deny?: string[] }) {
        let ret: Discord.OverwriteResolvable[] = [];
        ret.push({id: this.guild.roles.everyone.id, deny: ['VIEW_CHANNEL']});
        ids.forEach(id => {
            // @ts-ignore
            ret.push(Object.assign({id: id}, perms));
        })
        return ret;
    }

    private usersFromChannel(chan: TextChannel): string[] {
        return chan.permissionOverwrites.keyArray().filter(x => x != this.guild.roles.everyone.id);
    }

    private save(): void {
        fs.writeFile(this.channelsPath, JSON.stringify(this._channels)).catch(console.warn);
    }

    async init(bot: Discord.Client, devs: DeveloperManager): Promise<void> {
        let file = await fs.open(this.channelsPath, "r")
        let data = await file.readFile()
        this._channels = JSON.parse(data.toString());
        assert.ok(Array.isArray(this._channels));

        console.log("Caching developers");
        for (let dev of devs.developers) {
            await this.guild.members.fetch(dev.id);
            console.log(`Cached developer ${dev.id}`);
        }
        console.log("Caching channels");
        for (let channel of this._channels) {
            try {
                let chan = await bot.channels.fetch(channel);
                if (!(chan instanceof TextChannel)) throw("not a text channel");
                await chan.messages.fetch({"limit": 100})
                console.log(`Cached channel ${chan.id}`);
            } catch (_) {
                this._channels.splice(this._channels.indexOf(channel), 1);
                console.log(`Removed orphaned channel ${channel}`);
            }
        }
        this.save();
        await file.close();
    }


    constructor(bot: Discord.Client, dev: DeveloperManager) {
        this.bot = bot;
        bot.guilds.fetch(process.env["GUILD_ID"] ?? "")
            .then(x => this.guild = x);
        bot.channels.fetch(process.env["CATEGORY_ID"] ?? "")
            .then(x => this.channel = x);

        this.channelsPath = process.env["CHANNELS_FILE"] ?? "channels.json";
        this.init(bot, dev).then(_ => console.log("Finished caching channels"));
    }


    public createChannel(developer: Developer, client: Discord.User): void {
        this.guild.channels.create(`${developer.displayName}-${developer.incrementTicketCounter()}`,
            {
                parent: this.channel,
                permissionOverwrites: this.createPerms([client.id, developer.id], {allow: ['VIEW_CHANNEL']})
            })
            .then(ch => {
                ch.send(new Discord.MessageEmbed()
                    .setTitle("Ticket")
                    .setColor("#ff77ff")
                    .setDescription(client.toString() + ` Please describe your issue below.\n
                ${developer.message == null ? "" : `Please note that ${developer.displayName} is ${developer.message}.\n`}
                <@${developer.id.toString()}>`
                    )
                    .setFooter(`React with \ud83d\udd12 or type ${process.env["PREFIX"]}close to close this ticket`)
                ).then(msg => msg.react("\ud83d\udd12"));
                this._channels.push(ch.id);
                this.save();
            });
    }

    public closeTicket(channel: TextChannel): void {
        channel.overwritePermissions(
            this.createPerms(this.usersFromChannel(channel),
                {deny: ['SEND_MESSAGES'], allow: ['VIEW_CHANNEL']}))
            .then(chan => {
                chan.send(new Discord.MessageEmbed()
                    .setTitle("Ticket Closed")
                    .setColor("#ff77ff")
                    .setDescription(`React with \ud83d\udd13 or type ${process.env["PREFIX"]}reopen to re-open\n` +
                        `React with \ud83d\uddd1\ufe0f or type ${process.env["PREFIX"]}delete to delete`)
                ).then(msg => {
                    msg.react("\ud83d\udd13");
                    msg.react("\ud83d\uddd1\ufe0f");
                });
            });
    }

    public openTicket(channel: TextChannel): void {
        channel.overwritePermissions(
            this.createPerms(this.usersFromChannel(channel),
                {allow: ['VIEW_CHANNEL']}))
            .then(chan => {
                chan.send(new Discord.MessageEmbed()
                    .setTitle("Ticket Reopened")
                    .setColor("#ff77ff")
                    .setDescription(`React with \ud83d\udd12 or type ${process.env["PREFIX"]}close to close this ticket`)
                ).then(msg => {
                    msg.react("\ud83d\udd12");
                })
            });
    }

    public deleteTicket(channel: Channel): void {
        this._channels.splice(this._channels.indexOf(channel.id), 1);
        channel.delete();
        this.save();
    }

    public addToTicket(channel: TextChannel, userId: string) {
        let users = this.usersFromChannel(channel);
        users.push(userId);
        channel.overwritePermissions(
            this.createPerms(users,
                {allow: ['VIEW_CHANNEL']})
        ).then(chan => chan.send(new Discord.MessageEmbed()
            .setTitle("User added")
            .setColor("#ff77ff")
            .setDescription(`Added user <@${userId}>`)
            .setFooter(`React with \ud83d\udd12 or type ${process.env["PREFIX"]}close to close this ticket`)
        ));
    }
}