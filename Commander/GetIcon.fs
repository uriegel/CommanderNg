module GetIcon
open System
open System.IO
open System.Diagnostics
open System.Drawing
open System.Drawing.Imaging
open System.Runtime.InteropServices
open System.Text

let pythonPath = Path.Combine (Directory.GetCurrentDirectory (), "geticon.py")

if RuntimeInformation.IsOSPlatform OSPlatform.Linux then 
    let pythonCode = """import mimetypes
import gio
import gtk
import sys
def get_icon_path(extension, size=16):
    type_, encoding = mimetypes.guess_type('x.' + extension)
    if type_:
        icon = gio.content_type_get_icon(type_)
        theme = gtk.icon_theme_get_default()
        info = theme.choose_icon(icon.get_names(), size, 0)
        if info:
            return info.get_filename()
print(get_icon_path(sys.argv[1]))"""

    use streamWriter = File.Create pythonPath
    let bytes = Encoding.UTF8.GetBytes pythonCode
    streamWriter.Write (bytes, 0, bytes.Length)

let getIcon (ext: string option) =
    let getWindowsIcon () = async {
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

    let getLinuxIcon () = async {
            let psi = ProcessStartInfo ()
            psi.FileName <- "python"
            let ext = 
                match ext with
                | Some ext when ext = "" -> ".txt"
                | Some ext -> ext
                | None -> ".txt"
            psi.Arguments <- sprintf "\"%s\" \"%s\"" pythonPath ext
            psi.CreateNoWindow <- true
            psi.RedirectStandardOutput <- true
            psi.RedirectStandardInput <- true
            use proc = Process.Start psi
            use reader = proc.StandardOutput
            let result = reader.ReadToEnd () // TODO: async
            let result = Str.substringLength 0 (result.Length - 1) result
            use file = File.OpenRead result
            let bytes = Array.zeroCreate (int file.Length)
            file.Read (bytes, 0, bytes.Length) |> ignore
            return bytes
        }
       
    if RuntimeInformation.IsOSPlatform OSPlatform.Windows then 
        getWindowsIcon ()
    else
        getLinuxIcon ()
