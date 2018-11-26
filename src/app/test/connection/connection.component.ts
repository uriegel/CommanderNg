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
    async onGet(url: string) {
        try {
            const response = await this.connection.get(url, url == "root" ? this.recentColumns != "root" : this.recentColumns == "root")
            console.log("Response", response)
            if (response.columns) {
                this.recentColumns = response.columns.name
            }

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

    private recentColumns = ""
}
