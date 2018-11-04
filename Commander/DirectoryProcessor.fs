module DirectoryProcessor
open System.IO
open System.Diagnostics
open ModelTools
open Model
open Str
open ExifReader

type SortItem = 
    | Name = 0
    | Extension = 1
    | DateTime = 2

let getNameOnly name =
    match name with 
    | ".." -> name
    | _ -> 
        let pos = lastIndexOf name "."
        match pos with
        | -1 -> name
        | _ -> substringLength 0 pos name

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

let getItems path id = 

    let di = DirectoryInfo path
    let directoryItems (di: DirectoryInfo) () = GetSafeItems di.GetDirectories 
    let fileItems (di: DirectoryInfo) () = GetSafeItems di.GetFiles
    
    let directoryItems = directoryItems di
    let fileItems = fileItems di

    let directoryItems = 
        directoryItems () 
        |> Array.map createDirectoryItem

    let mapping = createFileItem id 

    let fileItems = 
        fileItems ()
        |> Array.map mapping
    Array.concat [| [| createParentItem () |] ; directoryItems ; fileItems |]

let getColumns () = [|
        // TODO: take Browser language))
        { name = "Name"; isSortable = true; columnsType = ColumnsType.String }
        { name = "Erw."; isSortable = true; columnsType = ColumnsType.String }
        { name = "Datum"; isSortable = true; columnsType = ColumnsType.Date }
        { name = "Größe"; isSortable = true; columnsType = ColumnsType.Size }
        { name = "Version"; isSortable = true; columnsType = ColumnsType.Version }
    |]
    
