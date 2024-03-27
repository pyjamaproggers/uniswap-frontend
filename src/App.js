import logo from './logo.svg';
import './App.css';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, NextUIProvider } from "@nextui-org/react"
import HomePage from './pages/homePage/homePage';
import AllItemsPage from './pages/allItemsPage/allItemsPage';
import CreateSalePage from './pages/createSalePage/createSalePage';

function App() {

    const theme = createTheme({
        type: 'light',
        theme: {
            colors: {
                white: '#ffffff',
                black: '#000000',
            }
        }
    })


    return (
        <>
            <NextUIProvider theme={theme}>
                <Router>
                <Header />
                    <Routes>
                        <Route exact path='/' element={<HomePage />} />
                        <Route exact path='/saleitems' element={<AllItemsPage />} />
                        <Route exact path='/createsale' element={<CreateSalePage />} />
                    </Routes>
                </Router>
                <Footer />
            </NextUIProvider>
        </>
    );
}

export default App;
