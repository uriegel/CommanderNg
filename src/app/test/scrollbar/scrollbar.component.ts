import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Observable, Subscriber, from } from 'rxjs'
import { map } from 'rxjs/operators'
import { Addon } from "../../addon"

// TODO: keyboard-control currentItem: scrollIntoView
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

    items: Observable<Item[]>

    ngOnInit() {
        this.items = new Observable<Item[]>(displayObserver => this.displayObserver = displayObserver ).pipe(map(t => {
            this.itemValues = t
            return t
        }))
    }

    private itemValues: Item[]

    private seed = 0
    private dirs = [ "c:\\", "c:\\windows", "c:\\windows\\system32"]

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
    private addon: Addon = (<any>window).require('addon')
    private displayObserver: Subscriber<Item[]>
}
