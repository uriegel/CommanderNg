module DirectoryProcessor
open System.IO
open ModelTools
open Model

type SortItem = 
    | Name = 0
    | Extension = 1
    | DateTime = 2

let getItems path = 

    let di = DirectoryInfo path
    let directoryItems (di: DirectoryInfo) () = GetSafeItems di.GetDirectories 
    let fileItems (di: DirectoryInfo) () = GetSafeItems di.GetFiles
    
    let directoryItems = directoryItems di
    let fileItems = fileItems di

    let sortByName item = Str.toLower item.name

    let directoryItems = 
        directoryItems () 
        |> Array.map createDirectoryItem
        |> Array.sortBy sortByName

    // Sorting:
    let descending = false
    let sortItem = SortItem.Name

    let takeItem (a, _) = a
    let takeSortItem (_, b) = b

    let mapSortName item  = item, (Str.toLower item.name, Str.toLower item.name)
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
    let result = {
        items = Array.concat [| [| createParentItem () |] ; directoryItems ; fileItems |]
    }
    result
