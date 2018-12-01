module RequestState
open System.Collections.Concurrent

let private recentRequests = new ConcurrentDictionary<int, int>()

let updateRecentRequest callerId requestId =
    recentRequests.[callerId] <- requestId

let getRecentRequest callerId = recentRequests.[callerId]
