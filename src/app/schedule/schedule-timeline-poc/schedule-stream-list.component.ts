import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { IStream } from '../stream';

@Component({
  selector: 'schedule-stream-list',
  templateUrl: './schedule-stream-list.component.html',
  styleUrls: ['./schedule-stream-list.component.css']
})
export class ScheduleStreamListComponent implements OnInit, OnChanges {

  @Input() streams: IStream[];

  clock: string;
  pageYOffset: number = 0;

  constructor() { }

  ngOnInit() {
    setInterval(() => this.currentTime(), 1000);
  }

  ngOnChanges(): void {
  }

  setStreamListHeaderPos(): void {
    //Adjust stream-list-header to stay in position during scroll
    document.getElementById('stream-list-header').style.top = this.pageYOffset +'px';
  }

  currentTime() {
    let now = new Date();
    let h: any = now.getHours();
    let m: any = now.getMinutes();
    let s: any = now.getSeconds();
    let meridiem = (now.getHours() >= 12) ? 'PM' : 'AM';

    h = (h > 12) ? h - 12 : h;
    //append '0' if minutes/seconds less than 10
    m = (m < 10) ? '0' + m : m;
    s = (s < 10) ? '0' + s : s;

    this.clock = h + ':' + m + ':' + s + ' ' + meridiem;
  }
}
