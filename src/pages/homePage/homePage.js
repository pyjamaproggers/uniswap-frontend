import { Button, Col, Grid, Row, Text } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import HomeBG from '../../assets/HomeImage.jpg'
import './homePage.css'
import BottomNavigation from '@mui/material/BottomNavigation';
import { FaPlus, FaShoppingBag } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import Paper from '@mui/material/Paper';
import { GoHomeFill } from "react-icons/go";

export default function HomePage() {
    const [isSignedIn, setIsSignedIn] = useState(false)

    console.log('home: ', localStorage.getItem('userEmail'))

    useEffect(() => {
        localStorage.getItem('userEmail') !== null ? setIsSignedIn(true) : setIsSignedIn(false)
    }, [])

    return (
        <Grid.Container className="homebg" css={{
            jc: 'center',
            alignItems: 'center',
            height: window.screen.height - 76
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
                            fontWeight: '$semibold',
                            padding: '0px 8px',
                            lineHeight: '1.3'
                        },
                        textAlign: 'center',
                        color: '$white'
                    }}>
                        Official Ashoka University UniSwap™ Website
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
                                Please sign in using your ashoka email ID using the google button located at the top-right ↑
                            </Text>
                            
                        </>
                    }
                </Col>
            </div>
        </Grid.Container>
    )
}