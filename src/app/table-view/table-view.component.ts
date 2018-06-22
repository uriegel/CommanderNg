import { Component, AfterViewInit, ViewChild, ElementRef, TemplateRef, Renderer2 } from '@angular/core'
import { Observable, Subscriber } from 'rxjs'
import { ScrollbarComponent as Scrollbar } from '../scrollbar/scrollbar.component'
import { ColumnsComponent as Columns } from '../columns/columns.component'

export interface Item {
    isDirectory: boolean
    name: string
    ext?: string
    time?: Date
    size?: number
}

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements AfterViewInit {

    @ViewChild("table") table: ElementRef
    @ViewChild(Scrollbar) scrollbar: Scrollbar
    @ViewChild(Columns) columns: Columns

    private scrollPos = 0

    private getDisplayItems() {
        return this.fileItems.filter((n, i) => i >= this.scrollPos && i < 52 + this.scrollPos)
    }

    get displayItems(): Observable<Item[]> {
        console.log("New DisplayItems")
        return new Observable<Item[]>(displayObserver => {
            this.displayObserver = displayObserver
            if (this.fileItems) 
                this.displayObserver.next(this.getDisplayItems())
        })
    }
    get items(): Observable<Item[]> {
        return this._items
    }
    set items(value: Observable<Item[]>) {
        this._items = value
        this._items.subscribe({
            next: x => {
                console.log('Observer got a next value: ' + x)
                this.fileItems = x
                this.displayObserver.next(this.getDisplayItems())
            },
            error: err => console.error('Observer got an error: ' + err),
            complete: () => {
                console.log('Observer got a complete notification')
            },
        })
    }
    _items: Observable<Item[]>

    fileItems: Item[]

    private displayObserver: Subscriber<Item[]>

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit() {
        this.table.nativeElement.tabIndex = 1

        window.addEventListener('resize', () => this.resizeChecking())

        this.columns.columns = {
            name: "Columns",
            columns: [
                { name: "Name", isSortable: true },
                { name: "Erw.", isSortable: true },
                { name: "Datum", isSortable: true },
                { name: "Größe" },
                { name: "Version", isSortable: true }
            ]            
        }

        this.resizeChecking()


        // HACK:
        this.scrollbar.itemsChanged(4000, 100)
    }

    resizeChecking() {
        if (this.table.nativeElement.parentElement.clientHeight != this.recentHeight) {
            const isFocused = this.table.nativeElement.contains(document.activeElement)
            this.recentHeight = this.table.nativeElement.parentElement.clientHeight
            const tableCapacityOld = this.tableCapacity
  //          this.calculateTableHeight()
            // const itemsCountOld = Math.min(tableCapacityOld + 1, this.items.length - this.startPosition)
            // const itemsCountNew = Math.min(this.tableCapacity + 1, this.items.length - this.startPosition)
            // if (itemsCountNew < itemsCountOld) {
            //     for (i = itemsCountOld - 1; i >= itemsCountNew; i--)
            //         this.tbody.children[i].remove()
            // }
            // else
            //     for (var i = itemsCountOld; i < itemsCountNew; i++) {
            //         const node = this.itemsControl.createItem(this.items[i + this.startPosition])
            //         this.tbody.appendChild(node)
            //     }

            // this.scrollbar.itemsChanged(this.items.length, this.tableCapacity)
            this.renderer.setStyle(this.table.nativeElement, "clip", `rect(0px, auto, ${this.recentHeight}px, 0px)`)

            if (isFocused)
                focus()
        }
    }

    private onScroll(pos) {
        this.scrollPos = pos
        this.displayObserver.next(this.getDisplayItems())
    }

    private onSort(ascending: boolean) { alert(ascending) }

    /**
    * Die Anzahl der Einträge, die dieses TableView in der momentanen Größe tatsächlich auf dem Bildschirm anzeigen kann
    */
   private tableCapacity = -1
   private recentHeight = 0
}
