import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'wiz-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  @Input() pageContent!: Wizard.ContentArray[];
  constructor() {}

  ngOnInit() {
    console.log(this.pageContent)
  }
}
