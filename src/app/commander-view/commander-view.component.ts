import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { TableViewComponent as TableView, IItem } from '../table-view/table-view.component'
import { ItemProcesserFactoryService } from '../processors/item-processer-factory.service'
import { ItemProcessor } from '../processors/item-processor'
import { Addon } from '../addon';
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
        const itemProcessor = this.processorFactory.get(this.itemProcessor, this.path)
        if (itemProcessor) {
            this.itemProcessor = itemProcessor
            this.tableView.columns = this.itemProcessor.columns
        }
        this.tableView.items = from(new Promise((res, rej) => 
            this.addon.getDrives((err, result) => res(result))))
    }

    private readonly addon: Addon = (<any>window).require('addon')
    private itemProcessor: ItemProcessor
}
