import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { ScrollbarComponent as Scrollbar } from '../scrollbar/scrollbar.component'
import { ColumnsComponent as Columns, IColumns, IColumnSortEvent } from '../columns/columns.component'

export enum ItemType {
    File,
    Directory,
    Drive,
    Parent
}

export interface IItem {
    name: string
    isSelected?: boolean
    isCurrent?: boolean
    type: ItemType
}

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent {

    @Input() private id: string 
    @Input() itemHeight = 0
    @Output() private onSort: EventEmitter<IColumnSortEvent> = new EventEmitter()    
    @Output() private onCurrentIndexChanged: EventEmitter<Number> = new EventEmitter()    
    @ViewChild("table") table: ElementRef
    @ViewChild(Scrollbar) private scrollbar: Scrollbar
    @ViewChild(Columns) private columnsControl: Columns
    @Input() path: string
    @Input() 
    get columns() { return this._columns }
    set columns(value: IColumns) {
        this._columns = value
        this.setColumnsInControl()
    }
    private _columns: IColumns
    @Input() 
    get items() : object { return this._items }
    set items(value: object) {
        this._items = value as Observable<IItem[]>
        if (this._items) {
            const subscription = this._items.subscribe({ 
                next: value => {
                    this.tableViewItems = value
                    subscription.unsubscribe()
                }
            })
            setTimeout(() => this.onCurrentIndexChanged.emit(0), 200)
        }
    }
    private _items: Observable<IItem[]>

    focus() { this.table.nativeElement.focus() }

    getCurrentItemIndex() { return this.getCurrentIndex() }

    getCurrentItem() {
        const index = this.getCurrentIndex()
        if (index != -1)
            return this.tableViewItems[index]
        else
            return null
    }

    getAllItems() { return this.tableViewItems }

    downOne() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index < this.tableViewItems.length - 1 ? index + 1 : index
        this.setCurrentIndex(nextIndex, index)
    }

    onResize() { this.scrollbar.onResize() }

    onKeyDown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 33:
                this.pageUp()
                break
            case 34:
                this.pageDown()
                break
            case 35: // End
                if (!evt.shiftKey)
                    this.end()
                break
            case 36: //Pos1
                if (!evt.shiftKey)
                    this.pos1()
                break
            case 38:
                this.upOne()
                break
            case 40:
                this.downOne()
                break
            default:
                return // exit this handler for other keys
        }
        evt.preventDefault() // prevent the default action (scroll / move caret)
    }

    onMouseDown(evt: MouseEvent) {
        const tr = <HTMLTableRowElement>(<HTMLElement>evt.target).closest("tbody tr")
        if (tr) {
            const currentIndex = Array.from(this.table.nativeElement.querySelectorAll("tr"))
                .findIndex(n => n == tr) + this.scrollbar.getPosition() - 1
            if (currentIndex != -1)
                this.setCurrentIndex(currentIndex)
        }
    }

    onColumnSort(sortEvent: IColumnSortEvent) {
        this.onSort.emit(sortEvent)
    }

    private getCurrentIndex(defaultValue?: number) { 
        const index = this.tableViewItems.findIndex(n => n.isCurrent) 
        if (index != -1 || defaultValue == null)
            return index
        else
            return defaultValue
    }

    private setCurrentIndex(index: number, lastIndex?: number) {
        if (lastIndex == null) 
            lastIndex = this.getCurrentIndex(0)
        this.tableViewItems[lastIndex].isCurrent = false
        this.tableViewItems[index].isCurrent = true
        this.scrollbar.scrollIntoView(index)
        this.onCurrentIndexChanged.emit(index)
    }

    private upOne() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index > 0 ? index - 1 : index
        this.setCurrentIndex(nextIndex, index)
    }

    private pageDown() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index < this.tableViewItems.length - this.scrollbar.itemsCapacity + 1 ? index + this.scrollbar.itemsCapacity - 1: this.tableViewItems.length - 1
        this.setCurrentIndex(nextIndex, index)
    }

    private pageUp() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index > this.scrollbar.itemsCapacity - 1? index - this.scrollbar.itemsCapacity + 1: 0
        this.setCurrentIndex(nextIndex, index)
    }

    private end() { this.setCurrentIndex(this.tableViewItems.length - 1) } 
    
    private pos1() { this.setCurrentIndex(0) } 

    private setColumnsInControl() {
        if (this.columnsControl && this.columns) {
            const columns = {
                name: `${this.id}-${this.columns.name}`,
                columns: this.columns.columns
            }
            this.columnsControl.columns = columns
        }
    }

    private tableViewItems: IItem[]
}
