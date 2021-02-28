import {AbstractDeveloperCommand} from "./AbstractDeveloperCommand";
import {Developer} from "../../developer/Developer";
import {DeveloperManager} from "../../developer/DeveloperManager";
import {ReactionHandler} from "../../ReactionHandler";

export class StatusCommand extends AbstractDeveloperCommand {
    private reactHandler: ReactionHandler;

    public get name() {
        return "status";
    }

    protected execChannelAction(dev: Developer, args: string[]): string {
        let message: string;
        if (args.length == 0) {
            dev.message = null;
            message = "Cleared status message";
        } else {
            dev.message = args.join(" ");
            message = `Set status message to "${dev.message}"`;
        }
        this.devMan.addOrUpdateDev(dev);
        this.reactHandler.regenMessage();
        return message;
    }

    public constructor(devMan: DeveloperManager, reactHandler: ReactionHandler) {
        super(devMan);
        this.reactHandler = reactHandler;
    }

}