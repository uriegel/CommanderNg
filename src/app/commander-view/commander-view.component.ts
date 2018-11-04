import { Component, ViewChild, ElementRef, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Observable, Subject, from, fromEvent, zip } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { IColumnSortEvent } from '../columns/columns.component'
import { TableViewComponent } from '../table-view/table-view.component'
import { DialogComponent } from '../dialog/dialog.component'
import { Buttons } from '../enums/buttons.enum'
import { DialogResultValue } from '../enums/dialog-result-value.enum'
import { Item, Response, CommanderView, CommanderUpdate, CommanderEvent, ItemType, ColumnsType } from '../model/model'
import { ThemesService } from '../services/themes.service'
import { ConnectionService } from '../services/connection.service'
import { ElectronService } from '../services/electron.service'

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

    // TODO: ExifDate
    // TODO: Restrict Items
    // TODO: icon with caches and the right icon
    @ViewChild(TableViewComponent) private tableView: TableViewComponent
    @ViewChild("input") private input: ElementRef
    @Output() private gotFocus: EventEmitter<CommanderViewComponent> = new EventEmitter()    
    @Input() id: CommanderView
    @Input()
    get path() { return this._path }
    set path(value: string) {
        this.restrictingOffs.next()
        if (value.endsWith('\\'))
            value = value.substr(0, value.length - 1)
        this._path = value
    }
    private _path: string

    @Input()
    set viewEvents(data: string) {
        if (data) {
            const update = JSON.parse(data) as CommanderUpdate
            if (update.updateItems) {
                const items = this.tableView.getAllItems()
                if (items) {
                    if (update.updateItems.length > 0) {
                        update.updateItems.forEach(n => {
                            var item = items.find(m => m.index == n.index)
                            item.items[n.columnIndex] = n.value
                        })
                        if (this.columnSort && (this.tableView.columns.values[this.columnSort.index].columnsType == ColumnsType.Version
                                || this.tableView.columns.values[this.columnSort.index].columnsType == ColumnsType.Date))
                            this.refreshItems()
                    }
                }
            }
        }
    }    

    @Input()
    set showHidden(value: boolean) {
        this._showHidden = value
        this.refreshItems()
    }
    get showHidden() { return this._showHidden }
    private _showHidden = false

    response: Observable<Response>
    items: Item[]

    currentItem: Item

    restrictValue = ""

    ngOnInit() { this.path = "drives" }
    ngAfterViewInit() { 

        this.refresh()

        this.keyDownEvents = fromEvent(this.tableView.table.nativeElement, "keydown") 
        this.initializeRestrict() 
    }

    constructor(public themes: ThemesService, private connection: ConnectionService, private electron: ElectronService) {
        this.connection.commanderEvents.subscribe(evt => {
            const commanderEvent: CommanderEvent = JSON.parse(evt)
            if (commanderEvent.refresh)
                this.refresh()
        })
    }

    focus() { this.tableView.focus() }

    focusDirectoryInput() { 
        this.input.nativeElement.focus() 
        this.input.nativeElement.select()
    }

    onResize() { this.tableView.onResize() }

    refresh() { 
        this.reconnectObservables(from(this.connection.get(this.id)))
    }

    getSelectedItems() {
        const items = this.tableView.getAllItems().filter(n => n.isSelected)
        if (items.length > 0)
            return items;
//        if (this.currentItem.itemType != ItemType.Parent)
//            return [ this.currentItem ]
  //      else
    //        return []
    }

    createFolder(dialog: DialogComponent) {
        // if (this.itemProcessor.canCreateFolder()) {
        //     dialog.buttons = Buttons.OkCancel
        //     dialog.text = "Möchtest Du einen neuen Ordner anlegen?"
        //     dialog.withInput = true
        //     dialog.inputText = this.currentItem.name != ".." ? this.currentItem.name : ""
        //     const subscription = dialog.show().subscribe(result => {
        //         subscription.unsubscribe()
        //         if (result.result == DialogResultValue.Ok) {
        //             const subscription = this.itemProcessor.createFolder(`${this.path}\\${result.text}`)
        //                 .subscribe(obs => {
        //                     subscription.unsubscribe()
        //                     this.refresh()
        //                     this.focus()
        //                 }, err => {
        //                     subscription.unsubscribe()
        //                     switch (err) {
        //                         case 183:
        //                             dialog.text = "Der Ordner existiert bereits!"
        //                             break
        //                         case 123:
        //                             dialog.text = "Die Syntax für den Dateinamen, Verzeichnisnamen oder die Datenträgerbezeichnung ist falsch!"
        //                             break
        //                         case 1223:
        //                             this.focus()    
        //                             return
        //                         default:
        //                             dialog.text = `Fehler: ${err}`
        //                             break
        //                     }
                            
        //                     const subscriptionDialog = dialog.show().subscribe(result => {
        //                         subscriptionDialog.unsubscribe()
        //                         this.focus()
        //                     })
        //                 })
        //         }
        //         else
        //             this.focus()
        //     })
        // }
        // else {
        //     dialog.text = "Du kannst hier keinen Ordner anlegen!"
        //     const subscription = dialog.show().subscribe(() => {
        //         subscription.unsubscribe()
        //         this.focus()
        //     })
        // }
    }

    delete(dialog: DialogComponent) {
        // if (this.itemProcessor.canDelete()) {
        //     var items = this.getSelectedItems()
        //     if (items.length == 0)
        //         return
        //     dialog.buttons = Buttons.OkCancel
        //     dialog.text = "Möchtest Du die selektierten Elemente löschen?"
        //     const subscription = dialog.show().subscribe(result => {
        //         subscription.unsubscribe()
        //         if (result.result == DialogResultValue.Ok) {
        //             const subscription = this.itemProcessor.deleteItems(items.map(n => `${this.path}\\${n.name}`))
        //                 .subscribe(obs => {
        //                     subscription.unsubscribe()
        //                     this.refresh()
        //                     this.focus()
        //                 }, err => {
        //                     subscription.unsubscribe()
        //                     switch (err) {
        //                         default:
        //                             dialog.text = `Fehler: ${err}`
        //                             break
        //                     }
                        
        //                     const subscriptionDialog = dialog.show().subscribe(result => {
        //                         subscriptionDialog.unsubscribe()
        //                         this.focus()
        //                     })
        //                 })
        //         }
        //         else
        //             this.focus()
        //     })
        // }
        // else {
        //     dialog.text = "Du kannst hier keine Elemente löschen!"
        //     const subscription = dialog.show().subscribe(() => {
        //         subscription.unsubscribe()
        //         this.focus()
        //     })
        // }
    }

    onFocus() { this.focus() }

    onFocusIn(evt: Event) { this.gotFocus.emit(this) }

    onInputChange() {
        this.path = this.input.nativeElement.value
        this.tableView.focus()
        console.log("Input return")
    }

    onKeydown(evt: KeyboardEvent) {
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

    private toggleSelection(item: Item) {
        if (this.isItemSelectable(item)) {
            item.isSelected = !item.isSelected
            return true
        }
        else
            return false
    }

    private isItemSelectable(item: Item) {
        // switch (item.itemType) {
        //     case 0:
        //     case 1:
                return true
            // default:
            //     return false
        //}
    }

    onClick(evt: MouseEvent) { 
        if (evt.ctrlKey && (evt.target as HTMLElement).closest("td"))  
            this.toggleSelection(this.tableView.getCurrentItem())
    }

    onDblClick(evt: MouseEvent) { 
        if ((evt.target as HTMLElement).closest("td")) 
            this.processItem() 
    }

    onCurrentIndexChanged(index: number) {
        this.currentItem = this.tableView.getCurrentItem()
    }

    onColumnSort(evt: IColumnSortEvent) {
        this.columnSort = evt
        this.refreshItems()
    }

    private processItem() {
        const index = this.tableView.getCurrentItemIndex()
        this.reconnectObservables(from(this.connection.process(this.id, this.items[index].index)))
    }

    private initializeRestrict() {
        const inputChars = this.keyDownEvents.pipe(filter(n => !n.altKey && !n.ctrlKey && !n.shiftKey && n.key.length > 0 && n.key.length < 2))
        const backSpaces = this.keyDownEvents.pipe(filter(n => n.which == 8))
        const escapes = this.keyDownEvents.pipe(filter(n => n.which == 27))
        const items = new Subject<Item[]>()
        const backItems = new Subject<Item[]>()
        let originalItems: Observable<Item[]>
        
        inputChars.subscribe(n => {
            // const subscription = this.items.subscribe(n => {
            //     items.next(n)
            //     subscription.unsubscribe()
            // })
        })
        backSpaces.subscribe(n => {
            const subscription = originalItems.subscribe(n => {
                backItems.next(n)
                subscription.unsubscribe()
            })
        })

        const undoRestriction = () => {
            if (originalItems) {
                //this.setItems(originalItems)
                originalItems = null
                this.restrictValue = ""
            }
        }

        const restictedValue = zip(inputChars, items, (char, itemArray) => {
            // const result = {
            //     char: char.key,
            //     items: itemArray.filter(n => n.name.toLowerCase().startsWith(this.restrictValue + char.key))
            // }
            // if (result.items.length > 0 && !result.items.find(n => n.isCurrent)) {
            //     itemArray.forEach(n => n.isCurrent = false)
            //     result.items[0].isCurrent = true
            // }
            //return result
        })
        restictedValue.subscribe(n => {
            // if (n.items.length > 0) {
            //     this.restrictValue += n.char
            //     if (!originalItems)
            //         originalItems = this.items
            //     this.items = from(new Promise<Item[]>(res => res(n.items)))
            // }
        })

        const back = zip(backSpaces, backItems, (char, itemArray) => {
            // if (this.restrictValue.length > 0) {
            //     this.restrictValue = this.restrictValue.substr(0, this.restrictValue.length - 1)
            //     return itemArray.filter(n => n.name.toLowerCase().startsWith(this.restrictValue))
            // }
        })
        back.subscribe(n => {
            // if (this.restrictValue.length == 0)
            //     undoRestriction()
            // else if (n.length > 0) 
            //     this.setItems(from(new Promise<Item[]>(res => res(n))))
        })

        this.restrictingOffs.subscribe(() => undoRestriction())
        escapes.subscribe(() => undoRestriction())
    }

    reconnectObservables(observable: Observable<Response>) {
        this.response = observable
        const subscription = this.response.subscribe(obs =>{
            subscription.unsubscribe()
            this.originalItems = obs.items
            this.refreshItems()
        })
    }
    
    private refreshItems() {
        if (this.originalItems) {

            const sortItems = (items: Item[]) => {
                const folders = items.filter(n => n.itemType == ItemType.Parent || n.itemType == ItemType.Directory)
                const itemsToSort = items.filter(n => n.itemType == ItemType.File || n.itemType == ItemType.Drive)

                const compareVersion = (versionLeft?: string, versionRight?: string) => {
                    if (!versionLeft)
                        return -1
                    else if (!versionRight)
                        return 1
                    else {
                        var leftParts = <number[]><any>versionLeft.split('.')
                        var rightParts = <number[]><any>versionRight.split('.')
                        if (leftParts[0] != rightParts[0])
                            return <number>leftParts[0] - rightParts[0]
                        else if (leftParts[1] != rightParts[1])
                            return leftParts[1] - rightParts[1]
                        else if (leftParts[2] != rightParts[2])
                            return leftParts[2] - rightParts[2]
                        else if (leftParts[3] != rightParts[3])
                            return leftParts[3] - rightParts[3]
                        else return 0
                    }
                }

                const sortedItems = itemsToSort.sort((a, b) => {

                    let result = 0
                    switch (this.tableView.columns.values[this.columnSort.index].columnsType) {
                        case ColumnsType.Size:
                            const x = parseInt(a.items[this.columnSort.index])
                            const y = parseInt(b.items[this.columnSort.index])
                            result = x - y
                            break
                        case ColumnsType.Version:
                            result = compareVersion(a.items[this.columnSort.index], b.items[this.columnSort.index])
                            break
                        default:
                            result = a.items[this.columnSort.index].localeCompare(b.items[this.columnSort.index])
                            break
                    }
                        
                    if (result == 0 && this.columnSort.index > 0)
                        result = a.items[0].localeCompare(b.items[0])
                    return this.columnSort.ascending ? result : -result
                })

                return folders.concat(sortedItems)
            }

            const itemsToSort = this.originalItems.filter(n => this.showHidden || !n.isHidden)    
            if (this.columnSort)
                this.items = sortItems(itemsToSort)
            else
                this.items = itemsToSort
        }
    }

    private originalItems: Item[]
    private readonly restrictingOffs = new Subject()
    private columnSort: IColumnSortEvent = null
    private keyDownEvents: Observable<KeyboardEvent>
}
