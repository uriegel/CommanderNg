import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { ScrollbarComponent as Scrollbar } from '../scrollbar/scrollbar.component'
import { ColumnsComponent as IColumnSortEvent } from '../columns/columns.component'
import { Response, Item, Columns } from '../model/model'

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent {

    // TODO: ItemHeight in Theme, setItemHeight initial and when theme changes
    // TODO: TData: row: Binding an ColumnsControl, ngFor, erste Spalte IconView, alle anderen strings, mit Binding von Classes, sind im ColumnsControl
    // TODO: F#-Commander liefert nur ein Array von aufbereiteten Strings

    @Input() itemHeight = 0
    @Input() itemType: string
    @Output() private onSort: EventEmitter<IColumnSortEvent> = new EventEmitter()    
    @Output() private onCurrentIndexChanged: EventEmitter<Number> = new EventEmitter()    
    @ViewChild("table") table: ElementRef
    @ViewChild(Scrollbar) private scrollbar: Scrollbar
    @ViewChild("tbody")
    
    @Input()
    columns: Columns

    @Input() 
    items: Item[]
    
    focus() { this.table.nativeElement.focus() }

    getCurrentItemIndex() { return this.getCurrentIndex() }

    getCurrentItem() {
        const index = this.getCurrentIndex()
        if (index != -1)
            return this.items[index]
        else
            return null
    }

    getAllItems() { return this.items }

    downOne() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index < this.items.length - 1 ? index + 1 : index
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
        const index = this.items.findIndex(n => n.isCurrent) 
        if (index != -1 || defaultValue == null)
            return index
        else
            return defaultValue
    }

    private setCurrentIndex(index: number, lastIndex?: number) {
        if (lastIndex == null) 
            lastIndex = this.getCurrentIndex(0)
        this.items[lastIndex].isCurrent = false
        this.items[index].isCurrent = true
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
        const nextIndex = index < this.items.length - this.scrollbar.itemsCapacity + 1 ? index + this.scrollbar.itemsCapacity - 1: this.items.length - 1
        this.setCurrentIndex(nextIndex, index)
    }

    private pageUp() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index > this.scrollbar.itemsCapacity - 1? index - this.scrollbar.itemsCapacity + 1: 0
        this.setCurrentIndex(nextIndex, index)
    }

    private end() { this.setCurrentIndex(this.items.length - 1) } 
    
    private pos1() { this.setCurrentIndex(0) } 
}
