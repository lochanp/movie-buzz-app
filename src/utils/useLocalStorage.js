import { useEffect, useState } from "react"

export function useLocalStorage(initialState,key) {
    const [value, setvalue] = useState(() => !JSON.parse(localStorage.getItem(key)) ? [] : JSON.parse(localStorage.getItem(key)))
    useEffect(() => {
        localStorage.setItem(key,JSON.stringify(value))
      }, [value,key])

      return [value,setvalue]
}

