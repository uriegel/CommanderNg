import { Component, OnInit, Input } from '@angular/core'
import { Item } from '../item'

// TODO: Filter for FileSize in Binding

@Component({
    selector: '[app-drive-item]',
    templateUrl: './drive-item.component.html',
    styleUrls: ['./drive-item.component.css']
})
export class DriveItemComponent implements OnInit {

    @Input()
    Item: Item

    constructor() { }

    ngOnInit() {
    }

}
