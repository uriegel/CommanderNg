module Directory
open System.IO
open System
open Model
open ModelTools
open Str

[<Literal>]
let DIRECTORY = "directory"

let getDirectoryItems path (requestId: string option) withColumns = 
    let getNameOnly name =
        match name with 
        | ".." -> name
        | _ -> 
            let pos = lastIndexOf name "."
            match pos with
            | -1 -> name
            | _ -> substringLength 0 pos name

    let getItems () = 
        let di = DirectoryInfo path
        let directoryItems (di: DirectoryInfo) () = GetSafeItems di.GetDirectories 
        let fileItems (di: DirectoryInfo) () = GetSafeItems di.GetFiles
        
        let directoryItems = directoryItems di
        let fileItems = fileItems di

        let createParentItem () = {
                itemType = ItemType.Parent
                index = 0
                icon = "Folder"
                items = [| ".."; ""; string 0; convertTime Unchecked.defaultof<DateTime>; ""; "" |] 
                isCurrent = false
                isHidden = false
            }

        let createDirectoryItem (item: DirectoryInfo) = { 
                itemType = ItemType.Directory
                index = 0
                icon = "Folder"
                items = [| item.Name; ""; string 0; convertTime item.LastWriteTime; ""; "" |] 
                isCurrent = false
                isHidden = isHidden item.Attributes
            }

        let createFileItem (item: FileInfo) = { 
                itemType = ItemType.File
                index = 0
                icon = 
                    match Str.toLower item.Extension with
                    | ".exe" -> sprintf "/request/icon?path=%s" item.FullName
                    | _ -> sprintf "/request/icon?path=.%s" item.Extension
                items = [| getNameOnly item.Name; item.Extension; string item.Length; convertTime item.LastWriteTime; ""; "" |] 
                isCurrent = false
                isHidden = isHidden item.Attributes
            }
           
        let directoryItems = 
            directoryItems () 
            |> Array.map createDirectoryItem

        let fileItems = 
            fileItems ()
            |> Array.map createFileItem 

        let fillIndexes index (responseItem: ResponseItem)  =
            { 
                responseItem with
                    index = index
                    isCurrent = index = 0 // indexToSelect
            }
        
        Array.concat [| [| createParentItem () |] ; directoryItems ; fileItems |]
        |> Array.mapi fillIndexes

    let getColumns () = {
            name = DIRECTORY
            values = [| 
                // TODO: take Browser language))
                { name = "Name"; isSortable = true; columnsType = ColumnsType.String }
                { name = "Erw."; isSortable = true; columnsType = ColumnsType.String }
                { name = "Datum"; isSortable = true; columnsType = ColumnsType.Date }
                { name = "Größe"; isSortable = true; columnsType = ColumnsType.Size }
                { name = "Version"; isSortable = true; columnsType = ColumnsType.Version }
            |]
        }
    { 
        response = { items = Some (getItems ()); columns = if withColumns then Some (getColumns ()) else None }
        continuation = None
    }

