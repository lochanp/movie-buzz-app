import { useEffect } from 'react';

export function useKey(key,action) {
    useEffect(() => {
        const keypress = (e) => {
            if(e.code.toLowerCase() ===key.toLowerCase()) {
              action();
            }
          }
        document.addEventListener('keydown',keypress)
    
        return () => {
            document.removeEventListener('keydown',keypress)
        }
      }, [action,key])
}