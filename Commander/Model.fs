module Model
open System
open Newtonsoft.Json

type DirectoryItem = {
    name: string
    dateTime: DateTime
}

type FileItem = {
    name: string
    extension: string
    dateTime: DateTime
}

type Response = {
    directoryItems: DirectoryItem[]
    fileItems: FileItem[]
}

type CommanderView = Left = 1 | Right = 2

type Request = {
    commanderView: CommanderView option
    newPath: string option
}
