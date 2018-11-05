module DriveProcessor
open System.IO
open Model

let getDrives () = 
        DriveInfo.GetDrives () 
        |> Array.filter (fun drive -> drive.IsReady)
        |> Array.sortBy (fun n -> n.Name)
        |> Array.map createDriveItem

            // fun d -> Seq.append d [| 
            //                         { kind = "Drive"; parent = null; name = "Registry"; fullname = null; imageUrl = "images/registry.png";
            //                             ext = null; isHidden=false; dateTime = null; fileSize = 0L; }
            //                         { kind = "Drive"; parent = null; name = "Dienste"; fullname = null; imageUrl = "images/service.png";
            //                             ext = null; isHidden=false; dateTime = null; fileSize = 0L }
            //                         { kind = "Drive"; parent = null; name = "Favoriten"; fullname = null; imageUrl = "images/favorite.png";
            //                             ext = null; isHidden=false; dateTime = null; fileSize = 0L } |])

        //let driveResult = { currentDirectory = "drives"; items = Seq.toArray drives }