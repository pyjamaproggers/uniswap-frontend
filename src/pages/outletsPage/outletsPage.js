import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Rasananda from '../../assets/Rasananda.jpeg';
import Dhaba from '../../assets/Dhaba.jpeg';
import RotiBoti from '../../assets/RotiBotiOrder.jpeg';
import ChicagoPizza from '../../assets/ChicagoPizzaOrder.jpeg';
import Subway from '../../assets/Subway.jpeg';
import Dosai from '../../assets/Dosai.jpeg';
import FoodVillage from '../../assets/FoodVillageHome.jpeg';
import FuelZone from '../../assets/FuelZone.jpeg';
import THC from '../../assets/THC.jpeg';
import LocoMoko from '../../assets/LocoMoko.jpeg';
import Nescafe from '../../assets/Nescafe.jpeg';
import Amul from '../../assets/Amul.jpeg';
import Grey from '../../assets/Grey.jpeg';
import { Avatar, Badge, Col, Grid, Image as NextUIImage, Link, Row, Text, useTheme } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import './outletsPage.css'; // Make sure you have this CSS file ready
import THC1 from '../../assets/OutletMenus/THC/THC1.png';
import THC2 from '../../assets/OutletMenus/THC/THC2.png';
import THC3 from '../../assets/OutletMenus/THC/THC3.png';
import THC4 from '../../assets/OutletMenus/THC/THC4.png';
import THC5 from '../../assets/OutletMenus/THC/THC5.png';
import THC6 from '../../assets/OutletMenus/THC/THC6.png';
import THC7 from '../../assets/OutletMenus/THC/THC7.png';
import THC8 from '../../assets/OutletMenus/THC/THC8.png';
import THC9 from '../../assets/OutletMenus/THC/THC9.png';
import THC10 from '../../assets/OutletMenus/THC/THC10.png';
import THC11 from '../../assets/OutletMenus/THC/THC11.png';
import THC12 from '../../assets/OutletMenus/THC/THC12.png';
import THC13 from '../../assets/OutletMenus/THC/THC13.png';
import THC14 from '../../assets/OutletMenus/THC/THC14.png';
import THC15 from '../../assets/OutletMenus/THC/THC15.png';
import THC16 from '../../assets/OutletMenus/THC/THC16.png';
import THC17 from '../../assets/OutletMenus/THC/THC17.png';
import THC18 from '../../assets/OutletMenus/THC/THC18.png';
import THC19 from '../../assets/OutletMenus/THC/THC19.png';
import THC20 from '../../assets/OutletMenus/THC/THC20.png';
import THC21 from '../../assets/OutletMenus/THC/THC21.png';
import THC22 from '../../assets/OutletMenus/THC/THC22.png';
import THC23 from '../../assets/OutletMenus/THC/THC23.png';
import THC24 from '../../assets/OutletMenus/THC/THC24.png';
import THC25 from '../../assets/OutletMenus/THC/THC25.png';
import RB1 from '../../assets/OutletMenus/Roti Boti/RB1.jpg';
import RB2 from '../../assets/OutletMenus/Roti Boti/RB2.jpg';
import RB3 from '../../assets/OutletMenus/Roti Boti/RB3.jpg';
import RB4 from '../../assets/OutletMenus/Roti Boti/RB4.jpg';
import RB5 from '../../assets/OutletMenus/Roti Boti/RB5.jpg';
import D1 from '../../assets/OutletMenus/Dhaba/D1.jpg';
import D2 from '../../assets/OutletMenus/Dhaba/D2.jpg';
import CP1 from '../../assets/OutletMenus/Chicago Pizza/CP1.JPG';
import CP2 from '../../assets/OutletMenus/Chicago Pizza/CP2.JPG';
import Do1 from '../../assets/OutletMenus/Dosai/Do1.jpg';
import Do2 from '../../assets/OutletMenus/Dosai/Do2.jpg';
import Do3 from '../../assets/OutletMenus/Dosai/Do3.jpg';
import Do4 from '../../assets/OutletMenus/Dosai/Do4.jpg';
import Do5 from '../../assets/OutletMenus/Dosai/Do5.jpg';
import Do6 from '../../assets/OutletMenus/Dosai/Do6.jpg';
import Do7 from '../../assets/OutletMenus/Dosai/Do7.jpg';
import Do8 from '../../assets/OutletMenus/Dosai/Do8.jpg';
import FZ1 from '../../assets/OutletMenus/Fuel Zone/FZ1.jpg';
import FZ2 from '../../assets/OutletMenus/Fuel Zone/FZ2.jpg';
import N1 from '../../assets/OutletMenus/Nescafe/N1.jpg';
import N2 from '../../assets/OutletMenus/Nescafe/N2.jpg';
import N3 from '../../assets/OutletMenus/Nescafe/N3.jpg';
import N4 from '../../assets/OutletMenus/Nescafe/N4.jpg';
import N5 from '../../assets/OutletMenus/Nescafe/N5.jpg';
import N6 from '../../assets/OutletMenus/Nescafe/N6.jpg';
import S1 from '../../assets/OutletMenus/Subway/S1.jpg'
import S2 from '../../assets/OutletMenus/Subway/S2.jpg'
import S3 from '../../assets/OutletMenus/Subway/S3.jpg'
import S4 from '../../assets/OutletMenus/Subway/S4.jpg'
import FV1 from '../../assets/OutletMenus/Food Village/FV1.jpeg'
import FV2 from '../../assets/OutletMenus/Food Village/FV2.jpeg'
import R1 from '../../assets/OutletMenus/Rasananda/R1.png'
import R2 from '../../assets/OutletMenus/Rasananda/R2.png'
import R3 from '../../assets/OutletMenus/Rasananda/R3.png'
import { MdArrowOutward } from "react-icons/md";
import ColorThief from 'colorthief';
import { IoFastFood } from "react-icons/io5";


