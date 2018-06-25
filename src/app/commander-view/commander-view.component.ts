import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core'
import { TableViewComponent as TableView, IItem } from '../table-view/table-view.component'
import { ItemProcesserFactoryService } from '../processors/item-processer-factory.service'
import { ItemProcessor } from '../processors/item-processor'
// TODO: SwitchToParent: select old folder
// TODO: FileProcessor: Sorting by selected column

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
        this.tableView.items = this.itemProcessor.get(value)
        this._path = value
    }
    private _path: string

    constructor(private processorFactory: ItemProcesserFactoryService) { }

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

    private onDblClick() { this.processItem() }

    private processItem() {
        const item = this.tableView.getCurrentItem()
        if (item)
            this.itemProcessor.process(item)
    }

    private itemProcessor: ItemProcessor
}
