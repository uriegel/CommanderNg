module Processor
open Model
open DirectoryProcessor

[<Literal>]
let ROOT = "root"

[<Literal>]
let DRIVES = "drives"

[<Literal>]
let FILE_SYSTEM = "fileSystem"

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
        | None -> None

    let getColumns columnsType =
        match columnsType with
        | TypeChanged -> 
            lastColumns <- Some columnsType
            match columnsType with
            | Type.Root -> Some {
                    name = ROOT
                    values = [||]
                }
            | Type.Drives -> Some {
                    name = DRIVES
                    values = [||]
                }
            | _ -> Some {
                    name = FILE_SYSTEM
                    values = [||]
                }
        | _ -> None

    let getRootItems () = { items = [||] }
    let getDriveItems () = { items = [||] }

    let getFileItems path = 
        let items = getItems path
        {
            items = items
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