import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

import { environment } from '../../environments/environment';
import { IEvent, EventStatus } from './event';

@Injectable()
export class ScheduleUIService {
    //List of modals registered and managed by UI Service
    private _modals: any[] = [];

    //Subject for event to be projected to event detail components subscription
    eventToDisplay = new Subject<IEvent>();
    eventToRemove = new Subject<IEvent>();
    
    constructor() {}

    addModal(modal: any) {
        this._modals.push(modal);
    }

    removeModal(modalId: string) {
        let modalIndex = this._modals.indexOf(modals => modals.id == modalId);
        this._modals.splice(modalIndex, 1);
    }

    openModal(modalId: string) {
        let modal = this._modals.find(modals => modals.id == modalId);
        modal.open();
    }

    closeModal(modalId: string) {
        let modal = this._modals.find(modals => modals.id == modalId);
        modal.close();
    }
    
    setEventToDisplay(event: IEvent) {
        this.eventToDisplay.next(event);
    }

    setEventToRemove(event: IEvent) {
        this.eventToRemove.next(event);
    }
}