import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core'
import { ItemProcesserFactoryService } from '../processors/item-processer-factory.service'
import { ItemProcessor } from '../processors/item-processor'
import { IColumnSortEvent, IColumns } from '../columns/columns.component'
import { Observable, Subject, from } from 'rxjs'
import { IItem, TableViewComponent } from '../table-view/table-view.component'
// TODO: Restricting items
// TODO: RestricterComponent, ngIf restricterActive, when first char typed
// TODO: RestricterComponent: Animation
// TODO: RestricterComponent: onkeyboard, binding to commanderview
// TODO: Selecting with mouse and keyboard
// TODO: Don't use nativeElement input, use binding

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

    restrictValue = ""

    ngOnInit() {
        this.path = "drives"
    }

    constructor(private processorFactory: ItemProcesserFactoryService) { }

    focus() { this.tableView.focus() }

    private onFocus() {
        this.focus()
    }

    private onInputKeydown(evt: KeyboardEvent) {
        if (evt.which == 13) { // Return
            this.path = this.input.nativeElement.value
            this.tableView.focus()
        }
    }

    private onTableKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 13: // Return
                this.processItem()
                break
            case 8: // BACKSPACE
                if (this.restrictValue.length > 0) {
                    this.restrictValue = this.restrictValue.substring(0, this.restrictValue.length - 1)
                }
                break
        }
    }

    private onDblClick(evt: MouseEvent) { 
        if ((evt.target as HTMLElement).closest("td")) 
            this.processItem() 
    }

    private onKeyPress(evt: KeyboardEvent) {
        this.restrictValue += String.fromCharCode(evt.charCode).toLowerCase()
        
        // const [items] = this.tableView.getItemsToSort()
        // if (this.restrict(items, restrict))
        //     this.checkRestrict(restrict)
        // if (!this.tableView.focus())
        //     this.tableView.pos1()
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
