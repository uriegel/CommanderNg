module ModelTools
open System

let GetSafeItems getItems =
    try 
        getItems ()
    with | :? UnauthorizedAccessException -> [||]   
let private dateTimeMinTicks = (DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).Ticks

let convertTime (dateTime: DateTime) = 
    let jsDataTime = (dateTime.ToUniversalTime().Ticks - dateTimeMinTicks) / 10000L
    jsDataTime.ToString ()

