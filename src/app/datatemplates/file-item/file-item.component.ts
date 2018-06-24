import { Component, OnInit, Input } from '@angular/core'
import { Item } from '../item'

@Component({
    selector: '[app-file-item]',
    templateUrl: './file-item.component.html',
    styleUrls: ['./file-item.component.css']
})
export class FileItemComponent implements OnInit {

    @Input()
    item: Item
    @Input()
    basePath: string

    constructor() {}

    ngOnInit() { }
}
