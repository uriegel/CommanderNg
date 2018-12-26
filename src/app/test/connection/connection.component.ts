import { Component, OnInit } from '@angular/core'
import { IProcessor, ICommanderView } from 'src/app/interfaces/commander-view'
import { Columns } from 'src/app/model/model'

const callerId = "1"

@Component({
    selector: 'app-test-connection',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit, ICommanderView {
    constructor() {
        commanderViewLeft = this
        CommanderLeft.ready()
    }

    ngOnInit() { }

    withColumns: any

    setColumns(columns: Columns) {
        console.log("New Columns", columns)
    }

    onGet(url: string) {
        CommanderLeft.get(url)
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
    }
}

declare var CommanderLeft : IProcessor
declare var CommanderRight : IProcessor

declare var commanderViewLeft : ICommanderView