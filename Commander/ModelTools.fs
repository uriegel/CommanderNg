module ModelTools
open System

let GetSafeItems getItems =
    try 
        getItems ()
    with | :? UnauthorizedAccessException -> [||]   
