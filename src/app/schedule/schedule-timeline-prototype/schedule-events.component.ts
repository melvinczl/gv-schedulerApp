import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { IEvent, EventStatus } from '../event';

@Component({
  selector: 'schedule-events',
  templateUrl: './schedule-events.component.html',
  styleUrls: ['./schedule-events.component.css']
})
export class ScheduleEventsComponent implements OnInit, OnChanges {
  @Input() channelID: string;
  events: IEvent[];
  
  _c1Events: IEvent[] = [
    {
      id: 'e1',
      name: 'Dummy event',
      //aspectRatio: '4:3',
      streamID: 'C1',
      startDateTime: '1.00 am',
      endDateTime: '2.00 am',
      duration: '',
      clipLocation: '',
      status: EventStatus.Done
    },
    {
      id: 'e2',
      name: '2h event',
      //aspectRatio: '4:3',
      streamID: 'C1',
      startDateTime: '8.00 am',
      endDateTime: '10.00 am',
      duration: '',
      clipLocation: '',
      status: EventStatus.Ready
    }
  ];

  _c2Events: IEvent[] = [
    {
      id: 'e3',
      name: '1h 15m event',
      //aspectRatio: '16:9',
      streamID: 'C2',
      startDateTime: '4.45 am',
      endDateTime: '6.00 am',
      duration: '',
      clipLocation: '',
      status: EventStatus.Recording
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    //logic to fetch events based on channel...
    if(this.channelID === 'C1') {
      this.events = this._c1Events;
    }
    else if(this.channelID === 'C2') {
      this.events = this._c2Events;
    }
  }

  setEventTop(event: IEvent): number {
    //logic to calculate position based on start time
    switch(event.id) {
      case 'e1': return 50;
      case 'e2': return 400;
      case 'e3': return 237.5;
      default: return 0;
    }
  }

  setEventHeight(event: IEvent): number {
    //logic to calculate height based on duration
    switch(event.id) {
      case 'e1': return 50;
      case 'e2': return 100;
      case 'e3': return 62.5;
      default: return 0;
    }
  }
  
  setEventColor(event: IEvent): string {
    //logic to set event color based on status
    switch(event.id) {
      case 'e1': return 'gray';
      case 'e2': return 'gray';
      case 'e3': return 'cadetblue';
      default: return 'none';
    }
  }
}
