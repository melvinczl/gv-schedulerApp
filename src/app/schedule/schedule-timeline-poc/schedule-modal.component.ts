import { Component, Input, ElementRef, OnInit, OnDestroy, Renderer } from '@angular/core';

import { ScheduleUIService } from '../schedule-ui.service';

@Component({
  moduleId: module.id.toString(),
  selector: 'schedule-modal',
  template: '<ng-content></ng-content>'
})
export class ScheduleModalComponent implements OnInit, OnDestroy {
  /* This is a generic Modal component wrapper
     All modals content should use this component as container with unique id
     Each modal will be registered with the Schedule UI Service which can be used to manipulate the modals based on id
  */
  @Input() id: string;

  constructor(
    private _scheduleUiService: ScheduleUIService,
    private el: ElementRef,
    private renderer: Renderer
  ) { }

  ngOnInit() {
    //Register this current instance of modal with UI Service
    this._scheduleUiService.addModal(this);

    //Set modal class to this component element
    this.renderer.setElementClass(this.el.nativeElement, 'modal', true);
  }

  ngOnDestroy() {
    this._scheduleUiService.removeModal(this.id);
  }

  open() {
    this.renderer.setElementStyle(this.el.nativeElement, 'display', 'block');
  }

  close() {
    this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
  }
}
