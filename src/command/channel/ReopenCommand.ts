import {TextChannel} from "discord.js";
import {AbstractChannelCommand} from "./AbstractChannelCommand";

export class ReopenCommand extends AbstractChannelCommand {
    public get name() {
        return "reopen";
    }

    protected execChannelAction(channel: TextChannel): void {
        this.channelMan.openTicket(channel);
    }
}