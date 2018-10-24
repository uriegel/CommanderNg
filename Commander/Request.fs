module Request
open System
open System.IO
open System.Drawing
open System.Drawing.Imaging
open System.Runtime.InteropServices
open Commander
open Model
open WebServer
let (| IsCommanderView | _ |) (arg: UrlQueryType) = 
    match arg.Query "commanderView" with
    | Some commanderView -> 
        match LanguagePrimitives.EnumOfValue<int, CommanderView> <| int commanderView with
        | CommanderView.Left -> Some Commander.leftProcessor
        | CommanderView.Right -> Some Commander.leftProcessor
        | _ -> None
    | _ -> None

let requestOK (headers: WebServer.RequestHeaders) = headers.path.StartsWith "/request"

let getIcon (ext: string option) (idStrOption: string option) = async {

    // TODO: NoCache set -> no cache!
    let rec getIconHandle callCount = async {
        match ext with 
        | None -> return (Icon.ExtractAssociatedIcon @"C:\Windows\system32\SHELL32.dll").Handle
        | Some ext ->
            let path = 
                match idStrOption with
                | Some id -> 
                    let path = 
                        match LanguagePrimitives.EnumOfValue<int, CommanderView> <| int id with 
                        | CommanderView.Left -> Commander.leftProcessor.getCurrentPath ()
                        | _ -> Commander.rightProcessor.getCurrentPath ()
                    Path.Combine (path, ext)
                | None -> ext
            let mutable shinfo = Api.ShFileInfo () 
            Api.SHGetFileInfo (path, Api.FileAttributeNormal, &shinfo, Marshal.SizeOf shinfo, 
                Api.SHGetFileInfoConstants.ICON 
                ||| Api.SHGetFileInfoConstants.SMALLICON 
                ||| Api.SHGetFileInfoConstants.USEFILEATTRIBUTES 
                ||| Api.SHGetFileInfoConstants.TYPENAME) |> ignore
            if shinfo.hIcon <> IntPtr.Zero then
                return shinfo.hIcon
            else
                match Marshal.GetLastWin32Error () with
                | 997 when callCount < 3 ->
                    do! Async.Sleep 20
                    return! getIconHandle <| callCount + 1
                | _ -> return (Icon.ExtractAssociatedIcon @"C:\Windows\system32\SHELL32.dll").Handle
    }

    let! iconHandle = getIconHandle 0
    use icon = Icon.FromHandle iconHandle
    use bitmap = icon.ToBitmap ()
    let ms = new MemoryStream()
    bitmap.Save (ms, ImageFormat.Png)
    ms.Capacity <- int ms.Length
    Api.DestroyIcon iconHandle |> ignore
    return ms.GetBuffer ()
}
let run request = 
    async {
        let query = UrlQuery.create request.data.header.path
        match query.method with
        | "get" ->
            let path = query.Query "path"
            let processor = 
                match query with
                | IsCommanderView processor -> Some processor
                | _ -> None
            match processor with
            | Some processor -> 
                let response = processor.get path
                let str = Json.serialize response
                do! Response.asyncSendJsonString request str
            | None -> do! Response.asyncSendJsonString request ""        
        | "setTheme" -> 
            let theme = query.Query "theme"                        
            match theme with
            | Some theme -> setTheme theme
            | None -> ()
        | "icon" ->
            let! bytes = getIcon <| query.Query "path" <| query.Query "id"
            do! Response.asyncSendFileBytes request "image/png" (Some bytes)
        | "close" -> 
            close ()
            do! Response.asyncSendJson request Seq.empty
            shutdown ()
        | _ -> failwith "Unknown command"
    }