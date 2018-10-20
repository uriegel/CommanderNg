import { Component, Input } from '@angular/core'
import { Item } from '../../model/model'

@Component({
    selector: '[app-file-item]',
    templateUrl: './file-item.component.html',
    styleUrls: ['./file-item.component.css']
})
export class FileItemComponent {
    @Input()
    item: Item
    @Input()
    basePath: string
}
