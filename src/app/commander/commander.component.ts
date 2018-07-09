import { Component, ViewChild, OnInit, NgZone, HostListener, AfterViewInit, Input } from '@angular/core'
import { CommanderViewComponent } from '../commander-view/commander-view.component'
import { SettingsService } from '../services/settings.service'
import { DialogComponent } from '../dialog/dialog.component'
const { ipcRenderer } = (<any>window).require('electron')

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

    constructor(private zone: NgZone, private settings: SettingsService) {}

    ngOnInit() {
        ipcRenderer.on("viewer", (_: any, on: boolean) => this.zone.run(() => this.isViewVisible = on))
        ipcRenderer.on("refresh", (_: any) => this.zone.run(() => this.focusedView.refresh()))
        ipcRenderer.on("setShowHidden", (_: any, on: boolean) => {
            this.settings.showHidden = on
            this.zone.run(() => {
                this.leftView.refresh()
                this.rightView.refresh()
            })
        })
        ipcRenderer.on("createFolder", (_: any) => this.zone.run(() => this.focusedView.createFolder(this.dialog)))
        ipcRenderer.on("delete", (_: any) => this.zone.run(() => this.focusedView.delete(this.dialog)))
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
                } else {
                    if (this.focusedView == this.leftView) 
                        this.leftView.focusDirectoryInput()
                    else
                        this.rightView.focusDirectoryInput()
                }
                evt.stopPropagation()
                evt.preventDefault()
                break
        }
    }

    private gotFocus(view: CommanderViewComponent) { 
        this.focusedView = view 
        console.log(this.focusedView.id)
    }

    private onRatioChanged() {
        this.leftView.onResize()
        this.rightView.onResize()
    }
}
