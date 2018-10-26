module Processor
open Model
open DirectoryProcessor
open WebServer

[<Literal>]
let ROOT = "root"

[<Literal>]
let DRIVES = "drives"

[<Literal>]
let FILE_SYSTEM = "FileSystem"

type ProcessorObject = {
    get: (string option)->Response
    getCurrentPath: unit->string
}

type Type =
    Root = 0
    | Drives = 1
    | FileSystem = 2
let create id = 

    let mutable lastColumns: Type option = None
    let mutable currentPath = @"c:\windows" // TODO: Initial "root", then save value in LocalStorage

    let (| TypeChanged | _ |) arg = 
        match lastColumns with 
        | Some value -> if arg = value then None else Some ()
        | None -> Some ()

    let getColumns columnsType =
        match columnsType with
        | TypeChanged -> 
            lastColumns <- Some columnsType
            match columnsType with
            | Type.Root -> Some {
                    name = sprintf "%d-%s" id ROOT
                    values = [| { name = "Name"; isSortable = false; rightAligned = false } |]
                }
            | Type.Drives -> Some {
                    name = sprintf "%d-%s" id DRIVES
                    values = [| 
                        { name = "Name"; isSortable = false; rightAligned = false }
                        { name = "Bezeichnung"; isSortable = false; rightAligned = false }
                        { name = "Größe"; isSortable = false; rightAligned = true }
                    |]
                }
            | _ -> Some {
                    name = string id
                    values = DirectoryProcessor.getColumns ()
                }    
        | _ -> None

    let getRootItems () = { items = [||]; columns = getColumns Type.Root }
    let getDriveItems () = { items = [||]; columns = getColumns Type.Drives }

    let get path = 
        let path = 
            match path with
            | Some path -> 
                currentPath <- path
                path
            | None -> currentPath

        match path with 
        | ROOT -> getRootItems ()
        | DRIVES -> getDriveItems () 
        | _ -> {
                items = DirectoryProcessor.getItems path id
                columns = getColumns Type.FileSystem
            }

    let getCurrentPath () = currentPath            
        
    {
        get = get
        getCurrentPath = getCurrentPath
    }