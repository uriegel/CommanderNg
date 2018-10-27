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
    initEvents: (string->unit)->unit
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
    let mutable sentEvent = fun (item: string) -> ()
    let mutable requestNr = 0

    let initEvents hotSentEvent = sentEvent <- hotSentEvent

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
        requestNr <- requestNr + 1
        let path = 
            match path with
            | Some path -> 
                currentPath <- path
                path
            | None -> currentPath

        match path with 
        | ROOT -> getRootItems ()
        | DRIVES -> getDriveItems () 
        | _ -> 
            let result = {
                items = DirectoryProcessor.getItems path id
                columns = getColumns Type.FileSystem
            }
            let thisRequest = requestNr

            let check () = thisRequest = requestNr

            async {
                do! Async.Sleep(100) 
                let updateItems = retrieveFileVersions path result.items check
                match check () with
                | true -> sentEvent <| Json.serialize updateItems
                | false -> ()          
            } |> Async.Start
            
            result

    let getCurrentPath () = currentPath            
        
    {
        initEvents = initEvents
        get = get
        getCurrentPath = getCurrentPath
    }