import { Component, OnInit } from '@angular/core';

import { IChannel } from '../channel';
import { IEvent } from '../event';

@Component({
  selector: 'schedule-timeline',
  templateUrl: './schedule-timeline.component.html',
  styleUrls: ['./schedule-timeline.component.css']
})
export class ScheduleTimelineComponent implements OnInit {

  private _currentDate: Date = new Date();
  public get currentDate(): string {
    let dateString = 'Day, dd month, yyyy'
      .replace('Day', this.getDay())
      .replace('dd', this._currentDate.getDate().toString())
      .replace('month', this.getMonth())
      .replace('yyyy', this._currentDate.getFullYear().toString());

    return dateString;
  }

  clock: string;
  timeIndicatorPos: number = 50;
  toggleModalBackdrop: boolean = false;

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

  selectedChannel: IChannel;
  selectedEvent: IEvent;

  constructor() {
    this.updateTimeIndicator();
  }

  ngOnInit() {
    setInterval(() => this.currentTime(), 1000);
    setInterval(() => this.updateTimeIndicator(), 60000);
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

    this.clock = h + ":" + m + ":" + s + " " + meridiem;
  }

  updateTimeIndicator() {
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();

    h = (h + 1) * 50;
    m = m * (50 / 60);
    this.timeIndicatorPos = h + m;
  }

  openModal(elementId: string) {
    let modal = document.getElementById(elementId);

    modal.style.display = 'block';
    this.toggleModalBackdrop = true;
  }

  closeModal(elementId: string) {
    let modal = document.getElementById(elementId);

    modal.style.display = 'none';
    this.toggleModalBackdrop = false;
  }

  showChannelModal(elementId: string, channel: IChannel) {
    this.openModal(elementId);
    this.selectedChannel = channel;
  }

  showEventModal(elementId: string, event?: IEvent) {
    this.openModal(elementId);
    this.selectedEvent = event;
  }
}
