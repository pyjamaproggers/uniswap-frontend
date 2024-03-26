import React, { useEffect, useState } from "react";
import BottomNavigation from '@mui/material/BottomNavigation';

export default function MobileNavbar() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Handler to call on window resize
        const handleResize = () => {
            // Set window width to state
            setWindowWidth(window.innerWidth);
        };
        // Add event listener
        window.addEventListener('resize', handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [render]); // Empty array ensures that effect is only run on mount and unmount
    return(
        <>
            {windowWidth<=650 &&
                <BottomNavigation>
                    
                </BottomNavigation>
            }
        </>
    )
}