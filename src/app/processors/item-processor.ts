import { IColumns } from "../columns/columns.component"
import { Observable } from "rxjs"
import { IItem } from "../table-view/table-view.component"
import { Addon } from "../addon"

export enum ProcessorType {
    root,
    file
}

export abstract class ItemProcessor  {
    type: ProcessorType

    abstract get columns(): IColumns

    abstract get(path: string): Observable<IItem[]>

    protected readonly addon: Addon = (<any>window).require('addon')
}
