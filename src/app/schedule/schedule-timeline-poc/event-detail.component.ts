import { Component, OnInit, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IEvent, ScheduleEvent, EventAction, EventStatus } from '../event';
import { IStream } from '../stream';
import { ScheduleService } from '../schedule.service';
import { ScheduleUIService } from '../schedule-ui.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() modalId: string;
  @Input() streams: IStream[];
  @Output() toggleModalBackdrop: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  event: IEvent = new ScheduleEvent();
  eventActionText: string;

  get eventAction(): EventAction {
    return this._eventAction;
  }
  set eventAction(value: EventAction) {
    this._eventAction = value;
    this.eventActionText = EventAction[value];
  }

  private _event: IEvent = new ScheduleEvent();
  private _eventAction: EventAction;
  private _eventDisplaySubscription: Subscription;
  
  constructor(
    private _scheduleUiService: ScheduleUIService, 
    private _scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    //Subscription for incoming event to display
    this._eventDisplaySubscription = this._scheduleUiService.eventToDisplay
      .subscribe(
        event => {
          this.toggleModalBackdrop.emit(true);
          this.setEditMode(event);
        }
      )
  }

  ngOnChanges() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this._eventDisplaySubscription.unsubscribe();
  }

  onSubmit(eventForm: NgForm) {
    this._event = eventForm.value;

    if(this.eventAction == EventAction.Add) {
      this.createEvent();
    }
    else if(this.eventAction == EventAction.Edit) {
      //Insert event Id & Status which were not available in form
      this._event.id = this.event.id;
      this._event.status = this.event.status;
      this.updateEvent();
    }
  }

  getDisplayDate(dateObj: Date): string {
    let date = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    let h: any = dateObj.getHours();
    let m: any = dateObj.getMinutes();

    //h = (h > 12) ? h - 12 : h;
    m = (m < 10) ? '0' + m : m;

    return month +'/'+ date +'/'+ year +' '+ h +':'+ m;
  }
  
  setEventStartDateTime(date: Date) {
    this.event.startDateTime = this.getDisplayDate(date);
  }

  setEditMode(event: IEvent) {
    //Set component to edit event mode
    this._event = event;
    this.event = event;
    this.eventAction = EventAction.Edit;
  }

  // openModal() {
  //   this._scheduleUiService.openModal(this.modalId);
  //   this.toggleModalBackdrop.emit(true);
  // }

  closeModal(eventForm?: NgForm) {
    if(eventForm !== undefined) {
      eventForm.resetForm(this.event);
    }

    this._scheduleUiService.closeModal(this.modalId);
    this.toggleModalBackdrop.emit(false);
  }

  createEvent() {
    this._event.status = EventStatus.Ready;
    
    this._scheduleService.createEvent(this._event)
      .subscribe(
        event => event,
        error => console.log(error),
        () => this.closeModal()
      );
  }

  updateEvent() {
    //Populate the 'old' event before update to eventChangeArray
    this._scheduleService.eventChangeArray['old'] = this.event;

    this._scheduleService.updateEvent(this._event)
      .subscribe(
        event => event,
        error => console.log(error),
        () => this.closeModal()
      );
  }

  deleteEvent(eventId: string) {
    this._scheduleService.deleteEvent(eventId)
      .subscribe(
        response => response,
        error => console.log(error),
        () => this.closeModal()
      );

    this._scheduleUiService.setEventToRemove(this.event);
  }
}
