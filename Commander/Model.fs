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

type Event = {
    directoryItems: DirectoryItem list
    fileItems: FileItem list
}
