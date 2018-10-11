module DirectoryProcessor
open System.IO
open ModelTools
open Model

type SortItem = 
    None = 0
    | Name = 1
    | Extension = 2
    | DateTime = 3

let getItems (path: string) = 

    let di = DirectoryInfo path
    let directoryItems (di: DirectoryInfo) () = GetSafeItems di.GetDirectories 
    let fileItems (di: DirectoryInfo) () = GetSafeItems di.GetFiles
    
    let directoryItems = directoryItems di
    let fileItems = fileItems di

    let directoryItems = 
        directoryItems ()
        |> Array.map (fun item -> {
            name = item.Name
            dateTime = item.LastWriteTime
        })

    // Sorting:
    let descending = false
    let sortItem = SortItem.Name

    let mapItem (item: FileInfo) = {
        name = item.Name
        extension = item.Extension
        dateTime = item.LastWriteTime
    }

    let takeItem (a, _) = a
    let takeSortItem (_, b) = b

    let mapSortName item  = item, (item.name, item.name)
    let mapSortExtension item  = item, (item.extension, item.name)
    let mapSortDateTime item = item, (item.dateTime.ToString "s", item.name)

    let mapSort = 
        match sortItem with
        | SortItem.Name -> mapSortName
        | SortItem.Extension -> mapSortExtension
        | SortItem.DateTime -> mapSortDateTime
        | _ -> mapSortName
    let mapping = (mapItem >> mapSort)
    let sorting = 
        match descending, sortItem with
        | _, SortItem.None -> id
        | true, _ -> Array.sortByDescending takeSortItem
        | false, _ -> Array.sortBy takeSortItem

    let fileItems = 
        fileItems ()
        |> Array.map mapping
        |> sorting
        |> Array.map takeItem
    let result = {
        directoryItems = directoryItems
        fileItems = fileItems
    }
    result
