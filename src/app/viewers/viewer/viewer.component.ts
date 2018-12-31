import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

    isImage = false

    @Input()
    set item(item: string) {
        if (item)
            this.isImage = item.toLowerCase().endsWith(".jpg") || item.toLowerCase().endsWith(".png") || item.toLowerCase().endsWith(".jpeg")
    }
    
    constructor() { }

    ngOnInit() { }

}
