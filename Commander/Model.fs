module Model
open System
open System.IO

type ItemType = Parent = 0 | Directory = 1 | File = 2 

type Item = {
    itemType: ItemType
    icon: string
    name: string
    extension: string 
    dateTime: DateTime
    size: int64 
    isHidden: bool
}

type Column = {
    name: string
    rightAligned: bool
    isSortable: bool
}

type Columns = {
    name: string
    values: Column[]
}

type ResponseItem = {
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

type CommanderEvent = {
    theme: string option
    isInitialized: Boolean
}

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

let createDirectoryItem (item: DirectoryInfo) = {
    itemType = ItemType.Directory
    icon = "Folder"
    extension = null
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

