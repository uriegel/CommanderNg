import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core'
import { Observable, Subscriber } from 'rxjs'
import { ScrollbarComponent as Scrollbar } from '../scrollbar/scrollbar.component'
import { ColumnsComponent as Columns, IColumns, IColumnSortEvent } from '../columns/columns.component'

export interface IItem {
    isSelected?: boolean
    isCurrent?: boolean
}

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements AfterViewInit {

    @Input() private id: string 
    @Input() itemHeight = 0
    @Output() private onSort: EventEmitter<IColumnSortEvent> = new EventEmitter()    
    @ViewChild("table") private table: ElementRef
    @ViewChild(Scrollbar) private scrollbar: Scrollbar
    @ViewChild(Columns) private columnsControl: Columns
    /**
     * tbody is binded on this Observable
     */
    get items() { return this._items }
    set items(value: Observable<IItem[]>) {
        this._items = value
        this._items.subscribe({ 
            next: value => {
                this.tableViewItems = value
                this.tableViewItems[2].isCurrent = true
            }
         })
    }
    private _items: Observable<IItem[]>


    path: string

    get columns() { return this._columns }
    set columns(value: IColumns) {
        this._columns = value
        this.setColumnsInControl()
    }
    private _columns: IColumns

//     /**
//      * This Observable represents the call to get the fileItems from addon
//      */
//     get items(): Observable<IItem[]> {
//         return this._items
//     }
//     set items(value: Observable<IItem[]>) {
//         this._items = value

//         this._items.subscribe({
//             next: value => {
//                 this.tableViewItems = value
//                 this.displayObserver.next(value)
//             },
//             complete: () => {
//                 // TODO: select last directory
//             //var sys32 = this.tableViewItems.findIndex(n => n.na.toLowerCase() == "system32")
//             //if (sys32 > 0)
// //                this.setCurrentIndex(sys32)
//                 this.setCurrentIndex(0)
//             }
//         })
//     }
//     _items: Observable<IItem[]>

     //ngOnInit() { this.viewItems = new Observable<IItem[]>(displayObserver => this.displayObserver = displayObserver) }
         
    ngAfterViewInit() { this.setColumnsInControl() }

    focus() { this.table.nativeElement.focus() }

    getCurrentItem() {
        const index = this.getCurrentIndex()
        if (index != -1)
            return this.tableViewItems[index]
        else
            return null
    }

    private onKeyDown(evt: KeyboardEvent) {
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

    private onMouseDown(evt: MouseEvent) {
        const tr = <HTMLTableRowElement>(<HTMLElement>evt.target).closest("tr")
        const currentIndex = Array.from(this.table.nativeElement.querySelectorAll("tr"))
            .findIndex(n => n == tr) + this.scrollbar.getPosition() - 1
        this.setCurrentIndex(currentIndex)
    }

    private onColumnSort(sortEvent: IColumnSortEvent) {
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
    }

    private downOne() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index < this.tableViewItems.length - 1 ? index + 1 : index
        this.setCurrentIndex(nextIndex, index)
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
