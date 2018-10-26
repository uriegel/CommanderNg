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

let getDataTime (dateTime: System.DateTime) =
    match dateTime.Ticks with
    | 0L -> ""
    | _ -> dateTime.ToString "g"

let getSize item = 
    match item.itemType with
    | ItemType.File -> 
        let str = string item.size
        let len = String.length str
        let firstDigits = len % 3
        let rec getFirstDigits (str: string) =
            if String.length str = 3 then 
                str 
            else 
                let first = substringLength 0 3 str
                let last = substring 3 str
                sprintf "%s.%s" first <| getFirstDigits last
        
        if len > 3 && firstDigits <> 0 then
            sprintf "%s.%s" <| substringLength 0 firstDigits str <| (getFirstDigits <| substring firstDigits str)
        elif len > 3 && firstDigits = 0 then
            getFirstDigits <| substring firstDigits str
        else
            str
    | _ -> ""

let getVersion file =
    let fvi = FileVersionInfo.GetVersionInfo file
    sprintf "%u.%u.%u.%u" fvi.FileMajorPart fvi.FileMinorPart fvi.FileBuildPart fvi.FilePrivatePart

let getResponseItem id (item: Item) = { 
        items = [| getNameOnly item.name; item.extension; getDataTime item.dateTime; getSize item |] 
        icon = 
            match item.itemType with
            | ItemType.File ->
                match Str.toLower item.extension with
                | ".exe" -> sprintf "/request/icon?path=%s&id=%d" item.name id
                | _ -> sprintf "/request/icon?path=.%s" item.extension
            | _ -> "Folder"
    }

let getItems path id = 

    let di = DirectoryInfo path
    let directoryItems (di: DirectoryInfo) () = GetSafeItems di.GetDirectories 
    let fileItems (di: DirectoryInfo) () = GetSafeItems di.GetFiles
    
    let directoryItems = directoryItems di
    let fileItems = fileItems di

    let sortByName (item: Item) = Str.toLower item.name

    let directoryItems = 
        directoryItems () 
        |> Array.map createDirectoryItem
        |> Array.sortBy sortByName

    // Sorting:
    let descending = false
    let sortItem = SortItem.Name

    let takeItem (a, _) = a
    let takeSortItem (_, b) = b

    let mapSortName (item: Item) = item, (Str.toLower item.name, Str.toLower item.name)
    let mapSortExtension item  = item, (Str.toLower item.extension, Str.toLower item.name)
    let mapSortDateTime item = item, (item.dateTime.ToString "s", Str.toLower item.name)

    let mapSort = 
        match sortItem with
        | SortItem.Name -> mapSortName
        | SortItem.Extension -> mapSortExtension
        | SortItem.DateTime -> mapSortDateTime
        | _ -> mapSortName
    let mapping = createFileItem >> mapSort
    let sorting = 
        match descending with
        | true -> Array.sortByDescending takeSortItem
        | false -> Array.sortBy takeSortItem

    let fileItems = 
        fileItems ()
        |> Array.map mapping
        |> sorting
        |> Array.map takeItem
    Array.concat [| [| createParentItem () |] ; directoryItems ; fileItems |]
    |> Array.map (getResponseItem id)

let getColumns () = [|
        { name = "Name"; isSortable = true; rightAligned = false }
        { name = "Erw."; isSortable = true; rightAligned = false }
        { name = "Datum"; isSortable = true; rightAligned = false }
        { name = "Größe"; isSortable = true; rightAligned = true }
        { name = "Version"; isSortable = true; rightAligned = false }
    |]
    
