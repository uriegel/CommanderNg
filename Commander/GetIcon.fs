module GetIcon
open System.Runtime.InteropServices

let getIcon path = 
    if RuntimeInformation.IsOSPlatform OSPlatform.Windows then 
        GetWindowsIcon.getIcon path
    else
        GetLinuxIcon.getIcon path
