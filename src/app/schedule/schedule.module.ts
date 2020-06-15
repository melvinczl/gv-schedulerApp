import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ScheduleMainHComponent } from './schedule-timeline-poc/schedule-main-h.component';
import { ScheduleTimelineHComponent } from './schedule-timeline-poc/schedule-timeline-h.component';
import { ScheduleStreamListComponent } from './schedule-timeline-poc/schedule-stream-list.component';
import { ScheduleTimelineEventsComponent } from './schedule-timeline-poc/schedule-timeline-events.component';
import { EventDetailComponent } from './schedule-timeline-poc/event-detail.component';
import { ScheduleModalComponent } from './schedule-timeline-poc/schedule-modal.component';
import { ScheduleService } from './schedule.service';
import { ScheduleUIService } from './schedule-ui.service';
import { IPStreamService } from './ipstream.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ScheduleMainHComponent,
    ScheduleTimelineHComponent,
    ScheduleStreamListComponent,
    ScheduleTimelineEventsComponent,
    EventDetailComponent,
    ScheduleModalComponent
  ],
  exports: [
    ScheduleMainHComponent,
    ScheduleTimelineHComponent
  ],
  providers: [
    ScheduleService,
    ScheduleUIService,
    IPStreamService
  ]
})
export class ScheduleModule { }
