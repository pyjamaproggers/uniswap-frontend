import logo from './assets/UniSwap2.PNG';
import './App.css';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, NextUIProvider } from "@nextui-org/react"
import HomePage from './pages/homePage/homePage';
import Itemspage from './pages/ItemsPage/ItemsPage'
import CreateSalePage from './pages/createSalePage/createSalePage';
import EditSalePage from './pages/editSalePage/editSalePage';
import OutletsPage from './pages/outletsPage/outletsPage';
import { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorAuthPage from './pages/ErrorAuthPage/ErrorAuthPage';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4'
import { store } from './store';
import SaleItemsPage from './pages/saleItemsPage/saleItemsPage';
import UserItemsPage from './pages/userItemsPage/userItemsPage';
import FavouritesItemsPage from './pages/favouriteItemsPage/favouriteItemsPage';
import InstallPWA from './components/installPWA/installPWA';

function App() {

    const [isLightMode, setIsLightMode] = useState(getPrefersColorScheme());

    function getPrefersColorScheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches;
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        console.log(mediaQuery.matches)
        const handleChange = () => setIsLightMode(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleChange);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [isLightMode]);

    console.log('isLightMode: ',isLightMode)

    const theme = createTheme({
        type: isLightMode ? 'light' : 'dark', // Adjusted this line
        theme: {
            colors: {
                // Assuming these color configurations are correct; adjust as necessary.
                white: isLightMode ? '#fff' : '#f0f0f0',
                black: isLightMode ? '#000' : '#0c0c0c',
                background: isLightMode ? '#fff' : '#0c0c0c',
                text: isLightMode ? '#000' : '#f0f0f0'
            }
        }
    });

    const [scriptLoaded, setScriptLoaded] = useState(false);

    const [appRender, setAppRender] = useState(false)

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

    // const theme = createTheme({
    //     type: 'dark', // Adjusted this line
    //     theme: {
    //         colors: {
    //             // Assuming these color configurations are correct; adjust as necessary.
    //             white: '#f0f0f0',
    //             black: '#0c0c0c',
    //             background: '#0c0c0c',
    //             text: '#f0f0f0'
    //         }
    //     }
    // });

    const isPWA = window.matchMedia('(display-mode: standalone)').matches
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    return (

        <>
            {isPWA ?
                <>
                    {scriptLoaded ?
                        <>
                            <NextUIProvider theme={theme}>
                                <Router>
                                    <Header setAppRender={setAppRender} />
                                    <Routes>
                                        <Route exact path='/' element={<HomePage appRender={appRender} />} />
                                        {/* <Route exact path='/saleitems' element={<Itemspage type={'sale'} />} /> */}
                                        <Route exact path='/saleitems' element={<SaleItemsPage />} />
                                        <Route exact path='/useritems' element={<UserItemsPage />} />
                                        <Route exact path='/favourites' element={<FavouritesItemsPage />} />
                                        <Route exact path='/createsale' element={<CreateSalePage />} />
                                        <Route exact path='/editsale' element={<EditSalePage />} />
                                        <Route exact path='/outlets' element={<OutletsPage />} />
                                        <Route exact path='/unauthorized' element={<ErrorAuthPage />} />
                                    </Routes>
                                </Router>
                                <Footer />
                            </NextUIProvider>
                        </>
                        :
                        <>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#0c0c0c' }}
                                open={!scriptLoaded}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </>
                    }
                </>
                :
                <>
                    <NextUIProvider theme={theme}>
                        <InstallPWA isIOS={isIOS} isAndroid={isAndroid} />
                    </NextUIProvider>
                </>
            }
        </>
    );
}

export default App;
