import { Component, OnInit, Input } from '@angular/core'
import { Item } from '../../table-view/table-view.component'

@Component({
    selector: '[app-file-item]',
    templateUrl: './file-item.component.html',
    styleUrls: ['./file-item.component.css']
})
export class FileItemComponent implements OnInit {

    @Input()
    Item: Item
    
    constructor() { }

    ngOnInit() {
  }

}
