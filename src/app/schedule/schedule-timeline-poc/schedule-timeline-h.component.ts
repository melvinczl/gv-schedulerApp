import { Component, OnInit, Input, OnChanges, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

import { IStream } from '../stream';

@Component({
  selector: 'schedule-timeline-h',
  templateUrl: './schedule-timeline-h.component.html',
  styleUrls: ['./schedule-timeline-h.component.css']
})
export class ScheduleTimelineHComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() streams: IStream[];
  @ViewChildren('div #timeline-scale') timescaleDOM: QueryList<HTMLElement>;
  pageYOffset: number = 0;
  timelineContainerWidth: number = 1200;

  timelines: string[] = []

  timeScale: string[] = [
    '12 AM',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12 PM',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00'
  ];

  currentDate: string; 
  private _firstTimelineDate: string;

  constructor() { }

  ngOnInit() {
    this.initTimelines();
    
    //Set timeline scroll position to current day
    document.getElementById('timeline-viewable').scrollLeft = this.timelineContainerWidth;

    setInterval(() => this.updateTimeIndicator(), 60000);
  }

  ngOnChanges(): void {
  }

  ngAfterViewInit() {
    let timescales = document.getElementsByClassName('timeline-scale');
    let timelineIndex = 0;
    
    this.timescaleDOM.changes.subscribe(t => {
      //Check if new date added to begining or end of timelines array
      if(this.timelines[0] == this._firstTimelineDate) {
        timelineIndex = timescales.length - 1;
      }
      else {
        this._firstTimelineDate = this.timelines[0];
        timelineIndex = 0;
      }

      this.setTimelineScalePos(timelineIndex);
    })
  }

  setAllTimelineScalePos(): void {
    //Adjust all 'timeline-scale' to stay in position during scroll
    let timescales = document.getElementsByClassName('timeline-scale');
    
    for (let i = 0; i < timescales.length; i++) {
      let timescale = timescales.item(i) as HTMLElement;
      timescale.style.top = this.pageYOffset +'px';
    }
  }

  setTimelineScalePos(timelineIndex: number): void {
    //Adjust single 'timeline-scale' to stay in position during scroll
    let timescales = document.getElementsByClassName('timeline-scale');
    let timescale = timescales.item(timelineIndex) as HTMLElement;

    timescale.style.top = this.pageYOffset +'px';
  }
  
  getDisplayDate(dateObj: Date): string {
    //Date string format for timelines
    let date = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();

    return month +'/'+ date +'/'+ year;
  }

  initTimelines(): void {
    //Initialize timelines with current, previous and next day
    let today = new Date();
    let yesterday = new Date();
    let tomorrow = new Date();

    yesterday.setDate(today.getDate() -1);
    tomorrow.setDate(today.getDate() +1);

    let currentDate = this.getDisplayDate(today);
    let previousDate = this.getDisplayDate(yesterday);
    let nextDate =this.getDisplayDate(tomorrow);

    this.currentDate = currentDate;
    this._firstTimelineDate = previousDate;
    this.timelines = [previousDate, currentDate, nextDate];
  }

  updateTimeIndicator() {
    //Update time indicator position on timeline
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();

    h = h * 50;
    m = m * (50 / 60);
    return (h + m);
  }

  addTimelineBefore(): void {
    //Add new timeline before first date displayed
    let firstDate = new Date(this.timelines[0])
    let newDate = new Date(firstDate)

    newDate.setDate(newDate.getDate() -1);
    this.timelines.splice(0, 0, this.getDisplayDate(newDate));
    this.extendTimelineCanvas();
  }

  addTimelineAfter(): void {
    //Add new timeline after last date displayed
    let latestDate = new Date(this.timelines[this.timelines.length - 1]);
    let newDate = new Date(latestDate);

    newDate.setDate(newDate.getDate() +1);
    let newSize = this.timelines.push(this.getDisplayDate(newDate));
    this.extendTimelineCanvas();
  }

  extendTimelineCanvas(): void {
    //Extend width of 'timeline-canvas' element
    let element = document.getElementById('timeline-canvas');
    element.style.width = parseInt(element.style.width) + this.timelineContainerWidth + 'px';
  }
}
