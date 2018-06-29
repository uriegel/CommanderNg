import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core'
import { ItemProcesserFactoryService } from '../processors/item-processer-factory.service'
import { ItemProcessor } from '../processors/item-processor'
import { IColumnSortEvent, IColumns } from '../columns/columns.component'
import { Observable, Subject, from } from 'rxjs'
import { IItem, TableViewComponent } from '../table-view/table-view.component'
// TODO: FileProcessor: Sorting by selected column
// TODO: Don't use nativeElement input, use binding
// Restricting items
// TODO: Selecting with Mouse anf Keyboard

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements OnInit {

    @ViewChild(TableViewComponent) private tableView: TableViewComponent
    @ViewChild("input") private input: ElementRef
    @Input() id: string
    @Input() columns: IColumns = { name: "nil", columns: []}
    @Input()
    get path() { return this._path }
    set path(value: string) {
        if (value.endsWith('\\'))
            value = value.substr(0, value.length - 1)
        const itemProcessor = this.processorFactory.get(this.itemProcessor, this, value)
        if (itemProcessor) {
            this.itemProcessor = itemProcessor
            this.columns = this.itemProcessor.columns
        }
        this.items = this.itemProcessor.get(value, this.path)
        this._path = value
    }
    private _path: string
    items: Observable<IItem[]>     

    ngOnInit() {
        this.path = "drives"
    }

    constructor(private processorFactory: ItemProcesserFactoryService) { }

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
        const subscription = (this.items as Observable<IItem[]>).subscribe({next: value => {
            subscription.unsubscribe()
            this.items = from(new Promise<IItem[]>(res => res(this.itemProcessor.sort(value, evt.index, evt.ascending))))
        }})
    }

    private processItem() {
        const item = this.tableView.getCurrentItem()
        if (item)
            this.itemProcessor.process(item)
    }

    private itemProcessor: ItemProcessor
}
