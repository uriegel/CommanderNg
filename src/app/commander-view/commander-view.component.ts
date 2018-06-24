import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { TableViewComponent as TableView, IItem } from '../table-view/table-view.component'
import { ItemProcesserFactoryService } from '../processors/item-processer-factory.service'
import { ItemProcessor } from '../processors/item-processor'
import { from } from 'rxjs';

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements AfterViewInit {

    @ViewChild(TableView) tableView: TableView

    get path() { return this._path }
    set path(value: string) {
        this._path = value
    }
    private _path: string

    constructor(private processorFactory: ItemProcesserFactoryService) { }

    ngAfterViewInit() {
        this.path = "drives"
        this.path = "c:\\windows"
        const itemProcessor = this.processorFactory.get(this.itemProcessor, this.path)
        if (itemProcessor) {
            this.itemProcessor = itemProcessor
            this.tableView.columns = this.itemProcessor.columns
        }
        this.tableView.path = this.path
        this.tableView.items = this.itemProcessor.get(this.path)
    }

    private itemProcessor: ItemProcessor
}
