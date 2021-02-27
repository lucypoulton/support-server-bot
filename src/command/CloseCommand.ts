import {Command} from "./Command";
import {User} from "discord.js";

export class CloseCommand extends Command {
    readonly name: string = "close";

    execute(user: User, args: string[]): string {
        return "";
    }

}