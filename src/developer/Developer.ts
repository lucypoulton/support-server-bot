import {DeveloperManager} from "./DeveloperManager";

export class Developer {

    // @ts-ignore
    private _id: string;
    // @ts-ignore
    private _displayName: string;
    // @ts-ignore
    private _emoji: string;
    private _ticketCounter: number = 0;

    private readonly _gitName: string | null = null;
    private _message: string | null = null;

    private _manager: DeveloperManager;

    get id(): string {
        return this._id;
    }

    get displayName(): string {
        return this._displayName;
    }

    get emoji(): string {
        return this._emoji;
    }

    set emoji(value : string) {
        this._emoji = value;
    }

    set displayName(value: string) {
        this._displayName = value;
    }

    get message(): string | null {
        return this._message;
    }

    set message(value: string | null) {
        this._message = value;
    }

    get gitName(): string {
        return this._gitName  ?? this.displayName;
    }

    get ticketCounter(): number {
        return this._ticketCounter;
    }

    incrementTicketCounter() : number
    {
        this._ticketCounter++;
        this._manager.addOrUpdateDev(this);
        return this._ticketCounter;
    }

    set ticketCounter(value: number) {
        this._ticketCounter = value;
        this._manager.addOrUpdateDev(this);
    }

    asObject(): object {
        return {
            "_id": this.id,
            "_displayName": this.displayName,
            "_emoji": this.emoji,
            "_gitName": this._gitName,
            "_message": this.message,
            "_ticketCounter": this.ticketCounter
        }
    };

    constructor(manager: DeveloperManager, data: object) {
        this._manager = manager;
        Object.assign(this, data);
    }
}