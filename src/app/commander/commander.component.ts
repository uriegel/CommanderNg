import { Component, Output, EventEmitter, ViewChild, OnInit, NgZone, HostListener } from '@angular/core'
import { CommanderViewComponent } from '../commander-view/commander-view.component';
const { ipcRenderer } = (<any>window).require('electron')

// TODO: status bar with binding to current item in current list
// TODO: Tab control

@Component({
  selector: 'app-commander',
  templateUrl: './commander.component.html',
  styleUrls: ['./commander.component.css']
})
export class CommanderComponent implements OnInit {

    @ViewChild("leftView") leftView: CommanderViewComponent
    @ViewChild("rightView") rightView: CommanderViewComponent

    isViewVisible = false

    constructor(private zone: NgZone) {}

    ngOnInit() {
        ipcRenderer.on("viewer", (_: any, on: boolean) => this.zone.run(() => this.isViewVisible = on))
    }

    @HostListener('keydown', ['$event']) 
    private onKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 9: // tab
            // TODO: in CommanderView: tab: to TableView, ShiftTAb: to input
            // TODO: aks, who has the focus, then shift focus
                let focusElement = document.activeElement.closest("#leftView")
                if (focusElement)
                    console.log("leftView")
                focusElement = document.activeElement.closest("#rightView")
                if (focusElement)
                    console.log("rightView")
                evt.stopPropagation()
                evt.preventDefault()
                break
        }
    }

    private onRatioChanged() {
        this.leftView.onResize()
        this.rightView.onResize()
    }
}
