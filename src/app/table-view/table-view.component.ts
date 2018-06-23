import { Component, AfterViewInit, ViewChild, ElementRef, TemplateRef, Renderer2, Output, EventEmitter, Input } from '@angular/core'
import { Observable, Subscriber } from 'rxjs'
import { ScrollbarComponent as Scrollbar } from '../scrollbar/scrollbar.component'
import { ColumnsComponent as Columns, IColumns, IColumnSortEvent } from '../columns/columns.component'

// TODO: instead of Items: any[] Items: IItem: isSelected isCurrent
// TODO: downOne: isCurrent + 1
// TODO: upOne: isCurrent - 1
// TODO: upOne, downOne changes selected ros, then call checkViewable which scroll the view if neccessary
@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements AfterViewInit {

    @Input() id: string 
    @Input() itemsHeight: number
    @Output() onSort: EventEmitter<IColumnSortEvent> = new EventEmitter()    
    @ViewChild("table") table: ElementRef
    @ViewChild(Scrollbar) scrollbar: Scrollbar
    @ViewChild(Columns) columnsControl: Columns

    get columns() { return this._columns }
    set columns(value: IColumns) {
        this._columns = value
        this.setColumnsInControl()
    }
    private _columns: IColumns

    get itemsView(): Observable<any[]> {
        return new Observable<any[]>(displayObserver => {
            this.displayObserver = displayObserver
            if (this.tableViewItems) 
                this.displayObserver.next(this.getItemsView())
        })
    }
    get items(): Observable<any[]> {
        return this._items
    }
    set items(value: Observable<any[]>) {
        this._items = value
        this._items.subscribe({
            next: x => {
                this.tableViewItems = x
                this.tableViewItems[1].isSelected = true
                this.setScrollbar(0)
                this.displayObserver.next(this.getItemsView())
            },
            error: err => console.error('Observer got an error: ' + err),
            complete: () => {},
        })
    }
    _items: Observable<any[]>

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit() {
        this.setColumnsInControl()
        window.addEventListener('resize', () => this.resizeChecking())
        this.resizeChecking()
        this.setScrollbar()
    }

    resizeChecking() {
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

    private getItemsView() {
        return this.tableViewItems.filter((n, i) => i >= this.scrollPos && i < this.tableCapacity + 1 + this.scrollPos)
    }

    private calculateViewItemsCount() {
        if (this.itemsHeight && this.columnsControl) {
            this.tableCapacity = Math.floor((this.table.nativeElement.parentElement.offsetHeight - this.columnsControl.height) / this.itemsHeight) 
            if (this.tableCapacity < 0)
                this.tableCapacity = 0
        }
        else
            this.tableCapacity = -1

        console.log(`die Eitemshöhe: ${this.tableCapacity}`)
    }

    private setScrollbar(newPos?: number) {
        if (this.tableCapacity >= 0)
            this.scrollbar.itemsChanged(this.tableViewItems ? this.tableViewItems.length : 0, this.tableCapacity, newPos)
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

    private tableViewItems: any[]
    /**
    * Die Anzahl der Einträge, die dieses TableView in der momentanen Größe tatsächlich auf dem Bildschirm anzeigen kann
    */
    private tableCapacity = -1
    private displayObserver: Subscriber<Item[]>
    private recentHeight = 0
    private scrollPos = 0
}
