import {Command} from "../Command";
import {Message, TextChannel} from "discord.js";
import {ChannelManager} from "../../ChannelManager";

export abstract class AbstractChannelCommand extends Command {
    protected channelMan: ChannelManager;
    protected abstract execChannelAction(channel: TextChannel, args?: string[]): void;

    execute(message: Message, args: string[]): string {
        if (!(message.channel instanceof TextChannel)) return "";
        let channel: string | undefined = this.channelMan.channels.find(chan => chan == message.channel.id);
        if (channel == undefined) {
            message.reply("this command can only be used in a ticket.")
                .then(x => x.delete({timeout: 5000}));
            return "";
        }
        this.execChannelAction(message.channel, args);
        return "";
    }

    constructor(channelMan: ChannelManager) {
        super();
        this.channelMan = channelMan;
    }

}