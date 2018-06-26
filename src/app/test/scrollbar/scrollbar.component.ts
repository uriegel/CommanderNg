import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Observable, Subscriber, from } from 'rxjs'
import { map } from 'rxjs/operators'
import { Addon } from "../../addon"

// TODO: items(get and set): subscribe to get item[], set: on click get filenames from addon via Observable
// TODO: keyboard-control currentItem: scrollIntoView
// TODO: getDirectory and select scrolled item
//
// TODO:
// TableViewComponent:
// <ng-container *ngFor="let item of items | virtualList: scrollbar |async" [ngSwitch]="item.type">

// items: Observable<IItem[]> 


@Component({
  selector: 'app-test-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements OnInit {

    items: Observable<string[]>

    ngOnInit() {
        this.items = new Observable<string[]>(displayObserver => this.displayObserver = displayObserver ).pipe(map(t => {
            this.itemValues = t
            return t
        }))
    }

    private itemValues: string[]

    private seed = 0
    private dirs = [ "c:\\", "c:\\windows", "c:\\windows\\system32"]

    private onNew() {
        const index = this.seed++ % 3
        const dir = this.dirs[index]
        const result = this.get(dir)
        result.subscribe(value => this.displayObserver.next(value))
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
    private displayObserver: Subscriber<string[]>
}
