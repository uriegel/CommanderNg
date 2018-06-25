import { IItem } from "./table-view/table-view.component"

export enum DriveType {
    Unknown,
    NoRoot,
    Removable,
    Fixed,
    Remote,
    Rom,
    Ram
}    

export interface FileItem extends IItem {
    name: string
    type: number
	isHidden?: boolean
	size?: number
    time?: Date
    version?: string
}

export interface DriveInfo extends IItem {
    name: string
    type: number
    isHidden: boolean
    size: number
    time: Date
    label: string
    driveType: DriveType
}

export interface Addon {
    readDirectory(path: string, callback: (error: any, result: FileItem[]) => void): void
	getDrives(callback: (error: any, result: DriveInfo[]) => void): void
	getFileVersion(path: string, callback: (error: any, result: string) => void): void
	getExifDate(path: string, callback: (error: any, result: Date) => void): void
}
