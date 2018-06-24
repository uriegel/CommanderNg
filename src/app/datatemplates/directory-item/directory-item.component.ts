import { Component, Input } from '@angular/core';
import { Item } from '../item'

@Component({
    selector: '[app-directory-item]',
    templateUrl: './directory-item.component.html',
    styleUrls: ['./directory-item.component.css']
})
export class DirectoryItemComponent {
    @Input()
    item: Item
}
