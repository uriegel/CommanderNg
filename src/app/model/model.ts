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

