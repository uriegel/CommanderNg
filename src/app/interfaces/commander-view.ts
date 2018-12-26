import { Columns } from "../model/model"

export interface IProcessor {
    ready(): string
    get(path: string)
}

export interface ICommanderView {
    setColumns(columns: Columns): any
}
