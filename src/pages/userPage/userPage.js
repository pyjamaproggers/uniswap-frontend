import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setUserItems } from '../../slices/userItemsSlice';
import { useNavigate } from 'react-router-dom';
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Col, Grid, Input, Text, Row, Badge, Avatar, useTheme, Button } from "@nextui-org/react";
import ItemCard from "../../components/items/itemCard";
import Skeleton from '@mui/material/Skeleton';
import { IoSearchSharp } from "react-icons/io5";
import './userPage.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import PullToRefresh from 'react-simple-pull-to-refresh';
import ColorThief from 'colorthief';
import { FaChevronLeft } from "react-icons/fa";
import FlatList from 'flatlist-react';
import UserItemsPage from "../userItemsPage/userItemsPage";
import FavouritesItemsPage from "../favouriteItemsPage/favouriteItemsPage";
import { Segmented, Carousel } from 'antd';
import { ConfigProvider } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // basic Swiper styles
import 'swiper/css/navigation'; // optional for navigation
import Segmentation from "../../components/segmentation/segmentation";
import ServicesPage from "../servicesPage/servicesPage";
import EventsPage from "../eventsPage/eventsPage";


export default function UserPage() {

    const [bgColor, setBgColor] = useState('')
    const NextUITheme = useTheme()
    const [topImageLoading, setTopImageLoading] = useState(true)
    const [pageIndex, setPageIndex] = useState(0)
    const [pageValue, setPageValue] = useState([
        'Up For Sale',
        'Favourites',
        'Events',
        'Services'
    ])
    const swiperRef = useRef(null)

    function getBackgroundColor(value, theme) {
        const colorMap = {
            'Favourites': theme.type === 'light' ? '#FDD8E5' : '#300313',
            'Up For Sale': theme.type === 'light' ? '#EADCF8' : '#1F0A33',
            'Events': theme.type === 'light' ? '#CEE4FE' : '#10253E',
            'Services': theme.type === 'light' ? '#DAFBE8' : '#042F14',
        };
        return colorMap[value] || '#FFF'; // Default color if value is not found
    }

    function getTextColor(value, theme) {
        const colorMap = {
            'Favourites': theme.type === 'light' ? '#F31260' : '#F31260',
            'Up For Sale': theme.type === 'light' ? '#7828C8' : '#B583E7',
            'Events': theme.type === 'light' ? '#0072F5' : '#3694FF',
            'Services': theme.type === 'light' ? '#17C964' : '#78F2AD',
        };
        return colorMap[value] || '#FFF'; // Default color if value is not found
    }

    useEffect(() => {
        // Generate avatar URL
        let username = localStorage.getItem('userName')
        // let username = 'ravina'
        const avatarApiUrl = `https://api.multiavatar.com/${username}.png?apikey=Bvjs0QyHcCxZNe`;
        // setAvatarUrl(avatarApiUrl);

        // // Load image and extract color
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // This is needed to avoid CORS issues when loading images
        img.src = avatarApiUrl;
        img.onload = () => {
            const colorThief = new ColorThief();
            const [r, g, b] = colorThief.getColor(img);
            const dominantColor = `rgb(${r}, ${g}, ${b})`;
            setBgColor(dominantColor);
        };
    }, []);

    useEffect(()=>{
        swiperRef.current.slideTo(pageIndex)
    }, [pageIndex])

    return (
        <Grid.Container css={{
            jc: 'center',
        }}>
            <>
                {bgColor.length > 0 &&
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderColor: '#0c0c0c',
                        marginBottom: '40px'
                    }}>
                        <img
                            width={'100%'}
                            height={60}
                            style={{
                                background: `linear-gradient(to bottom, ${bgColor}, ${NextUITheme.theme.colors.background.value})`,
                                // backgroundColor: bgColor,
                                filter: 'blur(40px)'
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '20px',
                            }}
                        >
                            <img
                                src={`https://api.multiavatar.com/${localStorage.getItem('userName')}.png?apikey=Bvjs0QyHcCxZNe`}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 40,
                                }}
                                onLoad={() => {
                                    setTopImageLoading(false)
                                }}
                            />
                        </div>
                    </Col>
                }
            </>
            <div
                style={{
                    width: '90vw',
                    justifyContent: 'center',
                }}
            >
                <Segmentation
                    pageValue={pageValue}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    getBackgroundColor={getBackgroundColor}
                    getTextColor={getTextColor}
                />
            </div>

            <Swiper
                onActiveIndexChange={(swiper) => {
                    setPageIndex(swiper.activeIndex); // Update pageIndex when the slide changes
                }}
                initialSlide={pageIndex}
                onSwiper={(swiper)=>{
                    swiperRef.current=swiper
                }}
            >
                <SwiperSlide><UserItemsPage /></SwiperSlide>
                <SwiperSlide><FavouritesItemsPage /></SwiperSlide>
                <SwiperSlide><EventsPage /></SwiperSlide>
                <SwiperSlide><ServicesPage /></SwiperSlide>
            </Swiper>

        </Grid.Container>
    )
}