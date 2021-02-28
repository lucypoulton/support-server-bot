import {TextChannel} from "discord.js";
import {AbstractChannelCommand} from "./AbstractChannelCommand";
import Discord from "discord.js";

export class AddUserCommand extends AbstractChannelCommand {
    public get name() {
        return "adduser";
    }

    protected execChannelAction(channel: TextChannel, args: string[]): void {
        if (args.length == 0) return;
        channel.guild.members.fetch({query: args[0]}).then(
            usr => {
                if (usr.size == 0) {
                    channel.send(
                        new Discord.MessageEmbed()
                            .setTitle("Failed")
                            .setColor("#ff77ff")
                            .setDescription(`Failed to find a user matching the name "${args[0]}".`)
                    );
                    return;
                }
                this.channelMan.addToTicket(channel, usr.keyArray()[0]);
            }
        );
    }
}