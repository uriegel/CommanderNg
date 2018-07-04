import { Component, Output, EventEmitter, ViewChild } from '@angular/core'
import { CommanderViewComponent } from '../commander-view/commander-view.component';

// TODO: replace button with menu command
// TODO: status bar with binding to current item in current list

@Component({
  selector: 'app-commander',
  templateUrl: './commander.component.html',
  styleUrls: ['./commander.component.css']
})
export class CommanderComponent {

    @ViewChild("leftView") leftView: CommanderViewComponent
    @ViewChild("rightView") rightView: CommanderViewComponent

    isViewVisible = false

    private onClick() { this.isViewVisible = !this.isViewVisible }

    private onRatioChanged() {
        this.leftView.onResize()
        this.rightView.onResize()
    }
}
