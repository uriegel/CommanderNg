import { Columns } from "../model/model"

export interface IProcessor {
    ready(): string
    changePath(path: string)
    getItems(): string
}

export interface ICommanderView {
    setColumns(columns: Columns): any
    itemsChanged(count: number): any
}
