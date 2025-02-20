import { useEffect, useState } from "react";


const useGetWindowDimension = () => {
    
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile = width <= 720;

    useEffect(() => {
        const setWindowWidth = () => {
            setWidth(window.innerWidth);
        };

        setWindowWidth();
        window.addEventListener('resize', setWindowWidth);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', setWindowWidth);
        };
    }, []);

    return { 
        width,
        isMobile
    }
}

export default useGetWindowDimension;