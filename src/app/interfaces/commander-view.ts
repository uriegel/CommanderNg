import { Columns } from "../model/model"

export interface IProcessor {
    ready(): any
    changePath(path: string): any
    getItems(): string
    setIndex(index: number): any
}

export interface ICommanderView {
    setColumns(columns: Columns): any
    itemsChanged(count: number): any
}
