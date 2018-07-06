import { Component, ViewChild, OnInit, NgZone, HostListener, AfterViewInit } from '@angular/core'
import { CommanderViewComponent } from '../commander-view/commander-view.component'
const { ipcRenderer } = (<any>window).require('electron')

@Component({
    selector: 'app-commander',
    templateUrl: './commander.component.html',
    styleUrls: ['./commander.component.css']
})
export class CommanderComponent implements OnInit, AfterViewInit {

    @ViewChild("leftView") leftView: CommanderViewComponent
    @ViewChild("rightView") rightView: CommanderViewComponent

    focusedView: CommanderViewComponent

    isViewVisible = false

    constructor(private zone: NgZone) {}

    ngOnInit() {
        ipcRenderer.on("viewer", (_: any, on: boolean) => this.zone.run(() => this.isViewVisible = on))
    }

    ngAfterViewInit() { this.leftView.focus() }

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
