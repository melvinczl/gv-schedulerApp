export interface IEvent {
    id: string;
    name: string;
    streamID: string;
    clipLocation: string;
    startDateTime: string;
    endDateTime: string;
    duration: string;
    status: EventStatus;
}

export class ScheduleEvent implements IEvent {
    id: string;
    name: string;
    streamID: string;
    clipLocation: string;
    startDateTime: string;
    endDateTime: string;
    duration: string;
    status: EventStatus;

    constructor() {
        this.id = null;
        this.name = "";
        this.streamID = "";
        this.clipLocation = "";
        this.startDateTime = "";
        this.endDateTime = "";
        this.duration = "";
        this.status = EventStatus.Ready;
    }
}

export interface IEventChangeArray {
    [key: string]: IEvent
}

export enum EventAction {
    Add = 1,
    Edit = 2,
    Delete = 3
}

export enum EventStatus {
    Ready = 1,
    Assigned = 2,
    Conflict = 3,
    Cueing = 4,
    Cued = 5,
    Recording = 6,
    Done = 7,
    Failed = 8,
    Lapsed = 9
}