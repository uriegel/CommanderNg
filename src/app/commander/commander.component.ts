import { Component, ViewChild, OnInit, NgZone, HostListener, AfterViewInit, Input } from '@angular/core'
import { CommanderViewComponent } from '../commander-view/commander-view.component'
import { DialogComponent } from '../dialog/dialog.component'
import { ConnectionService } from '../services/connection.service'
import { ElectronService } from '../services/electron.service'

@Component({
    selector: 'app-commander',
    templateUrl: './commander.component.html',
    styleUrls: ['./commander.component.css']
})
export class CommanderComponent implements OnInit, AfterViewInit {

    @ViewChild("leftView") leftView: CommanderViewComponent
    @ViewChild("rightView") rightView: CommanderViewComponent

    @Input() 
    dialog: DialogComponent

    focusedView: CommanderViewComponent

    isViewVisible = false

    constructor(public connection: ConnectionService, public electron: ElectronService, private zone: NgZone) {}

    ngOnInit() {
        this.electron.onCreateFolder.subscribe(() => {
            this.focusedView.createFolder(this.dialog)
        })
        // ipcRenderer.on("viewer", (_: any, on: boolean) => this.zone.run(() => this.isViewVisible = on))
        // ipcRenderer.on("refresh", (_: any) => this.zone.run(() => this.focusedView.refresh()))
        // ipcRenderer.on("delete", (_: any) => this.zone.run(() => this.focusedView.delete(this.dialog)))
    }

    ngAfterViewInit() { setTimeout(() => this.leftView.focus()) }

    @HostListener('keydown', ['$event']) 
    private onKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 9: // tab
                if (!evt.shiftKey) {
                    if (this.focusedView == this.leftView) 
                        this.rightView.focus()
                    else
                        this.leftView.focus()
                } 
                evt.stopPropagation()
                evt.preventDefault()
                break
        }
    }

    gotFocus(view: CommanderViewComponent) { 
        this.focusedView = view 
        console.log(this.focusedView.id)
    }

    onRatioChanged() {
        this.leftView.onResize()
        this.rightView.onResize()
    }
}
