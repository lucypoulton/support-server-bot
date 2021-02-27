import * as Discord from "discord.js";
import * as assert from "assert";
import {MessageReaction, TextChannel, User} from "discord.js";
import {DeveloperManager} from "./developer/DeveloperManager";
import {ChannelManager} from "./ChannelManager";
import {Developer} from "./developer/Developer";

export class ReactionManager {
    private reactionMessage: string = "";
    private channelManager: ChannelManager;
    private devManager: DeveloperManager;
    private bot: Discord.Client;

    private handleReaction(reaction: MessageReaction, user: User, manager: ReactionManager): void {
        if (user.bot) return;
        let dev: Developer | undefined = manager.devManager.developers.find(dev => dev.emoji == reaction.emoji.toString());
        assert.ok(dev instanceof Developer);
        this.channelManager.createChannel(dev, user);
        reaction.remove().catch(console.warn);
    }

    public regenMessage() {
        this.bot.channels.fetch(process.env["CHANNEL_ID"] ?? "")
            .then(x => {
                assert.ok(x instanceof TextChannel);
                x.messages.fetch({limit: 50}).then(hist => hist.forEach(c => c.delete()));
                let description: String = "";
                this.devManager.developers.forEach(dev => {
                    description += `React with ${dev.emoji} for ${dev.displayName}`
                })
                x.send(new Discord.MessageEmbed()
                    .setTitle("Open a Ticket")
                    .setColor("#ff77ff")
                    .setDescription(description)
                )
                    .then(msg => {
                        this.reactionMessage = msg.id;
                        this.devManager.developers.forEach(dev => msg.react(dev.emoji));
                        msg.createReactionCollector(x => true, {})
                            .on("collect", (a, b) => this.handleReaction(a, b, this));
                    })
            });
    }

    constructor(bot: Discord.Client, devManager: DeveloperManager, channelManager: ChannelManager) {
        this.devManager = devManager;
        this.channelManager = channelManager;
        this.bot = bot;
        this.regenMessage();
    }
}