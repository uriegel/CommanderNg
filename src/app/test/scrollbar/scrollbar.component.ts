import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
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
export class ScrollbarComponent implements OnInit {

    @ViewChild("ul") ul: ElementRef
    @ViewChild(Scrollbar) scrollbar: Scrollbar

    get items(): Observable<string[]> { 
        return new Observable<string[]>(displayObserver => {
            this.displayObserver = displayObserver
            this.displayObserver.next(this.itemsArray)
        }) 
    }

    ngOnInit() { this.startResizeChecking() }

    private seed = 0

    private onNew() {
        const count = Math.floor((Math.random() * 10)) + 15
        this.itemsArray = Array.from(Array(count).keys()).map(n => `Item #${n} - ${n + this.seed}`)
        this.seed += count
        this.displayObserver.next(this.itemsArray)
    }

    private startResizeChecking() {
        let recentHeight = 0
    
        window.addEventListener('resize', () => resizeChecking())
        let capacity = this.calculateCapacity()
    
        const resizeChecking = () => {
            console.log(this.ul.nativeElement.clientHeight)
            if (this.ul.nativeElement.clientHeight != recentHeight) {
                recentHeight = this.ul.nativeElement.clientHeight
                let recentCapacity = capacity
                capacity = this.calculateCapacity()
                this.scrollbar.itemsChanged(this.itemsArray.length, capacity)
            }
        }
        resizeChecking()
    }

    private onScroll(pos) {
        console.log(pos)
    }
    
    private calculateCapacity() {
        let capacity = Math.floor(this.ul.nativeElement.offsetHeight / this.itemHeight)
        if (capacity < 0)
            capacity = 0
    
        console.log(`Kapazität: ${capacity}`)
        return capacity
    }

    private displayObserver: Subscriber<string[]>
    private itemsArray: string[] = []

    // TODO: measure
    private readonly itemHeight = 14
    private startPosition = 0
}
