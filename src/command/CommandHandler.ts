import {Client, Message} from "discord.js";
import {Command} from "./Command";

export class CommandHandler {
    private static _instance: CommandHandler;
    private map: Map<string, Command> = new Map<string, Command>();

    static get instance() {
        return CommandHandler._instance;
    }

    register(cmd: Command): void {
        this.map.set(cmd.name, cmd);
    }

    handle(msg: Message): void {
        if (!msg.content.startsWith(process.env.PREFIX ?? "") || msg.content.length < 2) return;
        let args = msg.content.split(" ");
        let cmd: Command | undefined = this.map.get(args[0].substring(1));
        if (cmd instanceof Command) cmd.execute(msg.author, args.slice(1));
    }

    constructor(bot: Client) {
        CommandHandler._instance = this;
    }
}