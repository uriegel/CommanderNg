import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { from, Observable } from 'rxjs'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Item, Response, CommanderView, UpdateItem } from '../../model/model'
import { ConnectionService } from 'src/app/services/connection.service'
import { ThemesService } from 'src/app/services/themes.service'
import { TableViewComponent as tableView } from '../../table-view/table-view.component'

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
        // TODO: other events than updateItem not possible
        const updateItems = JSON.parse(data) as UpdateItem[]
        if (updateItems) {
            console.log("view sse", updateItems)
            const items = this.tableView.getAllItems()
            updateItems.forEach(n => {
                // TODO: 4 not fix, but in UpdateItem
                items[n.index].items[4] = n.version
            })
            // TODO: UpdateItem requires an auto incrementing index to update the Subject
        }
    }

    @ViewChild(tableView) tableView: tableView

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
