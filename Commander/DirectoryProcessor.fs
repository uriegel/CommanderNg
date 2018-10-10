module DirectoryProcessor
open System.IO
open ModelTools
open Model

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

    // TODO:
    //|> Array.sortByDescending (fun n -> n.Extension, n.Name)
    let fileItems = 
        fileItems ()
        |> Array.map (fun item -> {
            name = item.Name
            extension = "Ext"
            dateTime = item.LastWriteTime.ToString "s"
        })
        |> Array.sortByDescending (fun n -> n.dateTime)
    let result = {
        directoryItems = directoryItems
        fileItems = fileItems
    }
    result
