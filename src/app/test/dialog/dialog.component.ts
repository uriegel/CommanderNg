import { Component, OnInit, NgZone } from '@angular/core'
const { ipcRenderer } = (<any>window).require('electron')

@Component({
    selector: 'test-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    constructor(private zone: NgZone) {}

    isDialog

    ngOnInit() { 
        ipcRenderer.on("viewer", (_: any, on: boolean) => this.zone.run(() => this.isDialog = on))
    }

}
