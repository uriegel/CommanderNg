import { IColumns } from "../columns/columns.component"
import { Observable } from "rxjs"
import { IItem } from "../table-view/table-view.component"
import { Addon } from "../addon"
import { CommanderViewComponent } from "../commander-view/commander-view.component"
import { SettingsService } from "../services/settings.service"

export enum ProcessorType {
    root,
    file
}

export abstract class ItemProcessor  {
    constructor (protected commanderView: CommanderViewComponent, protected settings: SettingsService) {}

    abstract type: ProcessorType

    abstract get columns(): IColumns

    abstract get(path: string, recentPath?: string): Observable<IItem[]>

    abstract process(item: IItem) 

    canCreateFolder() {
        return false
    }

    sort(items: IItem[], columnIndex: number, isAscending: boolean): IItem[] { return [] }

    close() {}

    protected readonly addon: Addon = (<any>window).require('addon')
}
