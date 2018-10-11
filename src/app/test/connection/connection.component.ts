import { Component, OnInit } from '@angular/core'
import { ConnectionService } from '../../services/connection.service'

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
        let response = await this.connection.get()
        console.log("Response", response)
    }
}
