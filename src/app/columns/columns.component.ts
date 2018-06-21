import { Component, AfterViewInit, ViewChildren, ViewChild, ElementRef, QueryList, Renderer2 } from '@angular/core'

export interface IColumns {
    name: string
    columns: IColumn[]
}

export interface IColumn {
    name: string
    onSort?: (ascending: boolean)=>void
}

@Component({
  selector: '[app-columns]',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.css']
})
export class ColumnsComponent implements AfterViewInit {

    constructor(private renderer: Renderer2) {}
    @ViewChild("columnsRow") columnsRow: ElementRef
    @ViewChildren("th") ths: QueryList<ElementRef>

    columns: IColumns = {
        name: "Nil",
        columns: []            
    }

    ngAfterViewInit() {
        // this.ths.forEach((th, i) => {
        //     this.renderer.setStyle(th.nativeElement, "width", `${(i * 10)}%`)
        // })
    }

    private onMouseMove(evt: MouseEvent) {
        const th = <HTMLElement>evt.target
        if (th.localName == "th" && (th.offsetLeft > 0 || evt.pageX - th.getBoundingClientRect().left > 10)
            && (th.offsetLeft + th.offsetWidth < this.columnsRow.nativeElement.offsetWidth || evt.pageX - th.getBoundingClientRect().left < 4)
            && (th.getBoundingClientRect().left + th.offsetWidth - evt.pageX < 4 || evt.pageX - th.getBoundingClientRect().left < 4)) {
            this.renderer.setStyle(th, "cursor", "ew-resize")
            this.grippingReady = true
            this.previous = evt.pageX - th.getBoundingClientRect().left < 4
        }
        else {
            this.renderer.setStyle(th, "cursor", "default")
            this.grippingReady = false
        }
    }
    
    private previous = false
    private grippingReady = false
}
