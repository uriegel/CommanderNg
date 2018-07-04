import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-commander',
  templateUrl: './commander.component.html',
  styleUrls: ['./commander.component.css']
})
export class CommanderComponent implements OnInit {

    isLastVisible = true

    constructor() { }

    ngOnInit() { }

    private onClick() {
        this.isLastVisible = !this.isLastVisible
    }
}
