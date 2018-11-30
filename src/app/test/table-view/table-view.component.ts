import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { from, Observable } from 'rxjs'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Response, Item } from '../../model/model'
import { ConnectionService } from 'src/app/services/connection.service'
import { ThemesService } from 'src/app/services/themes.service'
import { TableViewComponent as TableView } from '../../table-view/table-view.component'
import { map, filter } from 'rxjs/operators';

// TODO: Show hidden/hide hidden
// TODO: EXIF and Version

const callerId = 1

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

    @ViewChild(TableView) tableView: TableView

    constructor(public themes: ThemesService, private connection: ConnectionService) { this.get("root") }

    ngOnInit() { }

    onNeu() { this.get("c:\\windows\\system32") }

    onChange() { this.get("c:\\windows") }

    get(path: string) {
        this.reconnectObservables(from(this.connection.get(callerId, path, this.withColumns(path))))
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }

    private withColumns(path: string) {
        if (this.tableView)
            return path == "root" ? this.tableView.columnsName != "root" : this.tableView.columnsName == "root"
        else
            return true
    }

    private reconnectObservables(observable: Observable<Response>) {
        this.response = observable
        this.items = 
            this.response
            .pipe(map(n => n.items.filter(n => !n.isHidden)))
            //.pipe(map(n => n.items))
    }
}
