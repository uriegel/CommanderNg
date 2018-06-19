import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements AfterViewInit {

    @ViewChild("table") table: ElementRef
    
    constructor() { }

    ngAfterViewInit() {
        this.table.nativeElement.tabIndex = 1
    }

}
