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

export interface Item {
    items: string[]
    icon: string
    isSelected?: boolean
    isCurrent?: boolean
}

export interface Response {
    columns?: Columns
    items: Item[]
}

export interface CommanderEvent {
    columns?: Columns
    theme?: string
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
    isSortable?: boolean
}