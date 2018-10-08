module ModelTools
open System

let GetSafeItems getItems =
    try 
        getItems ()
        |> Array.toList
    with | :? UnauthorizedAccessException -> []   
