import { Component, ViewChild, ElementRef, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Observable, Subject, from, fromEvent, zip } from 'rxjs'
import { filter } from 'rxjs/operators'
import { ItemProcesserFactoryService } from '../processors/item-processer-factory.service'
import { ItemProcessor } from '../processors/item-processor'
import { IColumnSortEvent, IColumns } from '../columns/columns.component'
import { IItem, TableViewComponent } from '../table-view/table-view.component'

// TODO: Don't use nativeElement input, use binding
// TODO: SortOrder: switch off when name ascending

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css'],
    animations: [
        trigger('flyInOut', [
            state('in', style({
                opacity: 0,
                width: '0%',
                height: '0px'    
            })),
            transition(":enter", [
                style({
                    opacity: 0,
                    width: '0%',
                    height: '0px'    
                }),
                animate("0.3s ease-out", style({
                    opacity: 1,
                    width: '70%',
                    height: '15px'
                }))
            ]),
            transition(':leave', [
                animate("0.3s ease-in", style({
                    opacity: 0,
                    width: '0%',
                    height: '0px'    
                }))
            ])
        ])    
    ]
})
export class CommanderViewComponent implements OnInit, AfterViewInit {

    @ViewChild(TableViewComponent) private tableView: TableViewComponent
    @ViewChild("input") private input: ElementRef
    @Output() private gotFocus: EventEmitter<CommanderViewComponent> = new EventEmitter()    
    @Input() id: string
    @Input() columns: IColumns = { name: "nil", columns: []}
    @Input()
    get path() { return this._path }
    set path(value: string) {
        this.restrictingOffs.next()
        if (value.endsWith('\\'))
            value = value.substr(0, value.length - 1)
        const itemProcessor = this.processorFactory.get(this.itemProcessor, this, value)
        if (itemProcessor) {
            this.itemProcessor = itemProcessor
            this.columns = this.itemProcessor.columns
            this.columnSort = null
        }
        this.setItems(this.itemProcessor.get(value, this.path))
        this._path = value
    }
    private _path: string
    items: Observable<IItem[]>     

    restrictValue = ""

    ngOnInit() { this.path = "drives" }
    ngAfterViewInit() { 
        this.keyDownEvents = fromEvent(this.tableView.table.nativeElement, "keydown") 
        this.initializeRestrict() 
    }

    constructor(private processorFactory: ItemProcesserFactoryService) { }

    focus() { this.tableView.focus() }

    focusDirectoryInput() { 
        this.input.nativeElement.focus() 
        this.input.nativeElement.select()
    }

    onResize() { this.tableView.onResize() }

    private refresh() { this.path = this.path }

    private onFocus() { this.focus() }

    private onFocusIn(evt: Event) { this.gotFocus.emit(this) }

    private onInputChange() {
        this.path = this.input.nativeElement.value
        this.tableView.focus()
        console.log("Input return")
    }

