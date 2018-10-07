export class ItemType {
    static readonly File = 0
    static readonly Directory = 1
    static readonly Drive = 2
}

export interface Item {
    name: string
    ext?: string
    time?: Date
    size?: number
    isExif?: boolean
    version?: string
    label?: string
    driveType?: any
}
