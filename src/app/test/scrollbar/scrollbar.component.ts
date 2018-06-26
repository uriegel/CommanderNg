import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { ScrollbarComponent as Scrollbar } from '../../scrollbar/scrollbar.component'
import { Observable, Subscriber } from 'rxjs'
import { map } from 'rxjs/operators'

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

    @ViewChild("ul") ul: ElementRef
    @ViewChild(Scrollbar) scrollbar: Scrollbar

    items: Observable<string[]>

    ngOnInit() {
        this.items = new Observable<string[]>(displayObserver => this.displayObserver = displayObserver ).pipe(map(t => {
            this.itemValues = t
            return t
        }))
    }

    private itemValues: string[]

    private seed = 0

    private onNew() {

        const count = Math.floor((Math.random() * 10)) + 15
        const itemsArray = Array.from(Array(count).keys()).map(n => `Item #${n} - ${n + this.seed}`)
        this.seed += count
        this.scrollbar.itemsChanged(itemsArray.length)
        this.displayObserver.next(itemsArray)
    }

    private displayObserver: Subscriber<string[]>
}
