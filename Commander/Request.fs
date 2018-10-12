module Request
open WebServer
open Commander

let requestOK (headers: WebServer.RequestHeaders) = headers.path.StartsWith "/request"

let run request = 
    async {
        let query = UrlQuery.create request.data.header.path
        match query.method with
        | "get" ->
            let path = query.Query "path"
            match path with
            | Some path ->
                let test = DirectoryProcessor.getItems path
                let str = Json.serialize test
                do! Response.asyncSendJsonString request str
            | None -> do! Response.asyncSendJsonString request ""
        | "close" -> 
            close ()
            do! Response.asyncSendJson request Seq.empty
            shutdown ()
        | _ -> failwith "Unknown command"
    }