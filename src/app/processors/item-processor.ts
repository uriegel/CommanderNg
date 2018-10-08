import { IColumns } from "../columns/columns.component"
import { Observable } from "rxjs"
import { CommanderViewComponent } from "../commander-view/commander-view.component"
import { SettingsService } from "../services/settings.service"
import { Item } from "../model/model"

export enum ProcessorType {
    root,
    file
}

export abstract class ItemProcessor  {
    constructor (protected commanderView: CommanderViewComponent, protected settings: SettingsService) {}

    abstract type: ProcessorType

    abstract get columns(): IColumns

    abstract get(path: string, recentPath?: string): Observable<Item[]>

    abstract process(item: Item) 

    canCreateFolder() { return false }
    canDelete() { return false }

    abstract createFolder(path: string): Observable<any>

    abstract deleteItems(path: string[]): Observable<any>

    sort(items: Item[], columnIndex: number, isAscending: boolean): Item[] { return [] }

    close() {}
}
