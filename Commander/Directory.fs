module Directory
open System
open System.Diagnostics
open System.IO
open Model
open ModelTools
open Str
open Sse
open ExifReader
open System.Runtime.InteropServices

[<Literal>]
let DIRECTORY = "directory"

let combinePath a b = Path.Combine (a, b)

let getPath path = 
    let di = DirectoryInfo path
    di.Name

let minPathLength = 
    if RuntimeInformation.IsOSPlatform(OSPlatform.Windows) then 3 else 1

let getDirectoryItems path (requestId: int) (callerId: int) withColumns = 
    let directoryInfo = DirectoryInfo path
    RequestState.updateRecentRequest callerId requestId |> ignore

    let getNameOnly name =
        match name with 
        | ".." -> name
        | _ -> 
            let pos = lastIndexOf name "."
            match pos with
            | -1 -> name
            | _ -> substringLength 0 pos name

    let getItems () = 

        let isHidden (attributes: FileAttributes) = attributes.HasFlag FileAttributes.Hidden

        let directoryItems () = GetSafeItems directoryInfo.GetDirectories 
        let fileItems () = GetSafeItems directoryInfo.GetFiles
        
        let createParentItem () = {
                itemType = ItemType.Parent
                index = 0
                icon = "Folder"
                items = [| ".."; ""; ""; ""; "" |] 
                isHidden = false
                isCurrent = false
            }

        let createDirectoryItem (item: DirectoryInfo) = { 
                itemType = ItemType.Directory
                index = 0
                icon = "Folder"
                items = [| item.Name; ""; convertTime item.LastWriteTime; ""; "" |] 
                isHidden = isHidden item.Attributes
                isCurrent = false
            }

        let createFileItem (item: FileInfo) = { 
                itemType = ItemType.File
                index = 0
                icon = 
                    match Str.toLower item.Extension with
                    | ".exe" -> sprintf "/request/icon?path=%s" item.FullName
                    | _ -> sprintf "/request/icon?path=%s" item.Extension
                items = [| getNameOnly item.Name; item.Extension; convertTime item.LastWriteTime; string item.Length; "" |] 
                isHidden = isHidden item.Attributes
                isCurrent = false
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
            isExif = false
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
            isExif = true
            columnIndex = 2
            value = getExifDate <| Path.Combine (path, sprintf "%s%s" item.items.[0] item.items.[1])
        }

        items 
        |> Array.indexed
        |> Array.filter isExifFile 
        |> Array.map getExifDateItem

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

    let response = { 
        itemToSelect = None
        path = directoryInfo.FullName
        items = Some (getItems ())
        columns = if withColumns then Some (getColumns ()) else None 
    }        

    let check () = RequestState.getRecentRequest callerId = requestId

    let continuation requestId () = 
        async {
            let updateItems = retrieveFileVersions directoryInfo.FullName response.items.Value check
            let updateItems2 = retrieveExifDates directoryInfo.FullName response.items.Value check
            match check () with
            | true -> 
                let commanderUpdate = {
                    id = callerId
                    updateItems =  Array.concat [|updateItems; updateItems2|] 
                }
                if check () then
                    serverSentEvent <| Json.serialize commanderUpdate
            | false -> ()          
        } |> Async.Start        

    { 
        response = response
        continuation = Some (continuation <| int requestId)
    }
