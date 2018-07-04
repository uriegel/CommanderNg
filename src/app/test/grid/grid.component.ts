import { Component } from '@angular/core'

@Component({
  selector: 'test-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {

    isLastVisible = true

    private onClick() {
        this.isLastVisible = !this.isLastVisible
    }

    private onRatioChanged() {
        console.log("onRatioChanged")
    }
}
