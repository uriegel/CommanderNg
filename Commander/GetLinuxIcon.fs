module GetLinuxIcon
open System.IO
open System.Diagnostics
open System.Text
open Memoize

let private pythonPath = Path.Combine (Directory.GetCurrentDirectory (), "geticon.py")

let private computeIconPath ext = 
    printfn "Aufruf: %s" ext
    let psi = ProcessStartInfo ()
    psi.FileName <- "python"
    psi.Arguments <- sprintf "\"%s\" \"%s\"" pythonPath ext
    psi.CreateNoWindow <- true
    psi.RedirectStandardOutput <- true
    psi.RedirectStandardInput <- true
    use proc = Process.Start psi
    use reader = proc.StandardOutput
    reader.ReadToEnd () // TODO: async

let rec private getIconPathWithFallback ext = 
    let result = computeIconPath ext
    if result.Length > 3 then
        result |> Str.substringLength 0 (result.Length - 1) 
    else
        getIconPathWithFallback ".txt"

let private getIconPath = memoize getIconPathWithFallback

let private initialize () = 
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

initialize ()

let getIcon (ext: string option) = async {
        let ext = 
            match ext with
            | Some ext when ext = "" -> ".txt"
            | Some ext -> ext
            | None -> ".txt"
        
        let iconPath = getIconPath ext
        use file = File.OpenRead iconPath
        let bytes = Array.zeroCreate (int file.Length)
        file.Read (bytes, 0, bytes.Length) |> ignore
        return bytes
    }
       
