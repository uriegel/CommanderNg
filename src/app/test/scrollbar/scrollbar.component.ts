import { Component, ViewChild, ElementRef } from '@angular/core'
import { ScrollbarComponent as Scrollbar } from '../../scrollbar/scrollbar.component'
import { Observable, Subscriber } from 'rxjs';

// TODO: items(get and set): subscribe to get item[], set: on click get filenames from addon via Observable
// TODO: bind ul.nativeElement.clientHeight
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
export class ScrollbarComponent {

    @ViewChild("ul") ul: ElementRef
    @ViewChild(Scrollbar) scrollbar: Scrollbar

    get items(): Observable<string[]> { 
        return new Observable<string[]>(displayObserver => {
            this.displayObserver = displayObserver
            this.displayObserver.next(this.itemsArray)
        }) 
    }

    private seed = 0

    private onNew() {
        const count = Math.floor((Math.random() * 10)) + 15
        this.itemsArray = Array.from(Array(count).keys()).map(n => `Item #${n} - ${n + this.seed}`)
        this.seed += count
        this.scrollbar.itemsChanged(this.itemsArray.length)
        this.displayObserver.next(this.itemsArray)
    }

    private displayObserver: Subscriber<string[]>
    private itemsArray: string[] = []
}
