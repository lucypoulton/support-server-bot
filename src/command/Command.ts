import {User} from "discord.js";
import {CommandHandler} from "./CommandHandler";

export abstract class Command {
    abstract readonly name: string;
    abstract execute(user: User, args: string[]): string;

    private Command() {
       CommandHandler.instance.register(this);
    }
}