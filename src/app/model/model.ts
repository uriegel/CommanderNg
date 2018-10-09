export interface ServerEvent {
    items?: Item[]
}

export enum ItemType {
    File,
    Directory,
    Drive,
    Parent
}

export interface Item {
    name: string
    isSelected?: boolean
    isCurrent?: boolean
    type: ItemType
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

export interface Response {
    directoryItems: DirectoryItem[]
    fileItems: FileItem[]
}
