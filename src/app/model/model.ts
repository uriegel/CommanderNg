
export enum ItemType {
    Undefiend,
    Parent,
    Directory,
    File,
    Drive
}

export interface Get {
    requestId: number
    withColumns?: boolean
    path: string
}

export interface Process {
    commanderView: number   
    index: number
}

export interface Item {
    itemType: ItemType
    index: number
    items: string[]
    icon: string
    isSelected?: boolean
    isCurrent?: boolean
    isHidden?: boolean
    isExif?: boolean
}

export interface Response {
    columns?: Columns
    items: Item[]
}

export interface ShowHidden {
    value: boolean
}

export interface CommanderEvent {
    theme?: string
    refresh?: boolean
    showHidden?: ShowHidden
}

export interface DirectoryItem {
    name: string
    dateTime: Date
}

export interface FileItem {
    name: string
    extension: string
    dateTime: Date
}

export interface Columns {
    name: string
    values: Column[]
}

export enum ColumnsType {
    String,
    Size,
    Date,
    Version
}

export interface Column {
    name: string
    isSortable?: boolean
    columnsType: ColumnsType
}

export interface UpdateItem  {
    index: number
    columnIndex: number
    value: string   
}

export interface CommanderUpdate {
    id: number
    updateItems: UpdateItem[]
}
