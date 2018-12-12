module GetWindowsIcon
open System
open System.IO
open System.Drawing
open System.Drawing.Imaging
open System.Runtime.InteropServices

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

