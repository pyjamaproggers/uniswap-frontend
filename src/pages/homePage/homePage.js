import { Button, Col, Grid, Row, Text } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import HomeBG from '../../assets/HomeImage.jpg'
import pwaStep1 from '../../assets/pwa1.jpg';
import pwaStep2 from '../../assets/pwa2.jpg';
import pwaStep3 from '../../assets/pwa3.jpg';
import './homePage.css'
import BottomNavigation from '@mui/material/BottomNavigation';
import { FaPlus, FaShoppingBag } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import Paper from '@mui/material/Paper';
import { GoHomeFill } from "react-icons/go";

export default function HomePage(props) {
    const [isSignedIn, setIsSignedIn] = useState(false)

    const appRender = props.appRender

    const [showPwaBanner, setShowPwaBanner] = useState(true); // State to show/hide the PWA banner

    const scrollToPwaTutorial = () => {
        pwaTutorialRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Simple mobile detection

    const isPWA = window.matchMedia('(display-mode: standalone)').matches

    // Ref for scrolling to the PWA tutorial section
    const pwaTutorialRef = React.createRef();

    console.log('home: ', localStorage.getItem('userEmail'))

    useEffect(() => {
        localStorage.getItem('userEmail') !== null ? setIsSignedIn(true) : setIsSignedIn(false)
    }, [isSignedIn, appRender])

    return (
        <>
            {isMobile && showPwaBanner && !isPWA && (
                <Grid.Container css={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: '10px',
                    position: 'fixed',
                    top: 0,
                    zIndex: 1000,
                    width: '100%',
                }}>
                    <Col>
                        <Text css={{ color: '$white' }}>
                            You can now get UniSwap as an app. <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { scrollToPwaTutorial(); setShowPwaBanner(false) }}>Find out how</span> or <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setShowPwaBanner(false)}>hide this message</span>
                        </Text>
                    </Col>
                </Grid.Container>
            )}
            <Grid.Container className="homebg" css={{
                jc: 'center',
                alignItems: '',
                height: window.screen.height - 200,
                paddingTop: '25%'
                // padding: '10% 0px 40% 0'
            }}>
                <div className="content">
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }} >
                        <Text css={{
                            '@xsMin': {
                                fontSize: '$3xl',
                                fontWeight: '$semibold'
                            },
                            '@xsMax': {
                                fontSize: '$3xl',
                                fontWeight: '$medium',
                                padding: '0px 8px',
                                lineHeight: '1.3'
                            },
                            textAlign: 'center',
                            color: '$white'
                        }}>
                            Official UniSwap™ Website
                        </Text>
                        {isSignedIn ?
                            <>
                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <Text css={{
                                        '@xsMin': {
                                            fontSize: '$xl',
                                            fontWeight: '$medium',
                                            padding: '0px 0px 8px 0px'
                                        },
                                        '@xsMax': {
                                            fontSize: '$base',
                                            fontWeight: '$medium',
                                            padding: '8px',
                                        },
                                        textAlign: 'center',
                                        color: '$white'
                                    }}>
                                        Looking for Apparel? Food? Tickets? Jewellry? Stationery? We have it all here.
                                    </Text>
                                    <Button auto flat color={'error'} onClick={() => {
                                        window.location.pathname = '/saleitems'
                                    }}>
                                        Items On Sale →
                                    </Button>
                                </Col>
                            </>
                            :
                            <>
                                <Text css={{
                                    '@xsMin': {
                                        fontSize: '$xl',
                                        fontWeight: '$medium'
                                    },
                                    '@xsMax': {
                                        fontSize: '$base',
                                        fontWeight: '$medium',
                                        padding: '8px',
                                    },
                                    textAlign: 'center',
                                    color: '$white'
                                }}>
                                    Please sign in using your university email ID using the google button located at the top-right ↑
                                </Text>

                            </>
                        }
                    </Col>
                </div>
            </Grid.Container>
            {!isPWA && (
                <div className="add-to-home-screen-tutorial" ref={pwaTutorialRef}>
                    <Text css={{ textAlign: 'center', color: '$white', padding: '20px', fontWeight: '$semibold' }}>
                        How do I "Add to Home Screen"?
                    </Text>
                    <div>
                        <img src={pwaStep1} alt="Step 1" style={{ width: '100%', padding: '10px' }} />
                        <Text css={{ textAlign: 'center', color: '$white', fontWeight: '$medium', padding: '0px 20px 20px 20px' }}>Tap the 'Share' icon at the bottom of the screen, or the top right if you're using an iPad (top right 3 dots if adnroid):</Text>
                    </div>
                    <div>
                        <img src={pwaStep2} alt="Step 2" style={{ width: '100%', padding: '10px' }} />
                        <Text css={{ textAlign: 'center', color: '$white', fontWeight: '$medium', padding: '0px 20px 20px 20px' }}>Scroll down and select 'Add to Home Screen' on ios or 'Install app' on android:</Text>
                    </div>
                    <div>
                        <img src={pwaStep3} alt="Step 3" style={{ width: '100%', padding: '10px' }} />
                        <Text css={{ textAlign: 'center', color: '$white', fontWeight: '$medium', padding: '0px 20px 20px 20px' }}>Tap 'Add' on the top right.</Text>
                    </div>
                    <div>
                        <Text css={{ textAlign: 'center', color: '$white', fontWeight: '$medium', padding: '0px 20px 20px 20px' }}>Done! You can now enjoy UniSwap from your home screen.</Text>
                    </div>
                </div>
            )}
        </>
    )
}