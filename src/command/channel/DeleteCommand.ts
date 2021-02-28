import {TextChannel} from "discord.js";
import {AbstractChannelCommand} from "./AbstractChannelCommand";

export class DeleteCommand extends AbstractChannelCommand {
    public get name() {
        return "delete";
    }

    protected execChannelAction(channel: TextChannel): void {
        this.channelMan.deleteTicket(channel);
    }
}