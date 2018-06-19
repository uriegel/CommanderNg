import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[app-columns]',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.css']
})
export class ColumnsComponent implements OnInit {

    constructor() {
        setTimeout(() => {
            this.columns = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado']
        }, 4000)
        setTimeout(() => {
            this.columns = ['Burhan', 'Her Frank', 'Das Küken', 'PQ']
        }, 8000)
    }

    columns = []

    ngOnInit() {
    }

}
