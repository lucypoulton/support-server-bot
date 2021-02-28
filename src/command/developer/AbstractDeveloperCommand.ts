import {Command} from "../Command";
import {Message} from "discord.js";
import {DeveloperManager} from "../../developer/DeveloperManager";
import {Developer} from "../../developer/Developer";

export abstract class AbstractDeveloperCommand extends Command {
    protected devMan: DeveloperManager;
    protected abstract execChannelAction(dev: Developer, args?: string[]): string | null;

    execute(message: Message, args: string[]): string {
        let dev: Developer | undefined = this.devMan.developers.find(d => d.id == message.author.id);
        if (dev == undefined) {
            message.reply("you do not have permission to use this command")
                .then(x => x.delete({timeout: 5000}));
            return "";
        }
        return this.execChannelAction(dev, args) ?? "";
    }

    constructor(devMan: DeveloperManager) {
        super();
        this.devMan = devMan;
    }

}