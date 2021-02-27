import {DeveloperManager} from "./DeveloperManager";

export class Developer {

    // @ts-ignore
    private _id: string;
    // @ts-ignore
    private _displayName: string;
    // @ts-ignore
    private _emoji: string;

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
        return this._gitName == null ? this.displayName : this._gitName;
    }

    asObject(): object {
        return {
            "id": this.id,
            "displayName": this.displayName,
            "emoji": this.emoji,
            "gitName": this._gitName,
            "message": this.message
        }
    };

    constructor(manager: DeveloperManager, data: object) {
        this._manager = manager;
        Object.assign(this, data);
    }
}