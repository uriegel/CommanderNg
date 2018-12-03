import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { from, Observable } from 'rxjs'
import { IColumnSortEvent } from '../../columns/columns.component'
import { Response, Item, CommanderUpdate } from '../../model/model'
import { ConnectionService } from 'src/app/services/connection.service'
import { ThemesService } from 'src/app/services/themes.service'
import { TableViewComponent as TableView } from '../../table-view/table-view.component'
import { map } from 'rxjs/operators';

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
    items: Item[] = []
    
    @Input()
    set viewEvents(evt: CommanderUpdate) {
        if (evt) {
            if (evt.id == callerId) {
                if (evt.updateItems) {
                    const items = this.tableView.getAllItems()
                    if (items) 
                        evt.updateItems.forEach(n => {
                            const item = items.find(m => m.index == n.index)
                            item.items[n.columnIndex] = n.value   
                            item.isExif = n.isExif
                        })
                }
            }
        }
    }

    @ViewChild(TableView) tableView: TableView

    constructor(public themes: ThemesService, public connection: ConnectionService) { this.get("root") }

    ngOnInit() { }

    onNeu() { this.get("c:\\windows\\system32") }

    //onChange() { this.get("c:\\windows") }
    onChange() { this.get("c:\\") }
    //onChange() { this.get("c:\\04 - Brayka Bay") }

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
        this.itemsObservable = 
            this.response
            //.pipe(map(n => n.items.filter(n => !n.isHidden)))
            .pipe(map(n => n.items))
        var subscription = this.itemsObservable.subscribe(items => {
            // TODO: show hidden
            this.items = items
            subscription.unsubscribe()
        })
    }

    private itemsObservable: Observable<Item[]>
}
