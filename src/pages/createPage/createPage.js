import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setUserItems } from '../../slices/userItemsSlice';
import { useNavigate } from 'react-router-dom';
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Col, Grid, Input, Text, Row, Badge, Avatar, useTheme, Button } from "@nextui-org/react";
import ItemCard from "../../components/items/itemCard";
import Skeleton from '@mui/material/Skeleton';
import { IoSearchSharp } from "react-icons/io5";
import './createPage.css'
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
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // basic Swiper styles
import 'swiper/css/navigation'; // optional for navigation
import Segmentation from "../../components/segmentation/segmentation";
import CreateSalePage from "../createSalePage/createSalePage";
import CreateEventPage from "../createEventPage/createEventPage";


export default function CreatePage() {

    const [bgColor, setBgColor] = useState('')
    const NextUITheme = useTheme()
    const [topImageLoading, setTopImageLoading] = useState(true)
    const [pageIndex, setPageIndex] = useState(0)
    const [pageValue, setPageValue] = useState([
        'Sale',
        'Event',
        // 'Service'
    ])
    const swiperRef = useRef(null)
    const [isScrolling, setIsScrolling] = useState(false);
    const theme = useTheme()
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);

    function getBackgroundColor(value, theme) {
        const colorMap = {
            'Sale': theme.type === 'light' ? '#EADCF8' : '#1F0A33',
            'Event': theme.type === 'light' ? '#CEE4FE' : '#10253E',
            'Service': theme.type === 'light' ? '#DAFBE8' : '#042F14',
        };
        return colorMap[value] || '#FFF'; // Default color if value is not found
    }

    function getTextColor(value, theme) {
        const colorMap = {
            'Sale': theme.type === 'light' ? '#7828C8' : '#B583E7',
            'Event': theme.type === 'light' ? '#0072F5' : '#3694FF',
            'Service': theme.type === 'light' ? '#17C964' : '#78F2AD',
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

    useEffect(() => {
        swiperRef.current.slideTo(pageIndex)
    }, [pageIndex])

    // Effect to add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            // Adjust the condition based on the exact needs, e.g., compare with a ref's current position
            const shouldBeSticky = window.scrollY > 100; // adjust 100 to the offset where you want it to expand
            setIsSticky(shouldBeSticky);
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Grid.Container css={{
            jc: 'center',
        }}>
            <div style={{
                position: 'absolute',
                top: '16px',
                left: '15px'
            }}
                onClick={() => navigate(-1)}>
                <FaChevronLeft size={16} color={theme.type === 'light' ? "#0c0c0c" : "#f0f0f0"} />
            </div>

            <Text css={{
                '@xsMin': {
                    fontSize: '$2xl'
                },
                '@xsMax': {
                    fontSize: '$lg'
                },
                fontWeight: '$semibold',
                marginBottom: '10px',
                marginTop: '10px',
                width:'100%',
                textAlign: 'center'
            }}>
                Create Post
            </Text>
            <div
                style={{
                    width: isSticky ? '100vw' : '90vw',
                    justifyContent: 'center',
                    display: 'flex',
                    position: 'sticky',
                    top: '0px',  // This should be the height of the image or however tall the sticky element is
                    zIndex: 1000,
                    transition: 'width 0.1s ease-in-out'
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
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                allowTouchMove={!isScrolling}
            >
                <SwiperSlide><CreateSalePage /></SwiperSlide>
                <SwiperSlide><CreateEventPage /></SwiperSlide>
            </Swiper>

        </Grid.Container>
    )
}