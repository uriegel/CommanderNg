import { Component, OnInit, Input, ElementRef } from '@angular/core'
import { IProgram } from 'src/app/interfaces/commander'

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

    isImage = false
    isMedia = false

    file = ""

    @Input()
    set item(item: string) {
        if (item) {
            this.isImage = item.toLowerCase().endsWith(".jpg") || item.toLowerCase().endsWith(".png") || item.toLowerCase().endsWith(".jpeg")
            this.isMedia = item.toLowerCase().endsWith(".mpg") || item.toLowerCase().endsWith(".mp4") || item.toLowerCase().endsWith(".ogv")
            //this.file = "file?path=" + item
            this.file = item
        }
    }

    @Input()
    set statusRatio(ratio: number) { Program.setStatusRatio(ratio) }

    @Input()
    set viewerRatio(ratio: number) {
        if (ratio)
            Program.setViewerRatio(ratio)
    }
    
    constructor(public appElement: ElementRef) { }

    ngOnInit() { }

}

declare var Program : IProgram