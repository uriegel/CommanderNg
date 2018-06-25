import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'app-scrollbar',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements AfterViewInit {
    @ViewChild("scrollbar") scrollbar: ElementRef
    @ViewChild("grip") grip: ElementRef
    @Output() positionChanged: EventEmitter<number> = new EventEmitter()    

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit() {
        this.timer = setTimeout(() => {}, -1)
        clearTimeout(this.timer)
        this.interval = setTimeout(() => {}, -1)
        clearTimeout(this.interval)
    }

    /**
     * Has to be called when scrollableContent has changed item count
     * @param numberOfItems new complete number of items
     * @param numberOfItemsDisplayed number of Items which can be displayed without scrolling
     * @param newScrollPos first item displayed
     */
    itemsChanged(numberOfItems: number, numberOfItemsDisplayed: number, newScrollPos?: number) {
        if (numberOfItemsDisplayed > numberOfItems)
            numberOfItemsDisplayed = numberOfItems
        this.parentHeight = this.scrollbar.nativeElement.parentElement.parentElement.clientHeight - this.offsetTop
        if (numberOfItems)
            this.itemsCountAbsolute = numberOfItems
        if (numberOfItemsDisplayed)
            this.itemsCountVisible = numberOfItemsDisplayed

        if (!this.itemsCountAbsolute)
            return
        if (this.itemsCountAbsolute <= this.itemsCountVisible) {
            this.renderer.addClass(this.scrollbar.nativeElement, "scrollbarHidden")
            this.position = 0
            this.positionChanged.emit(this.position)
        }
        else {
            this.renderer.removeClass(this.scrollbar.nativeElement, "scrollbarHidden")
            var gripHeight = (this.parentHeight - 32 - this.columnsHeight) * (this.itemsCountVisible / this.itemsCountAbsolute)
            if (gripHeight < 5)
                gripHeight = 5
            this.steps = this.itemsCountAbsolute - this.itemsCountVisible
            this.step = (this.parentHeight - 32 - this.columnsHeight - gripHeight) / this.steps
            this.renderer.setStyle(this.grip.nativeElement, "height", gripHeight + 'px')
            if (this.position > this.steps) {
                this.position = this.steps
                this.positionChanged.emit(this.position)
            }
        }
        if (newScrollPos != undefined) {
            this.position = newScrollPos
            if (this.position < 0)
                this.position = 0
            else if (this.position >= numberOfItems - numberOfItemsDisplayed)
                this.position = numberOfItems - numberOfItemsDisplayed
            this.positionChanged.emit(this.position)
        }
        this.positionGrip()
    }

    /**
     * Sets the scroll
     * @param position
     */
    setPosition(position: number) {
        this.position = position
        if (this.position > this.steps)
            this.position = this.steps
        if (this.position < 0)
            this.position = 0
        this.positionGrip()
    }

    private scrollbarMouseDown(evt: MouseEvent) {
        if (!(<HTMLElement>evt.target).classList.contains("scrollbar"))
            return

        this.pageMousePosition = evt.layerY
        const isPageUp = evt.layerY < this.grip.nativeElement.offsetTop

        clearTimeout(this.timer)
        clearInterval(this.interval)
        if (isPageUp)
            this.pageUp()
        else
            this.pageDown()

        this.timer = setTimeout(() => this.interval = setInterval((
            isPageUp ? () => this.pageUp() : () => this.pageDown()), 10), 600)
    }

    private gripMouseDown(evt: MouseEvent) {
        if (evt.which != 1)
            return
        this.gripping = true
        evt.preventDefault()

        this.gripTopDelta = this.grip.nativeElement.offsetTop + this.scrollbar.nativeElement.offsetTop - evt.pageY
        var gripperMove = (evt: MouseEvent) => {
            if (!this.gripping || evt.which != 1) {
                window.removeEventListener('mousemove', gripperMove)
                return
            }

            var top = evt.pageY + this.gripTopDelta - this.scrollbar.nativeElement.offsetTop
            if (top < 15)
                top = 15
            else if (top + this.grip.nativeElement.offsetHeight - 15 > (this.parentHeight - 32 - this.columnsHeight))
                top = this.parentHeight - 32 - this.columnsHeight - this.grip.nativeElement.offsetHeight + 15
            this.renderer.setStyle(this.grip.nativeElement, "top", top + 'px')

            var currentPosition = Math.floor((top - 15) / this.step + 0.5)
            if (currentPosition != this.position) {
                this.position = currentPosition
                    this.positionChanged.emit(this.position)
            }
        }

        window.addEventListener('mousemove', gripperMove)
    }

    private upMouseDown() {
        clearTimeout(this.timer)
        clearInterval(this.interval)
        this.mouseUp()

        this.timer = setTimeout(() => this.interval = setInterval(() => this.mouseUp(), 10), 600)
    }

    private downMouseDown() {
        clearTimeout(this.timer)
        clearInterval(this.interval)
        this.mouseDown()

        this.timer = setTimeout(() => this.interval = setInterval(() => this.mouseDown(), 10), 600)
    }

    private mouseup() {
        clearTimeout(this.timer)
        clearInterval(this.interval)
        this.gripping = false
        this.setFocus()
    }

    private onClick(evt: Event) {
        evt.stopPropagation()
    }

    private onMouseLeave() {
        clearTimeout(this.timer)
        clearInterval(this.interval)
    }

    private mouseUp() {
        this.position -= 1
        if (this.position < 0) {
            this.position = 0
            clearTimeout(this.timer)
            clearInterval(this.interval)
            return
        }

        this.positionGrip()
        this.positionChanged.emit(this.position)
    }

    private mouseDown() {
        this.position += 1
        if (this.position > this.steps) {
            this.position = this.steps
            clearTimeout(this.timer)
            clearInterval(this.interval)
            return
        }
        this.positionGrip()
        this.positionChanged.emit(this.position)
    }

    private pageUp() {
        if (this.grip.nativeElement.offsetTop < this.pageMousePosition) {
            clearTimeout(this.timer)
            clearInterval(this.interval)
            return
        }

        this.position -= this.itemsCountVisible - 1
        if (this.position < 0) {
            const lastTime = this.position != 0
            this.position = 0
            clearTimeout(this.timer)
            clearInterval(this.interval)
            if (lastTime) {
                this.positionGrip()
                this.positionChanged.emit(this.position)
            }
            return
        }
        this.positionGrip()
        this.positionChanged.emit(this.position)
    }

    private pageDown() {
        if (this.grip.nativeElement.offsetTop + this.grip.nativeElement.offsetHeight > this.pageMousePosition) {
            clearTimeout(this.timer)
            clearInterval(this.interval)
            return
        }

        this.position += this.itemsCountVisible - 1
        if (this.position > this.steps) {
            const lastTime = this.position != 0
            this.position = this.steps
            clearTimeout(this.timer)
            clearInterval(this.interval)
            if (lastTime) {
                this.positionGrip()
                this.positionChanged.emit(this.position)
            }
            return
        }

        this.positionGrip()
        this.positionChanged.emit(this.position)
    }

    private positionGrip() {
        const top = 15 + this.position * this.step
        this.renderer.setStyle(this.grip.nativeElement, "top", top + 'px')
    }

    private readonly columnsHeight = 16
    private position = 0
    private setFocus = () => { }
    private gripTopDelta = -1
    private gripping = false
    private parentHeight = 0
    private offsetTop = 0

    private timer: any
    private interval: any
    private pageMousePosition = 0
    private step = 0
    private steps = 0
    private itemsCountAbsolute = 0
    private itemsCountVisible = 0
}
