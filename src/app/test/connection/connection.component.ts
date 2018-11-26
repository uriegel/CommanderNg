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
        this.connection.serverEvents.subscribe(evt => {
            console.log("Server event", evt)
        })
    }
    withColumns
    async onRoot() {
        try {
            const response = await this.connection.get("root", this.recentColumns != "root")
//            const response = await this.connection.get("c:\\windows")
            //let response = await this.connection.get(++this.recentRequestNr, 111, "/usr/share")
            console.log("Response", response)
            if (response.columns) {
                this.recentColumns = response.columns.name
            }
            //const response = await this.connection.get(CommanderView.Left,  "c:\\windows\\system32")
            //const response = await this.connection.get(CommanderView.Left,  "c:\\")

            //const item = response.items[100]
            //console.log("Name", item.items[0])
            //const jsdate = new Date(parseInt(item.items[2]))
            //console.log("Time", jsdate.toLocaleString([], {hour: '2-digit', minute:'2-digit'}))
            //console.log("Datum", jsdate.toLocaleString([], {day: '2-digit', month: '2-digit', year:'numeric'}))
            //console.log("Response", response)
        } catch (err) {
            console.log("HTTP request failed", err)
        }
    }

    private recentRequestNr = 0
    private recentColumns = ""
}
