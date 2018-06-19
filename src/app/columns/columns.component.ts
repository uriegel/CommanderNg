import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, Renderer2 } from '@angular/core'

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

    @ViewChildren("th") ths: QueryList<ElementRef>

    columns: IColumns

    ngAfterViewInit() {
        this.ths.forEach((th, i) => {
            this.renderer.setStyle(th.nativeElement, "width", `${(i * 10)}%`)
        })
    }
}
