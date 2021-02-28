import {TextChannel} from "discord.js";
import {AbstractChannelCommand} from "./AbstractChannelCommand";

export class CloseCommand extends AbstractChannelCommand {
    public get name() {
        return "close";
    }

    protected execChannelAction(channel: TextChannel): void {
        this.channelMan.closeTicket(channel);
    }
}