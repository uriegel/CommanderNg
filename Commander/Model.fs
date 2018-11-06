module Model
open System
open System.IO

type ItemType = Undefined = 0 | Parent = 1 | Directory = 2 | File = 3 

type Item = {
    itemType: ItemType
    icon: string
    name: string
    extension: string 
    dateTime: DateTime
    size: int64 
    isHidden: bool
}

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

type CommanderView = Left = 0 | Right = 1

type Request = {
    commanderView: CommanderView option
    newPath: string option
}

let isHidden (attributes: FileAttributes) = attributes.HasFlag FileAttributes.Hidden

let createParentItem () = {
    itemType = ItemType.Parent
    icon = "Folder"
    extension = null
    name = ".."
    dateTime = Unchecked.defaultof<DateTime>
    size = 0L
    isHidden = false
}

let createDriveItem (item: DriveInfo) = {
    itemType = ItemType.Directory
    icon = "Folder"
    extension = item.VolumeLabel
    name = item.Name
    dateTime = Unchecked.defaultof<DateTime>
    size = item.TotalFreeSpace
    isHidden = false
}

let createDirectoryItem (item: DirectoryInfo) = {
    itemType = ItemType.Directory
    icon = "Folder"
    extension = item.Extension
    name = item.Name
    dateTime = item.LastWriteTime
    size = 0L
    isHidden = isHidden item.Attributes
}

let createFileItem id (item: FileInfo) = {
    itemType = ItemType.File
    icon = 
        match Str.toLower item.Extension with
        | ".exe" -> sprintf "/request/icon?path=%s&id=%d" item.Name id
        | _ -> sprintf "/request/icon?path=.%s" item.Extension
    extension = item.Extension
    name = item.Name
    dateTime = item.LastWriteTime
    size = item.Length
    isHidden = isHidden item.Attributes
}

type UpdateItem = {
    index: int
    columnIndex: int
    value: string
}

type CommanderUpdate = {
    id: int
    updateItems: UpdateItem[]
}

