module DirectoryProcessor
open System.IO
open ModelTools
open Model
open Str
open System.Diagnostics

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
        { name = "Name"; isSortable = true; isSize = false; isDate = false }
        { name = "Erw."; isSortable = true; isSize = false; isDate = false }
        { name = "Datum"; isSortable = true; isSize = false; isDate = true }
        { name = "Größe"; isSortable = true; isSize = true; isDate = false }
        { name = "Version"; isSortable = true; isSize = false; isDate = false }
    |]
    
