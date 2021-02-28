import {Message} from "discord.js";
import {CommandHandler} from "./CommandHandler";

export abstract class Command {
    public abstract get name(): string;
    abstract execute(message: Message, args: string[]): string;

    protected constructor() {
       CommandHandler.instance.register(this);
    }
}