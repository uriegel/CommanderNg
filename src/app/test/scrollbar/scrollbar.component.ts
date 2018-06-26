import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ScrollbarComponent as Scrollbar } from '../../scrollbar/scrollbar.component'

@Component({
  selector: 'app-test-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements OnInit {

    constructor() { }

    @ViewChild("ul") ul: ElementRef
    @ViewChild(Scrollbar) scrollbar: Scrollbar

    ngOnInit() {
        // this.list = document.getElementById("list") as HTMLUListElement
        // this.itemHeight = this.initializeItemHeight()
        // const capacity = this.calculateCapacity()

        // const lis = [...Array(Math.min(capacity + 1, this.itemsCount)).keys()].map(n => {
        //     const li = document.createElement("li")
        //     li.innerText = `Eintrag #${n}`
        //     return li
        // })
        
        // lis.forEach(n => this.list.appendChild(n))

        this.startResizeChecking()
    }

    startResizeChecking() {
        let recentHeight = 0
    
        window.addEventListener('resize', () => resizeChecking())
        let capacity = this.calculateCapacity()
    
        const resizeChecking = () => {
            console.log(this.ul.nativeElement.clientHeight)
            if (this.ul.nativeElement.clientHeight != recentHeight) {
                recentHeight = this.ul.nativeElement.clientHeight
                let recentCapacity = capacity
                capacity = this.calculateCapacity()
                this.scrollbar.itemsChanged(this.itemsCount, capacity)
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

    private itemsCount = 15
    // TODO: measure
    private readonly itemHeight = 14
    private startPosition = 0
}
