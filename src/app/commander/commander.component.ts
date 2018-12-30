import { Component, ViewChild, OnInit, NgZone, HostListener, AfterViewInit, Input } from '@angular/core'
import { CommanderViewComponent } from '../commander-view/commander-view.component'
import { DialogComponent } from '../dialog/dialog.component'
import { IProcessor } from '../interfaces/commander-view';

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

    commanderViewLeft = CommanderLeft
    commanderViewRight = CommanderRight

    constructor(private zone: NgZone) {}

    ngOnInit() { }

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

declare var CommanderLeft : IProcessor
declare var CommanderRight : IProcessor
