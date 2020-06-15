import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IStream } from '../stream';
import { IEvent, EventStatus, ScheduleEvent, EventAction, IEventChangeArray } from '../event';
import { ScheduleService } from '../schedule.service';
import { ScheduleUIService } from '../schedule-ui.service';

@Component({
  selector: 'schedule-timeline-events',
  templateUrl: './schedule-timeline-events.component.html',
  styleUrls: ['./schedule-timeline-events.component.css']
})
export class ScheduleTimelineEventsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() streamID: string;
  @Input() date: string;
  events: IEvent[];

  private _eventsSubscription: Subscription;
  private _newEventSubscription: Subscription;
  private _editEventSubscription: Subscription;
  private _removeEventSubscription: Subscription;

  constructor(
    private _scheduleUiService: ScheduleUIService,
    private _scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    //Subscription for new events notifications
    this._newEventSubscription = this._scheduleService._newEvent
      .subscribe(
        event => {
          this.displayNewEvent(event);
        }
      );

    //Subscription for edited events notifications
    this._editEventSubscription = this._scheduleService._editEvent
      .subscribe(
        eventChangeArray => {
          this.updateEditedEvent(eventChangeArray);
        }
      )
    
    //Subscription for incoming events to remove from UI
    this._removeEventSubscription = this._scheduleUiService.eventToRemove
      .subscribe(
        event => {
          this.removeDeletedEvent(event);
        }
      )

    this.getEvents();
  }

  ngOnChanges(): void {
  }

  ngOnDestroy(): void {
    this._newEventSubscription.unsubscribe();
    this._editEventSubscription.unsubscribe();
    this._removeEventSubscription.unsubscribe();
    this._eventsSubscription.unsubscribe();
  }

  getEvents() {
    //logic to fetch events based on stream, date etc...
    this._eventsSubscription = this._scheduleService.getEvents(this.streamID, this.date)
      .subscribe(
        events => {
          this.events = events;
        }
      );
  }

  setEventLeft(event: IEvent): number {
    //logic to calculate position (left) based on start time
    let startTime = new Date(event.startDateTime);
    let hourPx = startTime.getHours() * 50;
    let minutePx = startTime.getMinutes() * (50 / 60);

    return hourPx + minutePx;
  }

  setEventWidth(event: IEvent): number {
    //logic to calculate width based on duration
    let startTime = new Date(event.startDateTime);
    let endTime = new Date(event.endDateTime);

    let timeDiff = endTime.getTime() - startTime.getTime();
    let hourDuration = timeDiff / (1000 * 60 * 60);
    let minDuration = (hourDuration - Math.abs(hourDuration)) * 60;

    let hourPx = hourDuration * 50;
    let minutePx = minDuration * (50 / 60);

    return hourPx + minutePx;
  }

  setEventColor(event: IEvent): string {
    //logic to set event color based on status
    switch(event.status) {
      case EventStatus.Ready: return '#015a60'; //Teal
      case EventStatus.Assigned: return '#015a60'; //Teal
      case EventStatus.Conflict: return '#242424'; //Black
      case EventStatus.Cueing: return '#cb7b18'; //Dark Orange
      case EventStatus.Cued: return '#ee8e1e'; //Bright Orange
      case EventStatus.Recording: return '#c72d2f'; //Red
      case EventStatus.Done: return '#00871f'; //Green
      case EventStatus.Failed: return '#242424'; //Black
      case EventStatus.Lapsed: return '#8c8c8c'; //Lighter Gray
      default: return '#242424'; //Black
    }
  }

  displayNewEvent(event: IEvent) {
    if(this.checkEventInThisInstance(event)) {
      this.events.push(event);
    }
  }

  removeDeletedEvent(event: IEvent) {
    if(this.checkEventInThisInstance(event)) {
      let eventIndex = this.events.findIndex(events => events.id === event.id);
      this.events.splice(eventIndex, 1);
    }
  }

  updateEditedEvent(eventChangeArray: IEventChangeArray) {
    let oldEvent = eventChangeArray['old'];
    let newEvent = eventChangeArray['new'];

    if(this.checkEventInThisInstance(oldEvent)) {

      if(oldEvent.streamID !== newEvent.streamID) {
        //Event stream was changed, old instance should be removed from dsiplay
        let eventIndex = this.events.findIndex(events => events.id === oldEvent.id);
        this.events.splice(eventIndex, 1);
        console.log('old event removed');
      }
      else {
        //Event stream was not changed, refresh events list for this instance
        this.getEvents();
        console.log('old stream get events');
      }
    }

    if(this.checkEventInThisInstance(newEvent)) {
      
      if(oldEvent.streamID !== newEvent.streamID) {
        //Event stream was changed, display the 'new' event
        this.events.push(newEvent);
        console.log('new event added');
      }
      else {
        if(oldEvent.startDateTime.substring(0,9) !== newEvent.startDateTime.substring(0,9)) {
          //Only refresh events list if date is different from previous else it is already refreshed
          this.getEvents();
          console.log('new stream get events');
        }
      }
    }
  }

  showEventModal(modalId: string, action: EventAction, event: IEvent) {
    this._scheduleUiService.openModal(modalId);
    this._scheduleUiService.setEventToDisplay(event);
  }

  private checkEventInThisInstance(event: IEvent): boolean {
    if(event.streamID === this.streamID && event.startDateTime.substring(0, this.date.length) === this.date) {
      return true;
    }

    return false;
  }
}
