import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'test-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

    isLastVisible = true

    constructor() { }

    ngOnInit() { }

    private onClick() {
        this.isLastVisible = !this.isLastVisible
    }
}
