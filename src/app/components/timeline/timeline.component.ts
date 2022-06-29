import { Component, OnInit, Input } from '@angular/core';
import { TimelineItem } from '../../interfaces/timeline-item';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input() items: TimelineItem[] | undefined;
  constructor() {}

  ngOnInit() {}

  activeItem(item: TimelineItem) {
    if (this.items){
    for (const i of this.items) {
      i.active = undefined;
    }
  }
    item.active = true;

    if (item.command) {
      item.command();
    }
  }

  getColor(item: TimelineItem) {
    if (!item.color) {
      return null;
    }

    if (item.active) {
      return '#' + item.color;
    } else {
      return '#' + this.lighten(item.color, 50);
    }
  }

  lighten(col: any, amt:any) {
    col = parseInt(col, 16);
    return (
      ((col & 0x0000ff) + amt) | ((((col >> 8) & 0x00ff) + amt) << 8) | (((col >> 16) + amt) << 16)
    ).toString(16);
  }
}