import { Component, OnInit, ViewChild, NgZone } from '@angular/core'
import { IColumnSortEvent } from '../../columns/columns.component'
import {  Item, Columns } from '../../model/model'
import { ThemesService } from 'src/app/services/themes.service'
import { TableViewComponent as TableView } from '../../table-view/table-view.component'
import { IProcessor, ICommanderView } from 'src/app/interfaces/commander-view'

@Component({
    selector: 'app-test-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit, ICommanderView {

    setColumns(columns: Columns) { 
        this.columns = columns
    }

    itemsChanged(count: number) {
        this.zone.run(() => this.items = JSON.parse(CommanderLeft.getItems(0, count -1)))
    }

    itemType = "item"
    //itemType = "testItem"

    columns: Columns
    items: Item[] = []

    @ViewChild(TableView) tableView: TableView

    constructor(public themes: ThemesService, private zone: NgZone) { 
        commanderViewLeft = this
    }

    ngOnInit() { 
        this.get("root") 
    }

    onNeu() { this.get("c:\\windows\\system32") }

    //onChange() { this.get("c:\\windows") }
    onChange() { this.get("c:\\") }
    //onChange() { this.get("c:\\04 - Brayka Bay") }

    get(path: string) {
        CommanderLeft.changePath(path)
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }
}

declare var CommanderLeft : IProcessor
declare var commanderViewLeft : ICommanderView
