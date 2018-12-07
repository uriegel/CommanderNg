module Drives
open System.IO
open Model

[<Literal>]
let ROOT = "root"

let getRoot withColumns = 
        let getResponseDriveItem index (item: DriveInfo) = { 
                itemType = ItemType.Directory
                index = index
                icon = "Drive"
                items = [| item.Name; item.VolumeLabel; string item.TotalSize |] 
                isCurrent = index = 0 //indexToSelect
                isHidden = false
            }

        let responseItems = 
            DriveInfo.GetDrives () 
            |> Array.filter (fun drive -> drive.IsReady)
            |> Array.sortBy (fun n -> n.Name)
            |> Array.mapi getResponseDriveItem

            // fun d -> Seq.append d [| 
            //                         { kind = "Drive"; parent = null; name = "Registry"; fullname = null; imageUrl = "images/registry.png";
            //                             ext = null; isHidden=false; dateTime = null; fileSize = 0L; }
            //                         { kind = "Drive"; parent = null; name = "Dienste"; fullname = null; imageUrl = "images/service.png";
            //                             ext = null; isHidden=false; dateTime = null; fileSize = 0L }
            //                         { kind = "Drive"; parent = null; name = "Favoriten"; fullname = null; imageUrl = "images/favorite.png";
            //                             ext = null; isHidden=false; dateTime = null; fileSize = 0L } |])

            //let driveResult = { currentDirectory = "drives"; items = Seq.toArray drives }

        let getColumns () = {
                name = ROOT
                values = [| 
                    { name = "Name"; isSortable = true; columnsType = ColumnsType.String }
                    { name = "Bezeichnung"; isSortable = true; columnsType = ColumnsType.String }
                    { name = "Größe"; isSortable = true; columnsType = ColumnsType.Size }
                |]                
            }

        { 
            response = { 
                path = ROOT
                items = Some responseItems 
                columns = if withColumns then Some (getColumns ()) else None 
            }
            continuation = None
        }
