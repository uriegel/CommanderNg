module Request
open System.Runtime.Serialization
open WebServer
open Commander

[<DataContract>]
type Affe = {
    [<field: DataMember(Name="name")>]
    name: string
    [<field: DataMember(Name="email")>]
    email: string
    [<field: DataMember(Name="nothing", EmitDefaultValue=false)>]
    nothing: string
}

let run request = 
    async {
        match request.header.path with
        | "/close" -> 
            // TODO: POST
            do! Response.asyncSendJson request Seq.empty
            shutdown ()

        | _ -> failwith "Unknown command"

        let urlQuery = UrlQuery.create request.header.path
        let path = urlQuery.Query "path"
        let isVisble = urlQuery.Query "isVisible"
        do! Response.asyncSendJson request {
             name = "Uwe"
             email = "uriegel@hotmail.de"
             nothing = null
        }     
    }