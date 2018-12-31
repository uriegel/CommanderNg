export let repeatKey = (repeated: boolean, process: () => void) => {
    let isLooping = false

    let processLoop = () => {
        if (isLooping) {
            process()
            setTimeout(() => processLoop())
        }
    }

    if (!repeated) 
        process()
    else {
        let onkeyDown = function (evt: KeyboardEvent) {
            evt.stopPropagation()
            evt.preventDefault()
        }

        let onkeyUp = function () {
            isLooping = false
            document.removeEventListener("keydown", onkeyDown, true)
            document.removeEventListener("keyup", onkeyUp, true)
        }

        document.addEventListener("keydown", onkeyDown, true)
        document.addEventListener("keyup", onkeyUp, true)
        isLooping = true
        setTimeout(() => processLoop())
    }
}