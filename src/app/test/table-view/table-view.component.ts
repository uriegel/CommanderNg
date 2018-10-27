import { Component, OnInit, Input } from '@angular/core'
import { from, Observable } from 'rxjs'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Item, Response, CommanderView, UpdateItem } from '../../model/model'
import { ConnectionService } from 'src/app/services/connection.service'
import { ThemesService } from 'src/app/services/themes.service'

@Component({
    selector: 'app-test-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {

    itemType = "item"
    //itemType = "testItem"

    response: Observable<Response>

    @Input()
    set viewEvents(data: string) {
        const value = JSON.parse(data)
        console.log("view sse", value)
    }

    constructor(public themes: ThemesService, private connection: ConnectionService) {
        this.response = from(this.connection.get(CommanderView.Left))
    }

    ngOnInit() { }

    onNeu() {
        this.response = from(this.connection.get(CommanderView.Left, "c:\\windows\\system32"))
    }

    onChange() {
        this.response = from(this.connection.get(CommanderView.Left, "c:\\windows"))
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }
}
