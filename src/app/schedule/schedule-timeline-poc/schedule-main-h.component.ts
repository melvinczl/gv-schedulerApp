import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IStream } from '../stream';
import { IEvent, EventAction, ScheduleEvent } from '../event';
import { ScheduleTimelineHComponent } from './schedule-timeline-h.component';
import { ScheduleStreamListComponent } from './schedule-stream-list.component';
import { EventDetailComponent } from './event-detail.component';
import { ScheduleUIService } from '../schedule-ui.service';
import { IPStreamService } from '../ipstream.service';

@Component({
  selector: 'schedule-main-h',
  templateUrl: './schedule-main-h.component.html',
  styleUrls: ['./schedule-main-h.component.css']
})
export class ScheduleMainHComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(ScheduleTimelineHComponent) private timelineComponent: ScheduleTimelineHComponent;
  @ViewChild(ScheduleStreamListComponent) private streamListComponent: ScheduleStreamListComponent;
  @ViewChild(EventDetailComponent) private eventDetailComponent: EventDetailComponent;

  private _currentDate: Date = new Date();
  public get currentDate(): string {
    // let dateString = 'Day, dd month, yyyy'
    //   .replace('Day', this.getDay())
    //   .replace('dd', this._currentDate.getDate().toString())
    //   .replace('month', this.getMonth())
    //   .replace('yyyy', this._currentDate.getFullYear().toString());

    return this._currentDate.toDateString();
  }

  eventModalId: string = 'eventModal';
  eventAction: EventAction = EventAction.Add;
  toggleModalBackdrop: boolean = false;

  //Timeline variables
  timelineViewableElement: HTMLElement;
  timelineMouseDown: boolean = false;
  timelineScrollPosition: number = 0;
  timelineMouseXPos: number = 0;

  private streams: IStream[];

  private _ipStreamSubscription: Subscription;

  constructor(
    private _scheduleUiService: ScheduleUIService,
    private _ipStreamService: IPStreamService
  ) { }

  ngOnInit() {
    setInterval(() => this.updateCurrentDate(), 60000);

    this._ipStreamSubscription = this._ipStreamService.getStreams()
      .subscribe(
        streams => { 
          this.streams = streams;
        }
      );
  }
  
  ngAfterViewInit(): void {
    this.timelineViewableElement = document.getElementById('timeline-viewable');

    this.timelineViewableElement.addEventListener('mousedown', this.onTimelineMouseDown.bind(this));
    this.timelineViewableElement.addEventListener('mousemove', this.onTimelineMouseMove.bind(this));
    this.timelineViewableElement.addEventListener('mouseup', this.onTimelineMouseUp.bind(this));
    this.timelineViewableElement.addEventListener('mouseleave', this.onTimelineMouseLeave.bind(this));

    // setTimeout(() => {
    //   let now = new Date();
    //   now.setDate(now.getDate() +1);
    //   this.timelineComponent.currentDate = this.timelineComponent.getDisplayDate(now);
    //   console.log(now.toDateString());
    // }, 5000);
  }

  ngOnDestroy(): void {
    this._ipStreamSubscription.unsubscribe();
  }

  onContainerScroll(e) {
    //Gets the container vertical scroll position (length is based on channels list)
    let scrollTop = document.getElementById('schedule-container').scrollTop;

    this.streamListComponent.pageYOffset = scrollTop;
    this.streamListComponent.setStreamListHeaderPos();
    this.timelineComponent.pageYOffset = scrollTop;
    this.timelineComponent.setAllTimelineScalePos();
  }

  onTimelineScroll(e) {
    let scrollLeft = this.timelineViewableElement.scrollLeft;
    let offsetWidth = this.timelineViewableElement.offsetWidth;
    let scrollWidth = this.timelineViewableElement.scrollWidth;
    let scrollTop = document.getElementById('schedule-container').scrollTop;
    
    //detect scrolling reached end or start of timeline
    if(offsetWidth + scrollLeft == scrollWidth) {
      this.timelineComponent.addTimelineAfter();
    }
    else if(scrollLeft == 0 && this.timelineMouseDown) {
      this.timelineComponent.addTimelineBefore();
      this.timelineViewableElement.scrollLeft = 1200;
      //this.onTimelineMouseUp(e);
    }

    this.timelineComponent.pageYOffset = scrollTop;
  }

  onTimelineMouseDown(e) {
    this.timelineMouseDown = true;
    this.timelineScrollPosition = this.timelineViewableElement.scrollLeft;
    this.timelineMouseXPos = e.clientX;
  }

  onTimelineMouseUp(e) {
    this.timelineMouseDown = false;
  }

  onTimelineMouseMove(e) {
    let scrollLeft = this.timelineViewableElement.scrollLeft;
    let offsetWidth = this.timelineViewableElement.offsetWidth;
    let scrollWidth = this.timelineViewableElement.scrollWidth;

    if (this.timelineMouseDown) {

      //detect scrolling reached end or start of timeline
      if (offsetWidth + scrollLeft == scrollWidth) {
        this.timelineComponent.addTimelineAfter();
      }
      else if (scrollLeft == 0) {
        this.timelineComponent.addTimelineBefore();
        this.timelineViewableElement.scrollLeft = this.timelineComponent.timelineContainerWidth;
        this.timelineScrollPosition = this.timelineComponent.timelineContainerWidth;
        this.timelineMouseXPos = e.clientX;
      }
      
      this.timelineViewableElement.scrollLeft = this.timelineScrollPosition + this.timelineMouseXPos - e.clientX;
    }
  }

  onTimelineMouseLeave(e) {
    this.timelineMouseDown = false;
  }

  updateCurrentDate() {
    //Update the current date
    let now = new Date();

    if (this.currentDate !== now.toDateString()) {
      this._currentDate = now;
      //Update Timeline Component current date with accepted format, time indicator will be updated accordingly
      this.timelineComponent.currentDate = this.timelineComponent.getDisplayDate(now);
    }
  }

  getDay(): string {
    let day = this._currentDate.getDay();
    
    switch(day) {
      case 0: return 'Sunday';
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
      default: return 'invalid day!';
    }
  }

  getMonth(): string {
    let month = this._currentDate.getMonth();

    switch(month) {
      case 0: return 'January';
      case 1: return 'February';
      case 2: return 'March';
      case 3: return 'April';
      case 4: return 'May';
      case 5: return 'June';
      case 6: return 'July';
      case 7: return 'August';
      case 8: return 'September';
      case 9: return 'October';
      case 10: return 'November';
      case 11: return 'December';
      default: return 'invalid month!';
    }
  }

  openModal(modalId: string) {
    this._scheduleUiService.openModal(modalId);
  }

  closeModal(modalId: string) {
    this._scheduleUiService.closeModal(modalId);
  }

  showEventModal(modalId: string, action: EventAction, event?: IEvent) {
    //Initialize new event start time value as current time
    if(action == EventAction.Add) {
      this.eventDetailComponent.event = new ScheduleEvent();
      this.eventDetailComponent.setEventStartDateTime(new Date());
    }

    this.eventDetailComponent.eventAction = action;
    this.toggleModalBackdrop = true;
    this.openModal(modalId);
  }

  setToggleModalBackdrop(toggle: boolean) {
    this.toggleModalBackdrop = toggle;
  }
}
