import { Component, ViewChild, OnInit } from '@angular/core'
import { Observable, Subscriber, from } from 'rxjs'
import { ScrollbarComponent as ScrollBar  } from "../../scrollbar/scrollbar.component"
import { ConnectionService } from 'src/app/services/connection.service'
import { Item } from 'src/app/model/model'

@Component({
    selector: 'app-test-scrollbar',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements OnInit {

    @ViewChild(ScrollBar) private scrollBar: ScrollBar
    items: Observable<Item[]>
    
    ngOnInit() { this.items = this.get(this.dirs[1]) }

    constructor(private connection: ConnectionService) {}

    onNew() {
        const index = this.seed++ % 3
        const dir = this.dirs[index]
        this.items = this.get(dir)
        this.items.subscribe({
            next: o => this.itemValues = o
        })
    }

    get(path: string): Observable<Item[]> { 
        return from(new Promise(async (res, rej) => {
            let response = await this.connection.get(path)
            res(response.items)
        }))
    }

    onKeyDown(evt: KeyboardEvent) {
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
    private displayObserver: Subscriber<Item[]>
}
