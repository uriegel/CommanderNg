import { Pipe, PipeTransform } from '@angular/core'
import { Observable, Subscriber } from 'rxjs'
import { ScrollbarComponent } from '../scrollbar/scrollbar.component'

// TODO: Anpassung bei ItemsChanged
// TODO: ensureVisible
@Pipe({
    name: 'virtualList'
})
export class VirtualListPipe implements PipeTransform {
    transform(value: Observable<any[]>, scrollbar: ScrollbarComponent) {
        this.source = value
        if (!this.scrollbar) {
            this.scrollbar = scrollbar
            this.scrollbar.positionChanged.subscribe((position, _) => {
                console.log(`Position changed: ${this.scrollbar.maxItemsToDisplay}`)        
                this.displayObserver.next(this.getViewItems(position))
            })
        }
        return new Observable<any[]>(displayObserver => {
            this.displayObserver = displayObserver
            this.source.subscribe(value => {
                this.items = value
                this.scrollbar.position = 0
                this.scrollbar.itemsChanged(this.items.length)
                console.log(`Items changed: ${this.items.length}`)        
                this.displayObserver.next(this.getViewItems(this.scrollbar.position))
            })
        })
    }

    private getViewItems(position: number) {        
        console.log(`this.scrollbar.itemsCapacity: ${this.scrollbar.maxItemsToDisplay}`)
        return this.items.filter((_, i) => i >= position && i < this.scrollbar.maxItemsToDisplay + 1 + position)
    }

    private displayObserver: Subscriber<any[]>
    private source: Observable<any[]>
    private items: any[]
    private scrollbar: ScrollbarComponent
}
