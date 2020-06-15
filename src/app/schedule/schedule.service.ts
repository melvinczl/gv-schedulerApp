import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';
import { IEvent, EventStatus, IEventChangeArray } from './event';

@Injectable()
export class ScheduleService {
    private _eventUrl = environment.apiUrl + '/events';

    //Subject for event change watch subscription
    _newEvent = new Subject<IEvent>();
    _editEvent = new Subject<IEventChangeArray>();

    //Associative array to store 'old' (before update) and 'new' (after update) instance of an event being updated
    eventChangeArray: IEventChangeArray;
    
    constructor(private _http: HttpClient) {
        //Initialize eventChangeArray with 'old' and 'new' keys
        this.eventChangeArray = {
            'old': undefined,
            'new': undefined
        };
    }

    getEvents(streamID?: string, date?: string): Observable<IEvent[]> {
        let obsEvents: Observable<IEvent[]>;

        obsEvents = this._http.get<IEvent[]>(this._eventUrl)
            .catch(this.handleError);
            
        if(streamID != undefined) {
            obsEvents = obsEvents
                .map(events => events
                    .filter(e => e.streamID === streamID))
                .catch(this.handleError);
        }

        if(date != undefined || date != '') {
            obsEvents = obsEvents
                .map(events => events
                    .filter(e => e.startDateTime.substring(0, date.length) === date))
                .catch(this.handleError);
        }

        return obsEvents;
    }

    getEvent(eventId: string): Observable<IEvent> {
        return this._http.get<IEvent[]>(this._eventUrl + '/' + eventId)
            .map(event => {
                return event;
            })
            .catch(this.handleError);
    }

    createEvent(event: IEvent): Observable<IEvent> {
        return this._http.post<IEvent>(this._eventUrl, event)
            .map(event => {
                this._newEvent.next(event);
                return event;
            })
            .catch(this.handleError);
    }

    updateEvent(event: IEvent): Observable<IEvent> {
        return this._http.put<IEvent>(this._eventUrl + '/' + event.id, event)
            .map(event => {
                //Populate the 'new' updated event returned 
                this.eventChangeArray['new'] = event;
                this._editEvent.next(this.eventChangeArray);
                return event;
            })
            .catch(this.handleError);
    }

    deleteEvent(eventId: string): Observable<IEvent> {
        return this._http.delete<IEvent>(this._eventUrl + '/' + eventId)
            .map(response => response)
            .catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
    }
}