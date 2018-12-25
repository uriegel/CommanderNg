import { Component, OnInit } from '@angular/core'
import { ICommanderView } from 'src/app/interfaces/commander-view';

const callerId = "1"

@Component({
    selector: 'app-test-connection',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {

    constructor() {
        CommanderLeft.ready()
    }

    ngOnInit() { }
    
    withColumns: any
    async onGet(url: string) {
        try {
            // if (url == 'root')
            //     var result = await CommanderLeft.test("Affe")
            // else
            //     var result = await CommanderRight.test("Affe")
            //console.log(result)
            // const response = await this.connection.get(callerId, url, this.recentColumns)
            // console.log("Response", response)
            // if (response.columns) {
            //     this.recentColumns = response.columns.name
            // }

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

declare var CommanderLeft : ICommanderView
declare var CommanderRight : ICommanderView