import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { TableViewComponent as TableView, IItem } from '../table-view/table-view.component'
import { ItemProcesserFactoryService } from '../processors/item-processer-factory.service'
import { ItemProcessor } from '../processors/item-processor'

// TODO: set path from directoryInput
// TODO: When scrollbar not visible: pos is incorrect
// TODO: FileProcessor: Sorting: ParentComponent, then Dirs, then files

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements AfterViewInit {

    @ViewChild(TableView) private tableView: TableView
    @ViewChild("input") private input: ElementRef

    get path() { return this._path }
    set path(value: string) {
        const itemProcessor = this.processorFactory.get(this.itemProcessor, value)
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

    private onInputKeydown(evt: KeyboardEvent) {
        if (evt.which == 13) { // Return
            this.path = this.input.nativeElement.value
            this.tableView.focus()
        }
    }

    private onInputClick() {  }

    private itemProcessor: ItemProcessor
}
