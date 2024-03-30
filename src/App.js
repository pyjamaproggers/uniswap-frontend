import logo from './logo.svg';
import './App.css';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, NextUIProvider } from "@nextui-org/react"
import HomePage from './pages/homePage/homePage';
import ItemsPage from './pages/itemsPage/itemsPage.js';
import CreateSalePage from './pages/createSalePage/createSalePage';
import EditSalePage from './pages/editSalePage/editSalePage';
import { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function App() {

    // const [isLightMode, setIsLightMode] = useState(getPrefersColorScheme() ? 'light' : 'dark');

    // function getPrefersColorScheme() {
    //     return window.matchMedia('(prefers-color-scheme: light)').matches;
    // }

    // useEffect(() => {
    //     const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    //     const handleChange = () => setIsLightMode(mediaQuery.matches ? 'light' : 'dark');

    //     mediaQuery.addEventListener('change', handleChange);

    //     // Cleanup
    //     return () => mediaQuery.removeEventListener('change', handleChange);
    // }, []);


    // const theme = createTheme({
    //     type: isLightMode ? 'light' : 'dark', // Adjusted this line
    //     theme: {
    //         colors: {
    //             // Assuming these color configurations are correct; adjust as necessary.
    //             white: isLightMode ? '#fff' : '#f0f0f0',
    //             black: isLightMode ? '#000' : '#0c0c0c',
    //             background: isLightMode ? '#fff' : '#0c0c0c',
    //             text: isLightMode ? '#000' : '#f0f0f0'
    //         }
    //     }
    // });

    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const script = document.getElementById('GoogleSignin');

        const handleScriptLoad = () => {
            setScriptLoaded(true);
            // After this line, you can call `window.google.accounts.id.initialize` and `window.google.accounts.id.renderButton`
        };

        script.addEventListener('load', handleScriptLoad);

        // If the script is already loaded (e.g., when navigating back to the component), initialize immediately
        if (scriptLoaded || window.google) {
            handleScriptLoad();
        }

        // Cleanup the event listener
        return () => {
            script.removeEventListener('load', handleScriptLoad);
        };
    }, []);

    const theme = createTheme({
        type: 'dark', // Adjusted this line
        theme: {
            colors: {
                // Assuming these color configurations are correct; adjust as necessary.
                white: '#f0f0f0',
                black: '#0c0c0c',
                background: '#0c0c0c',
                text: '#f0f0f0'
            }
        }
    });



    return (
        <>
            {scriptLoaded ?
                <>
                    <NextUIProvider theme={theme}>
                        <Router>
                            <Header />
                            <Routes>
                                <Route exact path='/' element={<HomePage />} />
                                <Route exact path='/saleitems' element={<ItemsPage type={'sale'} />} />
                                <Route exact path='/useritems' element={<ItemsPage type={'user'} />} />
                                <Route exact path='/createsale' element={<CreateSalePage />} />
                                <Route exact path='/editsale' element={<EditSalePage />} />
                            </Routes>
                        </Router>
                        <Footer />
                    </NextUIProvider>
                </>
                :
                <>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={!scriptLoaded}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </>
            }
        </>
    );
}

export default App;
