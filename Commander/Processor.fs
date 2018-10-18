module Processor
open Model
open DirectoryProcessor

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
let create (id: string) = 

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
                    name = id + "-" + ROOT
                    values = [| { name = "Name"; isSortable = false } |]
                }
            | Type.Drives -> Some {
                    name = id + "-" + DRIVES
                    values = [| 
                        { name = "Name"; isSortable = false }
                        { name = "Bezeichnung"; isSortable = false }
                        { name = "Größe"; isSortable = false }
                    |]
                }
            | _ -> Some {
                    name = id + "-" + FILE_SYSTEM
                    values = [|
                        { name = "Name"; isSortable = true }
                        { name = "Erw."; isSortable = true }
                        { name = "Datum"; isSortable = true }
                        { name = "Größe"; isSortable = true }
                        { name = "Version"; isSortable = true }
                    |]
                }
        | _ -> None

    let getRootItems () = { items = [||]; columns = getColumns Type.Root }
    let getDriveItems () = { items = [||]; columns = getColumns Type.Drives }

    let getFileItems path = 
        let items = getItems path
        {
            items = items
            columns = getColumns Type.FileSystem
        }

    let get path = 
        let path = 
            match path with
            | Some path -> path
            | None -> @"c:\windows" // TODO: Initial "root", then save value in LocalStorage

        match path with 
        | ROOT -> getRootItems ()
        | DRIVES -> getDriveItems () 
        | _ -> getFileItems path

    {
        get = get
    }