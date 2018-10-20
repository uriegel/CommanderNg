import { Component, OnInit } from '@angular/core'
import { from, Observable } from 'rxjs'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Item, Response, CommanderView } from '../../model/model'
import { ConnectionService } from 'src/app/services/connection.service'

@Component({
    selector: 'app-test-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {

    response: Observable<Response>

    constructor(private connection: ConnectionService) {
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
