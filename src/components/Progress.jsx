import { useEffect, useState } from "react"

export default function Progress({max}) {
    const [timer, setTimer] = useState(max)
    useEffect(() => {
        const time = setInterval(()=>{
            setTimer((prevTime) => prevTime - 10)
        }, 10)
        return ()=>{
            clearInterval(time)

        }
    }, [])
    return <progress value={timer} max={max}></progress>
}