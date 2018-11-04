import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { from, Observable } from 'rxjs'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Response, CommanderView, CommanderUpdate, Item } from '../../model/model'
import { ConnectionService } from 'src/app/services/connection.service'
import { ThemesService } from 'src/app/services/themes.service'
import { TableViewComponent as tableView } from '../../table-view/table-view.component'
import { map, filter } from 'rxjs/operators';

@Component({
    selector: 'app-test-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {

    itemType = "item"
    //itemType = "testItem"

    response: Observable<Response>
    items: Observable<Item[]>

    @ViewChild(tableView) tableView: tableView

    constructor(public themes: ThemesService, private connection: ConnectionService) {
        this.reconnectObservables(from(this.connection.get(CommanderView.Left)))
    }

    ngOnInit() { }

    onNeu() {
        this.reconnectObservables(from(this.connection.get(CommanderView.Left, "c:\\windows\\system32")))
    }

    onChange() {
        this.reconnectObservables(from(this.connection.get(CommanderView.Left, "c:\\windows")))
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }

    private reconnectObservables(observable: Observable<Response>) {
        this.response = observable
        this.items = 
            this.response
            //.pipe(map(n => n.items.filter(n => !n.isHidden)))
            .pipe(map(n => n.items))
    }
}
