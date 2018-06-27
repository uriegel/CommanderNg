import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Observable, Subscriber, from } from 'rxjs'
import { map } from 'rxjs/operators'
import { Addon } from "../../addon"
import { ScrollbarComponent as ScrollBar  } from "../../scrollbar/scrollbar.component"

// TODO: getDirectory and select scrolled item
//
// TODO:
// TableViewComponent:
// <ng-container *ngFor="let item of items | virtualList: scrollbar |async" [ngSwitch]="item.type">

// items: Observable<IItem[]> 

interface Item {
    text: string
    isCurrent: boolean
}

@Component({
  selector: 'app-test-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements OnInit {

    @ViewChild(ScrollBar) private scrollBar: ScrollBar
    items: Observable<Item[]>

    ngOnInit() {
        this.items = new Observable<Item[]>(displayObserver => this.displayObserver = displayObserver ).pipe(map(t => {
            this.itemValues = t
            return t
        }))
    }

    private onNew() {
        const index = this.seed++ % 3
        const dir = this.dirs[index]
        const result = this.get(dir)
        result.subscribe(value => this.displayObserver.next(value.map((n, i) => { return {
            text: n,
            isCurrent: i == 0
        }})))
    }

    get(path: string): Observable<string[]> { 
        return from(new Promise(
        (res, rej) => this.addon.readDirectory(path, 
            (err, result) => {
                const items = result.map(i => i.name)
                res(items)
            })
        ))
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
                this.end()
                break
            case 36: //Pos1
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

    private getCurrentIndex(defaultValue?: number) { 
        const index = this.itemValues.findIndex(n => n.isCurrent) 
        if (index != -1 || defaultValue == null)
            return index
        else
            return defaultValue
    }

    private setCurrentIndex(index: number, lastIndex?: number) {
        if (lastIndex == null) 
            lastIndex = this.getCurrentIndex(0)
        this.itemValues[lastIndex].isCurrent = false
        this.itemValues[index].isCurrent = true
        this.scrollBar.scrollIntoView(index)
    }

    private downOne() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index < this.itemValues.length - 1 ? index + 1 : index
        this.setCurrentIndex(nextIndex, index)
    }

    private upOne() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index > 0 ? index - 1 : index
        this.setCurrentIndex(nextIndex, index)
    }    

    private pageDown() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index < this.itemValues.length - this.scrollBar.itemsCapacity + 1 ? index + this.scrollBar.itemsCapacity - 1: this.itemValues.length - 1
        this.setCurrentIndex(nextIndex, index)
    }

    private pageUp() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index > this.scrollBar.itemsCapacity - 1? index - this.scrollBar.itemsCapacity + 1: 0
        this.setCurrentIndex(nextIndex, index)
    }

    private end() { this.setCurrentIndex(this.itemValues.length - 1) } 
    
    private pos1() { this.setCurrentIndex(0) } 

    private itemValues: Item[]
    private seed = 0
    private dirs = [ "c:\\", "c:\\windows", "c:\\windows\\system32"]
    private addon: Addon = (<any>window).require('addon')
    private displayObserver: Subscriber<Item[]>
}
