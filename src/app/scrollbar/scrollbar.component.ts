import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements AfterViewInit {
    @ViewChild("scrollbar") scrollbar: ElementRef

    constructor() { }

    ngAfterViewInit() {
        this.grip = document.createElement("div")

        this.timer = setTimeout(() => {}, -1)
        clearTimeout(this.timer)
        this.interval = setTimeout(() => {}, -1)
        clearTimeout(this.interval)

        const up = document.createElement("div")
        up.classList.add("scrollbarUp")
        this.scrollbar.nativeElement.appendChild(up)

        const upImg = document.createElement("div")
        upImg.classList.add("scrollbarUpImg")
        up.appendChild(upImg)

        const down = document.createElement("div")
        down.classList.add("scrollbarDown")
        this.scrollbar.nativeElement.appendChild(down)

        const downImg = document.createElement("div")
        downImg.classList.add("scrollbarDownImg")
        down.appendChild(downImg)

        this.grip.classList.add("scrollbarGrip")
        this.scrollbar.nativeElement.appendChild(this.grip)

        up.onmousedown = () => {
            clearTimeout(this.timer)
            clearInterval(this.interval)
            this.mouseUp()

            this.timer = setTimeout(() => this.interval = setInterval(() => this.mouseUp(), 10), 600)
        }

        down.onmousedown = () => {
            clearTimeout(this.timer)
            clearInterval(this.interval)
            this.mouseDown()

            this.timer = setTimeout(() => this.interval = setInterval(() => this.mouseDown(), 10), 600)
        }

        this.scrollbar.nativeElement.onmousedown = evt => {
            if (!(<HTMLElement>evt.target).classList.contains("scrollbar"))
                return

            this.pageMousePosition = evt.pageY
            const isPageUp = evt.pageY < this.grip.offsetTop

            clearTimeout(this.timer)
            clearInterval(this.interval)
            if (isPageUp)
                this.pageUp()
            else
                this.pageDown()

            this.timer = setTimeout(() => this.interval = setInterval((
                isPageUp ? () => this.pageUp() : () => this.pageDown()), 10), 600)
        }

        this.grip.onmousedown = evt => {
            if (evt.which != 1)
                return
            this.gripping = true
            evt.preventDefault()

            this.gripTopDelta = this.grip.offsetTop + this.scrollbar.nativeElement.offsetTop - evt.pageY

            var gripperMove = (evt: MouseEvent) => {
                if (!this.gripping || evt.which != 1) {
                    window.removeEventListener('mousemove', gripperMove)
                    return
                }

                var top = evt.pageY + this.gripTopDelta - this.scrollbar.nativeElement.offsetTop
                if (top < 15)
                    top = 15
                else if (top + this.grip.offsetHeight - 15 > (this.parentHeight - 32))
                    top = this.parentHeight - 32 - this.grip.offsetHeight + 15
                this.grip.style.top = top + 'px'

                var currentPosition = Math.floor((top - 15) / this.step + 0.5)
                if (currentPosition != this.position) {
                    this.position = currentPosition
//                    positionChanged(this.position)
                }
            }

            window.addEventListener('mousemove', gripperMove)
        }

        up.onmouseup = () => this.mouseup()
        down.onmouseup = () => this.mouseup()
        this.grip.onmouseup = () => this.mouseup()
        this.scrollbar.nativeElement.onmouseup = () => this.mouseup()

        this.scrollbar.nativeElement.onclick = evt => evt.stopPropagation()

        this.scrollbar.nativeElement.onmouseleave = () => {
            clearTimeout(this.timer)
            clearInterval(this.interval)
        }
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

    private mouseup() {
        clearTimeout(this.timer)
        clearInterval(this.interval)
        this.gripping = false
        this.setFocus()
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
//        this.positionChanged(this.position)
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
//        this.positionChanged(this.position)
    }

    private pageUp() {
        if (this.grip.offsetTop < this.pageMousePosition) {
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
    //            this.positionChanged(this.position)
            }
            return
        }
        this.positionGrip()
//        this.positionChanged(this.position)
    }

    private pageDown() {
        if (this.grip.offsetTop + this.grip.offsetHeight > this.pageMousePosition) {
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
  //              this.positionChanged(this.position)
            }
            return
        }

        this.positionGrip()
//        this.positionChanged(this.position)
    }

    private positionGrip() {
        const top = 15 + this.position * this.step
        this.grip.style.top = top + 'px'
    }

    private grip: HTMLElement
    private position = 0
    private setFocus = () => { }
    private gripTopDelta = -1
    private gripping = false
    private parentHeight = 0
    private offsetTop = 0

    /**
     * Ein einmaliges Timeout-Intervall
     */
    private timer: number
    /**
     * Ein zyklischer Timer
     */
    private interval: number
    private pageMousePosition = 0
    private step = 0
    private steps = 0
    private itemsCountAbsolute = 0
    private itemsCountVisible = 0
}
