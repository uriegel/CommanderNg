import { Component, OnInit, Input, HostBinding } from '@angular/core'

@Component({
    selector: 'app-grid-splitter',
    templateUrl: './grid-splitter.component.html',
    styleUrls: ['./grid-splitter.component.css']
})
export class GridSplitterComponent implements OnInit {

    @HostBinding('class.isVertical') isVertical = true
    @Input("isVertical") isVerticalValue

    constructor() { }

    ngOnInit() { this.isVertical = this.isVerticalValue }
}