    private onKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 13: // Return
                this.processItem()
                console.log("return")
                break
            case 32: // _                
                this.toggleSelection(this.tableView.getCurrentItem())
                break
            case 35: // End
                if (evt.shiftKey) 
                    this.selectAllItems(this.tableView.getCurrentItemIndex(), false)
                break
            case 36: // Pos1
                if (evt.shiftKey) 
                    this.selectAllItems(this.tableView.getCurrentItemIndex(), true)
                break                
            case 45: // Einfg
                if (this.toggleSelection(this.tableView.getCurrentItem()))
                    this.tableView.downOne()
                break;
            case 82: // r
                if (evt.ctrlKey) 
                    this.refresh()
                break;
            case 107: // NUM +
                this.selectAllItems(0, false)
                break
            case 109: // NUM -
                this.selectAllItems(0, true)
                break                
        }
    }

    private selectAllItems(currentItemIndex: number, above: boolean) {
        this.tableView.getAllItems().forEach((item, index) => {
            item.isSelected = above ? index <= currentItemIndex : index >= currentItemIndex ? this.isItemSelectable(item) : false
        })
    }

    private toggleSelection(item: IItem) {
        if (this.isItemSelectable(item)) {
            item.isSelected = !item.isSelected
            return true
        }
        else
            return false
    }

    private isItemSelectable(item: IItem) {
        switch (item.type) {
            case 0:
            case 1:
                return true
            default:
                return false
        }
    }

    private onClick(evt: MouseEvent) { 
        if (evt.ctrlKey && (evt.target as HTMLElement).closest("td"))  
            this.toggleSelection(this.tableView.getCurrentItem())
    }

    private onDblClick(evt: MouseEvent) { 
        if ((evt.target as HTMLElement).closest("td")) 
            this.processItem() 
    }

    private onColumnSort(evt: IColumnSortEvent) {
        this.columnSort = evt
        this.setItems(this.items)
    }

    private processItem() {
        const item = this.tableView.getCurrentItem()
        if (item)
            this.itemProcessor.process(item)
    }

    private setItems(items: Observable<IItem[]>) {
        if (!this.columnSort)
            this.items = items
        else {
            const subscription = (items as Observable<IItem[]>).subscribe({next: value => {
                subscription.unsubscribe()
                this.items = from(new Promise<IItem[]>(res => res(this.itemProcessor.sort(value, this.columnSort.index, this.columnSort.ascending))))
            }})
        }
    }

    private initializeRestrict() {
        const inputChars = this.keyDownEvents.pipe(filter(n => !n.altKey && !n.ctrlKey && !n.shiftKey && n.key.length > 0 && n.key.length < 2))
        const backSpaces = this.keyDownEvents.pipe(filter(n => n.which == 8))
        const escapes = this.keyDownEvents.pipe(filter(n => n.which == 27))
        const items = new Subject<IItem[]>()
        const backItems = new Subject<IItem[]>()
        let originalItems: Observable<IItem[]>
        
        inputChars.subscribe(n => {
            const subscription = this.items.subscribe(n => {
                items.next(n)
                subscription.unsubscribe()
            })
        })
        backSpaces.subscribe(n => {
            const subscription = originalItems.subscribe(n => {
                backItems.next(n)
                subscription.unsubscribe()
            })
        })

        const undoRestriction = () => {
            if (originalItems) {
                this.setItems(originalItems)
                originalItems = null
                this.restrictValue = ""
            }
        }

        const restictedValue = zip(inputChars, items, (char, itemArray) => {
            const result = {
                char: char.key,
                items: itemArray.filter(n => n.name.toLowerCase().startsWith(this.restrictValue + char.key))
            }
            if (result.items.length > 0 && !result.items.find(n => n.isCurrent)) {
                itemArray.forEach(n => n.isCurrent = false)
                result.items[0].isCurrent = true
            }
            return result
        })
        restictedValue.subscribe(n => {
            if (n.items.length > 0) {
                this.restrictValue += n.char
                if (!originalItems)
                    originalItems = this.items
                this.items = from(new Promise<IItem[]>(res => res(n.items)))
            }
        })

        const back = zip(backSpaces, backItems, (char, itemArray) => {
            if (this.restrictValue.length > 0) {
                this.restrictValue = this.restrictValue.substr(0, this.restrictValue.length - 1)
                return itemArray.filter(n => n.name.toLowerCase().startsWith(this.restrictValue))
            }
        })
        back.subscribe(n => {
            if (this.restrictValue.length == 0)
                undoRestriction()
            else if (n.length > 0) 
                this.setItems(from(new Promise<IItem[]>(res => res(n))))
        })

        this.restrictingOffs.subscribe(() => undoRestriction())
        escapes.subscribe(() => undoRestriction())
    }

    private readonly restrictingOffs = new Subject()
    private columnSort: IColumnSortEvent = null
    private keyDownEvents: Observable<KeyboardEvent>
    private itemProcessor: ItemProcessor
}
