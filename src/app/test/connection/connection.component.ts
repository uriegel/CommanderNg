import { Component, OnInit } from '@angular/core'
import { ConnectionService } from '../../services/connection.service'
import { CommanderView } from 'src/app/model/model';

@Component({
    selector: 'app-test-connection',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {

    constructor(private connection: ConnectionService) { }

    ngOnInit() {
        this.connection.commanderEvents.subscribe(evt => {
            console.log("Commander event", evt)
        })
    }

    async onStart() {
        if (this.first) {
            this.first = false
            const response = await this.connection.get(CommanderView.Left)
        //  let response = await this.connection.get("/usr/share")
            console.log("Response", response)
        }
        else {
            //const response = await this.connection.get(CommanderView.Left,  "c:\\windows\\system32")
            const response = await this.connection.get(CommanderView.Left,  "c:\\")
            console.log("Response", response)
        }
    }

    private first = true
}
