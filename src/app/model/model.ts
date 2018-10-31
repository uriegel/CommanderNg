export interface ServerEvent {
    items?: Item[]
}

export enum ItemType {
    Parent,
    Directory,
    File,
    Drive
}

export enum CommanderView {
    Left,
    Right
}

export interface Get {
    commanderView: number   
    path?: string
}

export interface Process {
    commanderView: number   
    index: number
}

export interface Item {
    index: number
    items: string[]
    icon: string
    isSelected?: boolean
    isCurrent?: boolean
    isHidden?: boolean
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

export interface Column {
    name: string
    rightAligned?: boolean
    isSortable?: boolean
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
