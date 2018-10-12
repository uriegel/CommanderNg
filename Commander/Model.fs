module Model
open System
open System.IO

type ItemType = Parent = 0 | Directory = 1 | File = 2 

type Item = {
    itemType: ItemType
    name: string
    extension: string 
    dateTime: DateTime
    size: int64 
}

type Response = {
    items: Item[]
}

type CommanderView = Left = 1 | Right = 2

type CommanderEvent = {
    theme: string option
    isInitialized: Boolean
}

type Request = {
    commanderView: CommanderView option
    newPath: string option
}

let createParentItem () = {
    itemType = ItemType.Parent
    extension = null
    name = ".."
    dateTime = Unchecked.defaultof<DateTime>
    size = 0L
}

let createDirectoryItem (item: DirectoryInfo) = {
    itemType = ItemType.Directory
    extension = null
    name = item.Name
    dateTime = item.LastWriteTime
    size = 0L
}

let createFileItem (item: FileInfo) = {
    itemType = ItemType.File
    extension = item.Extension
    name = item.Name
    dateTime = item.LastWriteTime
    size = item.Length
}