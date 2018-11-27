module Directory
open System
open System.Diagnostics
open System.IO
open Model
open ModelTools
open Str
open ExifReader

// TODO: Version or eXIF    
// TODO: indexToSelect

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

    let retrieveFileVersions path (items: ResponseItem[]) check = 
        let isVersionFile (index, item: ResponseItem) =
            let ext = toLower item.items.[1]
            ext = ".exe"  || ext = ".dll"

        let getVersion file =
            match check () with 
            | true ->
                let fvi = FileVersionInfo.GetVersionInfo file
                sprintf "%u.%u.%u.%u" fvi.FileMajorPart fvi.FileMinorPart fvi.FileBuildPart fvi.FilePrivatePart
            | false -> ""

        let getVersionItem (index, item: ResponseItem) = {
            index = index
            columnIndex = 4
            value = getVersion <| Path.Combine (path, sprintf "%s%s" item.items.[0] item.items.[1])
        }
            
        items 
        |> Array.indexed
        |> Array.filter isVersionFile 
        |> Array.map getVersionItem

    let retrieveExifDates path (items: ResponseItem[]) check = 
        let isExifFile (index, item: ResponseItem) =
            let ext = toLower item.items.[1]
            ext = ".jpg"

        let getExifDate file =
            match check () with 
            | true ->
                let exif = getExifDate file
                match exif with 
                | Some value -> convertTime value
                | None -> ""
            | false -> ""

        let getExifDateItem (index, item: ResponseItem) = {
            index = index
            columnIndex = 2
            value = getExifDate <| Path.Combine (path, sprintf "%s%s" item.items.[0] item.items.[1])
        }

        items 
        |> Array.indexed
        |> Array.filter isExifFile 
        |> Array.map getExifDateItem

    let thisRequest = requestNr

    let check () = thisRequest = requestNr

    let continuation () = 
        async {
            let updateItems = retrieveFileVersions path result.items.Value check
            let updateItems2 = retrieveExifDates path result.items.Value check
            match check () with
            | true -> 
                let commanderUpdate = {
                    id = requestNr
                    updateItems =  Array.concat [|updateItems; updateItems2|] 
                }
                sentEvent <| Json.serialize commanderUpdate
            | false -> ()          
        } |> Async.Start        

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
        continuation = Some continuation
    }

