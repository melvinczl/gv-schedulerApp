import { Component, OnInit } from '@angular/core';

import { IChannel } from '../channel';

@Component({
  selector: 'schedule-timeline-wire',
  templateUrl: './schedule-timeline.wire.html',
  styleUrls: ['./schedule-timeline.wire.component.css']
})
export class ScheduleTimelineWireComponent implements OnInit {
  

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
  
  channels: IChannel[] = [
    {
      id: 'C1',
      name: 'channel 1',
      source: 'VTR1',
      location: 'default',
      aspectRatio: '4:3'
    },
    {
      id: 'C2',
      name: 'channel 2',
      source: 'CAM1',
      location: 'default',
      aspectRatio: '16:9'
    }
  ];
  
  events: any[] = [
    {
      'name': 'an event',
      'start': 2,
      'end': 2,
      'chID': 'C1'
    },
    {
      'name': 'another event',
      'start': 6,
      'end': 7,
      'chID': 'C2'
    },
    {
      'name': '2h event',
      'start': 9,
      'end': 11,
      'chID': 'C2'
    }
  ]

  excludedTds: any[] = [];

  constructor() { }

  ngOnInit() {
    for (var c = 0; c < this.channels.length; c++) {
      let ch = this.channels[c].id;
      let obj = { 'id': ch, 'tds': [] };
      this.excludedTds.push(obj);
    }

    console.log(this.excludedTds)
  }

  displayEvent(channel: string, timelineIndex: number, chIndex: number): void {
    let cell = document.getElementById(channel + timelineIndex.toString());

    if (this.excludedTds[chIndex]['tds'].find(x => x == timelineIndex) > 1) {
      if (cell !== null) cell.remove();
      return;
    }
    
    if (timelineIndex == 0) {
      cell.style.minWidth = '65px';
    }
    else {
      cell.style.minWidth = '72px';
    }

    for (let e of this.events) {
      let duration = e.end - e.start;

      if (channel == e.chID) {
        if (e.start == timelineIndex) {
          cell.style.backgroundColor = 'aqua';
          cell.innerText = e.name;

          if (duration > 1) {
            cell.setAttribute('colspan', duration.toString());
            cell.style.minWidth = 72*duration +'px';
            
            this.excludedTds[chIndex]['tds'].push(timelineIndex + (duration - 1))
          }
          else {
            cell.style.maxWidth = 72 + 'px';
          }
        }
      }
    }
  }

}
