module Request
open System
open System.IO
open System.Drawing
open System.Drawing.Imaging
open System.Runtime.InteropServices
open Directory
open Drives
open WebServer

let requestOK (headers: WebServer.RequestHeaders) = headers.path.StartsWith "/request"

let run request = 
    let notModified = DateTime.Parse("02.02.2012 14:00")
    
    let getIcon (ext: string option) = async {

        let rec getIconHandle callCount = async {
            match ext with 
            | Some ext -> 
                let mutable shinfo = Api.ShFileInfo () 
                Api.SHGetFileInfo (ext, Api.FileAttributeNormal, &shinfo, Marshal.SizeOf shinfo, 
                    Api.SHGetFileInfoConstants.ICON 
                    ||| Api.SHGetFileInfoConstants.SMALLICON 
                    ||| Api.SHGetFileInfoConstants.USEFILEATTRIBUTES 
                    ||| Api.SHGetFileInfoConstants.TYPENAME) |> ignore
                if shinfo.hIcon <> IntPtr.Zero then
                    return shinfo.hIcon
                else
                    if callCount < 3 then
                        do! Async.Sleep 20
                        return! getIconHandle <| callCount + 1
                    else 
                        return (Icon.ExtractAssociatedIcon @"C:\Windows\system32\SHELL32.dll").Handle
            | None -> return (Icon.ExtractAssociatedIcon @"C:\Windows\system32\SHELL32.dll").Handle
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

    let query = UrlQuery.create request.data.header.path

    let requestId = query.Query "requestId"
    let callerId = query.Query "callerId"
    let withColumns = query.Query "withColumns" = Some "true"
    let path = query.Query "path"
    async {
        match query.method with
        | "get" ->
            match path with
            | Some path ->
                let response = 
                    match path with
                    | "root" -> Some (getRoot withColumns)
                    | _ -> 
                        match (requestId, callerId) with
                        | (Some requestId, Some callerId) -> Some (getDirectoryItems path (int requestId) (int callerId) withColumns)
                        | _ -> None

                match response with
                | Some response ->
                    let str = Json.serialize response.response
                    do! Response.asyncSendJsonString request str
                    match response.continuation with
                    | Some continuation -> continuation ()
                    | None -> ()
                | None -> do! FixedResponses.asyncSendServerError request
            | None -> do! FixedResponses.asyncSendServerError request
        | "icon" ->
            let! bytes = getIcon <| query.Query "ext"
            do! Response.asyncSendFileBytes request "image/png" notModified (Some bytes)
        | _ -> do! FixedResponses.asyncSendServerError request
    }




