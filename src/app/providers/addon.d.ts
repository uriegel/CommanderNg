import { IItem } from "../table-view/table-view.component"

export enum DriveType {
    Unknown,
    NoRoot,
    Removable,
    Fixed,
    Remote,
    Rom,
    Ram
}    

export enum ItemType {
    file,
    directory,
    drive
}

export interface FileItem extends IItem {
    name: string
	type: ItemType
	isHidden: boolean
	size: number
	time: Date
}

export interface DriveInfo extends IItem {
    name: string
    isDirectory: boolean
    isHidden: boolean
    size: number
    time: Date
    label: string
    type: DriveType
}

export interface Addon {
    readDirectory(path: string, callback: (error: any, result: FileItem[]) => void): void
	getDrives(callback: (error: any, result: DriveInfo[]) => void): void
	getFileVersion(path: string, callback: (error: any, result: string) => void): void
	getExifDate(path: string, callback: (error: any, result: Date) => void): void
}
