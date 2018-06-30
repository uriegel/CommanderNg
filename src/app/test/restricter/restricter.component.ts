import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'test-restricter',
  templateUrl: './restricter.component.html',
  styleUrls: ['./restricter.component.css']
})
export class RestricterComponent implements OnInit {

    restrictMode = false
    items = [...Array(35).keys()]

    constructor() { }

    ngOnInit() {}

    private onKeyDown(evt: KeyboardEvent) {
        this.restrictMode = true
    }
}
