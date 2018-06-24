import { Component, Input } from '@angular/core'
import { Item } from '../item'

@Component({
    selector: '[app-drive-item]',
    templateUrl: './drive-item.component.html',
    styleUrls: ['./drive-item.component.css']
})
export class DriveItemComponent {
    @Input()
    item: Item
}
