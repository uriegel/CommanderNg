import { Component, ViewChild, ElementRef, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Observable, Subject, from, fromEvent, zip } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { IColumnSortEvent } from '../columns/columns.component'
import { TableViewComponent } from '../table-view/table-view.component'
import { DialogComponent } from '../dialog/dialog.component'
import { Buttons } from '../enums/buttons.enum'
import { DialogResultValue } from '../enums/dialog-result-value.enum'
import { Item, Response, CommanderView, CommanderUpdate, CommanderEvent } from '../model/model'
import { ThemesService } from '../services/themes.service';
import { ConnectionService } from '../services/connection.service';

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

    // TODO: ShowHidden: filter hidden
    // TODO: Restrict Items, filter hidden
    // TODO: Sort columns
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
                if (items) 
                    update.updateItems.forEach(n => {
                        var item = items.find(m => m.index == n.index)
                        item.items[n.columnIndex] = n.value
                    })
            }
        }
    }    

    response: Observable<Response>
    items: Observable<Item[]>

    currentItem: Item

    restrictValue = ""

    ngOnInit() { this.path = "drives" }
    ngAfterViewInit() { 

        this.refresh()

        this.keyDownEvents = fromEvent(this.tableView.table.nativeElement, "keydown") 
        this.initializeRestrict() 
    }

    constructor(public themes: ThemesService, private connection: ConnectionService) {
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
        
    }

    private processItem() {
        const index = this.tableView.getCurrentItemIndex()
        this.reconnectObservables(from(this.connection.process(this.id, index)))
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
        this.items = 
            this.response
            .pipe(map(n => n.items.filter(n => !n.isHidden)))
    }

    private readonly restrictingOffs = new Subject()
    private columnSort: IColumnSortEvent = null
    private keyDownEvents: Observable<KeyboardEvent>
}