export default function OutletsPage() {

    const outlets = [
        {
            name: 'Rasananda',
            timing: '12pm To 3am',
            picture: Rasananda,
            phone: '+917082928377',
            menu: [R1, R2, R3],
            location: 'Food Street (Next To Tennis Court)',
            website: 'https://rasaanandaonline.petpooja.com/'
        },
        {
            name: 'THC',
            timing: '12pm To 4am',
            picture: THC,
            phone: '+918199991183',
            menu: [THC1, THC2, THC3, THC4, THC5, THC6, THC7, THC8, THC9, THC10, THC11, THC12, THC13, THC14, THC15, THC16, THC17, THC18, THC19, THC20, THC21, THC22, THC23, THC24, THC25],
            location: 'Mess Ground Floor',
            website: 'https://thehungercycle.petpooja.com/orders/menu'
        },
        {
            name: 'Roti Boti',
            timing: '12pm To 2am',
            picture: RotiBoti,
            phone: '+918104213125',
            menu: [RB1, RB2, RB3, RB4, RB5],
            location: 'Food Street (Next To Tennis Court)',
            website: ''
        },
        {
            name: 'Shuddh Desi Dhaba',
            timing: '12pm To 12am',
            picture: Dhaba,
            phone: '+918059410499',
            menu: [D1, D2],
            location: 'Food Street (Next To Basketball Court)',
            website: ''
        },
        {
            name: 'Food Village',
            timing: '4pm To 2am',
            picture: FoodVillage,
            phone: '+919896950018',
            menu: [FV1, FV2],
            location: 'Food Street (Next To Tennis Court)',
            website: ''
        },
        {
            name: 'Subway',
            timing: '24/7',
            picture: Subway,
            phone: '+918199989788',
            menu: [S1, S2, S3, S4],
            location: 'Mess First Floor',
            website: ''
        },
        {
            name: 'Chicago Pizza',
            timing: '12pm To 11pm',
            picture: ChicagoPizza,
            phone: '+919711806438',
            menu: [CP1, CP2],
            location: 'Mess (RH1 Entry)',
            website: ''
        },
        {
            name: 'Nescafe',
            timing: '12pm To 2am',
            picture: Nescafe,
            phone: '+919671697363',
            menu: [N1, N2, N3, N4, N5, N6],
            location: 'Between AC02 & AC03',
            website: ''
        },
    ]

    const backend = process.env.REACT_APP_BACKEND
    const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;
    const navigate = useNavigate();
    const [loadedImages, setLoadedImages] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentMenuImages, setCurrentMenuImages] = useState([]);
    const [bgColor, setBgColor] = useState('')

    const openGallery = (menuImages, index) => {
        setCurrentMenuImages(menuImages);
        setCurrentImageIndex(index);
        setIsGalleryOpen(true);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? currentMenuImages.length - 1 : prevIndex - 1
        );
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === currentMenuImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const parseTime = (timeString) => {
        const timeParts = timeString.match(/(\d+)(?::(\d+))?\s*(p?)/i);
        if (!timeParts) {
            return null;
        }
        let hours = parseInt(timeParts[1], 10);
        const minutes = parseInt(timeParts[2], 10) || 0;
        const isPM = timeParts[3] === 'p';

        // Adjust hours for 12-hour format
        if (isPM && hours < 12) {
            hours += 12;
        }
        if (!isPM && hours === 12) {
            hours = 0; // Handle 12:00 AM as midnight
        }

        return { hours, minutes };
    }

    const isCurrentlyOpen = (timing) => {
        // Extract the opening and closing times from the timing string
        const [openingTime, closingTime] = timing.split(' To ').map(parseTime);

        if (!openingTime || !closingTime) {
            return false; // If timing is not correctly defined, return false
        }

        // Get the current time
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        // Create date objects for the opening and closing times on today's date
        const openingDate = new Date(now);
        openingDate.setHours(openingTime.hours, openingTime.minutes, 0, 0);

        const closingDate = new Date(now);
        if (closingTime.hours < openingTime.hours) {
            // If closing time is earlier than opening time, assume it's the next day
            closingDate.setDate(closingDate.getDate() + 1);
        }
        closingDate.setHours(closingTime.hours, closingTime.minutes, 0, 0);

        // Check if the current time is between the opening and closing times
        return now >= openingDate && now <= closingDate;
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
        // Calculate total number of images
        let imageCount = outlets.reduce((acc, outlet) => acc + outlet.menu.length + 1, 0); // +1 for each outlet picture
        setTotalImages(imageCount);
    }, [outlets]);

    const handleImageLoad = () => {
        setLoadedImages((prev) => prev + 1);
    };

    useEffect(() => {
        // Check if all images are loaded
        if (loadedImages === totalImages) {
            setIsPageLoaded(true);
        }
    }, [loadedImages, totalImages]);

    const theme = useTheme()

    return (
        <Grid.Container css={{
            width: '100vw',
            jc: 'center',
            alignItems: 'center',
            marginBottom: '100px'
        }}>
            {isPageLoaded &&
                <>
                    <>
                        {bgColor.length > 0 &&
                            <Col css={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderColor: '#0c0c0c',
                                marginBottom: '0px'
                            }}>
                                <img
                                    width={'100%'}
                                    height={60}
                                    style={{
                                        background: `linear-gradient(to bottom, #F5A524, ${theme.theme.colors.background.value})`,
                                        // backgroundColor: bgColor,
                                        filter: 'blur(40px)'
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '32px',
                                        backgroundColor: theme.type === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(20,20,20,0.75)',
                                        borderRadius: '80px',
                                        height: 'max-content',
                                    }}
                                >
                                    <IoFastFood size={20} color="#F5A524"
                                        style={{
                                            margin: '10px 12px 8px 12px'
                                        }}
                                    />
                                </div>
                            </Col>
                        }
                    </>

                    <Grid.Container css={{
                        jc: 'center',
                        marginTop: '72px'
                    }}>
                        {outlets.map((outlet, index) => {
                            const isOpen = isCurrentlyOpen(outlet.timing);
                            return (
                                <Grid key={index} css={{
                                    maxWidth: '400px',
                                    width: '97.5vw',
                                    margin: '0px 0px'
                                }}>
                                    <Col css={{
                                        width: '100%',
                                        padding: '0px 0px 64px 0px'
                                    }}>
                                        <Row css={{
                                            jc: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Row css={{
                                                jc: 'flex-start',
                                                alignItems: 'center'
                                            }}>
                                                <NextUIImage
                                                    css={{
                                                        width: '80px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px'
                                                    }}
                                                    // width={'80px'}
                                                    // height={'80px'}
                                                    src={outlet.picture} />
                                                <Col css={{
                                                    padding: '0px 12px',
                                                }}>
                                                    {outlet.website.length > 0 ?
                                                        <Row css={{
                                                            maxW: '110px',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Link
                                                                href={outlet.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                css={{
                                                                    '@xsMin': {
                                                                        fontSize: '$lg'
                                                                    },
                                                                    '@xsMax': {
                                                                        fontSize: '$base'
                                                                    },
                                                                    fontWeight: '$semibold',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    maxW: '100px'
                                                                }}
                                                            >
                                                                {outlet.name}
                                                            </Link>
                                                            <MdArrowOutward color="#0072F5" size={20} />
                                                        </Row>
                                                        :
                                                        <Text css={{
                                                            '@xsMin': {
                                                                fontSize: '$lg'
                                                            },
                                                            '@xsMax': {
                                                                fontSize: '$base'
                                                            },
                                                            fontWeight: '$semibold',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxW: '150px'
                                                        }}>
                                                            {outlet.name}
                                                        </Text>
                                                    }
                                                    <Text css={{
                                                        '@xsMin': {
                                                            fontSize: '$lg'
                                                        },
                                                        '@xsMax': {
                                                            fontSize: '$md'
                                                        },
                                                        fontWeight: '$semibold',
                                                        color: '$gray600'
                                                    }}>
                                                        {outlet.timing}
                                                    </Text>
                                                </Col>

                                            </Row>
                                            <Row css={{
                                                width: 'max-content',
                                                alignItems: 'flex-end',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                {/* Check based on current time if outlet is open or not comparing to outlet.timing */}
                                                <Badge variant={'flat'} color={(isOpen || outlet.name === 'Subway') ? 'success' : 'error'}>
                                                    {(isOpen || outlet.name === 'Subway') ? 'Open' : 'Closed'}
                                                </Badge>
                                                <Badge variant={'flat'} color={'primary'}>
                                                    {outlet.phone}
                                                </Badge>
                                            </Row>

                                        </Row>
                                        <div className="gallery-thumbnail" onClick={() => openGallery(outlet.menu, 0)}>
                                            <img
                                                key={index}
                                                src={outlet.menu[0]}
                                                alt=""
                                                onLoad={() => {
                                                    handleImageLoad()
                                                }}
                                            />
                                        </div>
                                        <Text css={{
                                            '@xsMin': {
                                                fontSize: '$lg'
                                            },
                                            '@xsMax': {
                                                fontSize: '$base'
                                            },
                                            fontWeight: '$semibold',
                                            marginLeft: '4px',
                                            color: '$gray600'
                                        }}>
                                            {outlet.location}
                                        </Text>
                                    </Col>
                                </Grid>
                            )
                        }
                        )}
                    </Grid.Container>

                    {/* Gallery Modal */}
                    {isGalleryOpen && (
                        <div className="gallery-modal">
                            <FontAwesomeIcon icon={faCircleXmark} onClick={closeGallery} className="close-icon" />
                            <FontAwesomeIcon icon={faCircleChevronLeft} onClick={goToPreviousImage} className="prev-icon" />
                            <img src={currentMenuImages[currentImageIndex]} alt="" className="gallery-image" />
                            <FontAwesomeIcon icon={faCircleChevronRight} onClick={goToNextImage} className="next-icon" />
                        </div>
                    )}

                </>
            }

        </Grid.Container>
    )
}