module Model
open System

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
    directoryItems: DirectoryItem list
    fileItems: FileItem list
}

type CommanderView = Left = 1 | Right = 2

type Request = {
    commanderView: CommanderView option
    newPath: string option
}
