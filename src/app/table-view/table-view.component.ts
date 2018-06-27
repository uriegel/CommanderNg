import { Component, AfterViewInit, ViewChild, ElementRef, TemplateRef, Renderer2, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core'
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

    @Input() id: string 
    @Input() itemHeight: number
    @Output() onSort: EventEmitter<IColumnSortEvent> = new EventEmitter()    
    @ViewChild("table") table: ElementRef
    @ViewChild(Scrollbar) scrollbar: Scrollbar
    @ViewChild(Columns) columnsControl: Columns

    path: string

    get columns() { return this._columns }
    set columns(value: IColumns) {
        this._columns = value
        this.setColumnsInControl()
    }
    private _columns: IColumns

    get itemsView(): Observable<IItem[]> {
        return new Observable<IItem[]>(displayObserver => {
            this.displayObserver = displayObserver
            if (this.tableViewItems) 
                this.displayObserver.next(this.getItemsView())
        })
    }
    get items(): Observable<IItem[]> {
        return this._items
    }
    set items(value: Observable<IItem[]>) {
        this._items = value
        this._items.subscribe({
            next: x => {
                this.tableViewItems = x
                const index = this.getCurrentIndex(0)
                this.setScrollbar(index)
                this.displayObserver.next(this.getItemsView())
            },
            error: err => console.error('Observer got an error: ' + err),
            complete: () => {},
        })
    }
    _items: Observable<IItem[]>

    constructor(private renderer: Renderer2, private ref: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this.setColumnsInControl()
        window.addEventListener('resize', () => this.resizeChecking())
        this.resizeChecking()
        this.setScrollbar()
        this.ref.detectChanges()
    }

    focus() { this.table.nativeElement.focus() }

    getCurrentItem() {
        const index = this.getCurrentIndex()
        if (index != -1)
            return this.tableViewItems[index]
        else
            return null
    }

    private resizeChecking() {
        if (this.table.nativeElement.parentElement.clientHeight != this.recentHeight) {
            const isFocused = this.table.nativeElement.contains(document.activeElement)
            this.recentHeight = this.table.nativeElement.parentElement.clientHeight
            this.calculateViewItemsCount()
            this.setScrollbar()
            this.renderer.setStyle(this.table.nativeElement, "clip", `rect(0px, auto, ${this.recentHeight}px, 0px)`)
            if (isFocused)
                focus()
        }
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
            .findIndex(n => n == tr) + this.scrollPos - 1
        this.setCurrentIndex(currentIndex)
    }

    private onMouseWheel(evt: WheelEvent) {
        var delta = evt.wheelDelta / Math.abs(evt.wheelDelta) * 3
        this.setScrollbar(this.scrollPos - delta)
    }

    private onScroll(pos) {
        this.scrollPos = pos
        this.displayObserver.next(this.getItemsView())
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

        if (index < this.scrollPos)
            this.setScrollbar(index)
        if (index > this.scrollPos + this.tableCapacity - 1)
            this.setScrollbar(index - this.tableCapacity + 1)
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
        const nextIndex = index < this.tableViewItems.length - this.tableCapacity + 1 ? index + this.tableCapacity - 1: this.tableViewItems.length - 1
        this.setCurrentIndex(nextIndex, index)
    }

    private pageUp() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index > this.tableCapacity - 1? index - this.tableCapacity + 1: 0
        this.setCurrentIndex(nextIndex, index)
    }

    private end() { this.setCurrentIndex(this.tableViewItems.length - 1) } 
    
    private pos1() { this.setCurrentIndex(0) } 

    private getItemsView() {
        return this.tableViewItems.filter((n, i) => i >= this.scrollPos && i < this.tableCapacity + 1 + this.scrollPos)
    }

    private calculateViewItemsCount() {
        if (this.itemHeight && this.columnsControl) {
            this.tableCapacity = Math.floor((this.table.nativeElement.parentElement.offsetHeight - this.columnsControl.height) / this.itemHeight) 
            if (this.tableCapacity < 0)
                this.tableCapacity = 0
        }
        else
            this.tableCapacity = -1
    }

    private setScrollbar(newPos?: number) {
        if (this.tableCapacity >= 0)
            this.scrollbar.itemsChanged(this.tableViewItems ? this.tableViewItems.length : 0)
    }

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
    /**
    * Die Anzahl der Einträge, die dieses TableView in der momentanen Größe tatsächlich auf dem Bildschirm anzeigen kann
    */
    private tableCapacity = -1
    private displayObserver: Subscriber<IItem[]>
    private recentHeight = 0
    private scrollPos = 0
}
