import { Component, OnInit, ViewChild } from '@angular/core'
import { ScrollbarComponent as Scrollbar } from '../../scrollbar/scrollbar.component'

@Component({
  selector: 'app-test-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements OnInit {

    constructor() { }

    @ViewChild(Scrollbar) scrollbar: Scrollbar

    ngOnInit() {
        this.list = document.getElementById("list") as HTMLUListElement
        this.itemHeight = this.initializeItemHeight()
        const capacity = this.calculateCapacity()

        const lis = [...Array(Math.min(capacity + 1, this.itemsCount)).keys()].map(n => {
            const li = document.createElement("li")
            li.innerText = `Eintrag #${n}`
            return li
        })
        
        lis.forEach(n => this.list.appendChild(n))

        this.startResizeChecking()
    }

    startResizeChecking() {
        let recentHeight = 0
    
        window.addEventListener('resize', () => resizeChecking())
        let capacity = this.calculateCapacity()
    
        const resizeChecking = () => {
            console.log(this.list.clientHeight)
            if (this.list.clientHeight != recentHeight) {
                recentHeight = this.list.clientHeight
                let recentCapacity = capacity
                capacity = this.calculateCapacity()
                this.scrollbar.itemsChanged(this.itemsCount, capacity)
    
                const itemsCountOld = Math.min(recentCapacity + 1, this.itemsCount - this.startPosition)
                const itemsCountNew = Math.min(capacity + 1, this.itemsCount - this.startPosition)
                if (itemsCountNew < itemsCountOld) {
                    for (let i = itemsCountOld - 1; i >= itemsCountNew; i--)
                        this.list.children[i].remove()
                }
                else {
                    for (let i = itemsCountOld; i < itemsCountNew; i++) {
                        const li = document.createElement("li")
                        li.innerText = `Eintrag #${i + this.startPosition}`
                        this.list.appendChild(li);
                    }
                }
            }
        }
        resizeChecking()
    }
    
    private initializeItemHeight() {
        const div = document.createElement("div")
        document.body.appendChild(div)
    
        const max = 50
        for (let i = 0; i < max; i++) {
            const li = document.createElement("li")
            li.innerText = `Eintrag #${1}`
            div.appendChild(li)
        }
        const rowHeight = div.clientHeight / max
        document.body.removeChild(div)
        return rowHeight
    }

    private calculateCapacity() {
        let capacity = Math.floor(this.list.offsetHeight / this.itemHeight)
        if (capacity < 0)
            capacity = 0
    
        console.log(`Kapazität: ${capacity}`)
        return capacity
    }
    
    private readonly itemsCount = 30
    private startPosition = 0
    private list: HTMLUListElement
    private itemHeight: number
}
