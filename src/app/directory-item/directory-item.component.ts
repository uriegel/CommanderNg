import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../table-view/table-view.component'

@Component({
    selector: '[app-directory-item]',
    templateUrl: './directory-item.component.html',
    styleUrls: ['./directory-item.component.css']
})
export class DirectoryItemComponent implements OnInit {

    @Input()
    Item: Item
    
    constructor() { }

    ngOnInit() {
    }
}
