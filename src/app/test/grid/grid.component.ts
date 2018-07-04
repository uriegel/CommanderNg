import { Component, ViewChild } from '@angular/core'
import { CommanderViewComponent } from '../../commander-view/commander-view.component';

@Component({
  selector: 'test-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {

    @ViewChild("leftView") leftView: CommanderViewComponent
    @ViewChild("rightView") rightView: CommanderViewComponent

    isLastVisible = true

    private onClick() {
        this.isLastVisible = !this.isLastVisible
    }

    private onRatioChanged() {
        console.log("onRatioChanged")
    }
}
