import { Component, AfterViewInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core'
import { TableViewComponent as TableView, IItem } from '../table-view/table-view.component'
import { ItemProcesserFactoryService } from '../processors/item-processer-factory.service'
import { ItemProcessor } from '../processors/item-processor'
import { IColumnSortEvent } from '../columns/columns.component';
// TODO: FileProcessor: Sorting by selected column
// TODO: Don't use nativeElement input, use binding
// TODO: Selecting with Mouse anf Keyboard

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements AfterViewInit {

    @ViewChild(TableView) private tableView: TableView
    @ViewChild("input") private input: ElementRef
    @Input() id: string

    get path() { return this._path }
    set path(value: string) {
        if (value.endsWith('\\'))
            value = value.substr(0, value.length - 1)
        const itemProcessor = this.processorFactory.get(this.itemProcessor, this, value)
        if (itemProcessor) {
            this.itemProcessor = itemProcessor
            this.tableView.columns = this.itemProcessor.columns
        }
        this.tableView.path = value
        this.tableView.items = this.itemProcessor.get(value, this.path)
        this._path = value
    }
    private _path: string

    // TODO: with Observables per viewitem
    constructor(private processorFactory: ItemProcesserFactoryService, private ref: ChangeDetectorRef) { 
        setInterval(() => ref.markForCheck(), 500) 
    }

    ngAfterViewInit() { this.path = "drives" }

    focus() { this.tableView.focus() }

    private onInputKeydown(evt: KeyboardEvent) {
        if (evt.which == 13) { // Return
            this.path = this.input.nativeElement.value
            this.tableView.focus()
        }
    }

    private onTableKeydown(evt: KeyboardEvent) {
        if (evt.which == 13) // Return
            this.processItem()
    }

    private onDblClick(evt: MouseEvent) { 
        if ((evt.target as HTMLElement).closest("td")) 
            this.processItem() 
    }

    private onColumnSort(evt: IColumnSortEvent) {
        console.log(evt)
        const subscription = this.tableView.items.subscribe({next: o => {
            console.log("o", o.length)
            subscription.unsubscribe()
        }})
    }

    private processItem() {
        const item = this.tableView.getCurrentItem()
        if (item)
            this.itemProcessor.process(item)
    }

    private itemProcessor: ItemProcessor
}
