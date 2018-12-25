import { Columns } from "../model/model"

export interface IProcessor {
    ready(): string
}

export interface ICommanderView {
    setColumns(columns: Columns): any
}
