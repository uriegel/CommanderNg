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
}

type Type =
    Root = 0
    | Drives = 1
    | FileSystem = 2
let create id = 

    let mutable lastColumns: Type option = None

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
                    name = string id + "-" + ROOT
                    values = [| { name = "Name"; isSortable = false } |]
                }
            | Type.Drives -> Some {
                    name = string id + "-" + DRIVES
                    values = [| 
                        { name = "Name"; isSortable = false }
                        { name = "Bezeichnung"; isSortable = false }
                        { name = "Größe"; isSortable = false }
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
            | Some path -> path
            | None -> @"c:\windows" // TODO: Initial "root", then save value in LocalStorage

        match path with 
        | ROOT -> getRootItems ()
        | DRIVES -> getDriveItems () 
        | _ -> {
                items = DirectoryProcessor.getItems path id
                columns = getColumns Type.FileSystem
            }
        
    {
        get = get
    }