module Model
open System
open System.IO

type ItemType = Undefined = 0 | Parent = 1 | Directory = 2 | File = 3 

type ColumnsType = String = 0 | Size = 1 | Date = 2| Version = 3 

type Column = {
    name: string
    isSortable: bool
    columnsType: ColumnsType
}

type Columns = {
    name: string
    values: Column[]
}

type ResponseItem = {
    itemType: ItemType
    index: int
    items: string[]
    icon: string
    isCurrent: bool
    isHidden: bool
}

type Response = {
    columns: Columns option  
    items: ResponseItem[] option
}

type GetResult = {
    response: Response
    continuation: (unit->unit) option
}

type UpdateItem = {
    index: int
    isExif: bool
    columnIndex: int
    value: string
}

type CommanderUpdate = {
    id: int
    updateItems: UpdateItem[]
}

