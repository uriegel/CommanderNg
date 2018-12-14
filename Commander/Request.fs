module Request
open System
open Directory
open Drives
open Model
open WebServer
open GetIcon

let requestOK (headers: WebServer.RequestHeaders) = headers.path.StartsWith "/request"

let (|DirectoryPath|_|) (path, basePath) = 
    match (path, basePath) with
    | (Some "..", Some basePath) when String.length basePath > minPathLength 
        -> Some (combinePath basePath "..")
    | (Some path, None) when path <> ROOT && path <> ".." -> Some path
    | (Some path, Some basePath) when path <> ROOT && path <> ".." -> Some (combinePath basePath path)
    | _ -> None

let (|Root|_|) (path, basePath) = 
    match (path, basePath) with
    | (Some "..", Some basePath) when String.length basePath <= minPathLength -> Some ROOT
    | (Some path, _) when path = ROOT -> Some path
    //| (Some path, Some basePath) when path <> ROOT -> Some (combinePath basePath path)
    | _ -> None

let run request = 
    let notModified = DateTime.Parse("02.02.2012 14:00")
    
    let query = UrlQuery.create request.data.header.path

    let requestId = query.Query "requestId"
    let callerId = query.Query "callerId"
    let columnsName = query.Query "columnsName"
    let path = query.Query "path"
    let basePath = query.Query "basePath"
    async {

        let sendResult (getResult: Model.GetResult) = 
            async {
            let str = Json.serialize getResult.response
            do! Response.asyncSendJsonString request str
            match getResult.continuation with
            | Some continuation -> continuation ()
            | None -> ()
        }

        let withColumns path = 
            match columnsName with
            | Some columnsName -> 
                printfn "Affe %s" columnsName
                if path = ROOT then columnsName <> ROOT else columnsName = ROOT
            | None -> true

        match query.method with
        | "get" ->
            let response = 
                match (path, basePath) with
                | DirectoryPath path ->
                        match (requestId, callerId) with
                        | (Some requestId, Some callerId) -> Some (getDirectoryItems path (int requestId) callerId (withColumns path))
                        | _ -> None
                | Root _ -> Some (getRoot (withColumns ROOT))
                | _ -> None
            match response with
            | Some response -> 
                let getResult = {
                    response = {
                        response.response with
                            itemToSelect =  
                                match (path, basePath) with
                                | (Some "..", Some basePath) -> Some (getPath basePath)
                                | _ -> None
                    }
                    continuation = response.continuation
                }
                do! sendResult getResult
            | None -> do! FixedResponses.asyncSendServerError request
        | "icon" ->
            let! bytes = getIcon <| query.Query "path"
            do! Response.asyncSendFileBytes request "image/png" notModified (Some bytes)
        | _ -> do! FixedResponses.asyncSendServerError request
    }