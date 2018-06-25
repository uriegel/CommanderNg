import { IColumns } from "../columns/columns.component"
import { Observable } from "rxjs"
import { IItem } from "../table-view/table-view.component"
import { Addon } from "../addon"
import { CommanderViewComponent } from "../commander-view/commander-view.component"

export enum ProcessorType {
    root,
    file
}

export abstract class ItemProcessor  {
    constructor (protected commanderView: CommanderViewComponent) {}

    abstract type: ProcessorType

    abstract get columns(): IColumns

    abstract get(path: string, recentPath?: string): Observable<IItem[]>

    abstract process(item: IItem) 

    close() {}

    protected readonly addon: Addon = (<any>window).require('addon')
}
