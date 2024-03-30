import React, { useState } from "react";
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
import { Avatar, Badge, Col, Grid, Image, Row, Text } from "@nextui-org/react";
import { Carousel } from 'react-responsive-carousel';
import Modal from 'react-modal';


export default function OutletsPage() {


    const outlets = [
        {
            name: 'Rasananda',
            timing: '12pm To 3am',
            picture: Rasananda,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Food Street (Next To Tennis Court)',
            website: ''
        },
        {
            name: 'THC',
            timing: '12pm To 4am',
            picture: THC,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Mess Ground Floor',
            website: ''
        },
        {
            name: 'Roti Boti',
            timing: '12pm To 2am',
            picture: RotiBoti,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Food Street (Next To Tennis Court)',
            website: ''
        },
        {
            name: 'Shuddh Desi Dhaba',
            timing: '12pm To 12am',
            picture: Dhaba,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Food Street (Next To Basketball Court)',
            website: ''
        },
        {
            name: 'Subway',
            timing: '24/7',
            picture: Subway,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Mess First Floor',
            website: ''
        },
        {
            name: 'Chicago Pizza',
            timing: '12pm To 11pm',
            picture: ChicagoPizza,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Mess (RH1 Entry)',
            website: ''
        },
        {
            name: 'Fuel Zone',
            timing: '12pm To 3am',
            picture: FuelZone,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Mess Ground Floor (Near Lawns)',
            website: ''
        },
        {
            name: 'Dosai',
            timing: '12pm To 11pm',
            picture: Dosai,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Food Street (Next To Frisbee Field)',
            website: ''
        },
        {
            name: 'Nescafe',
            timing: '12pm To 2am',
            picture: Nescafe,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Between AC02 & AC03',
            website: ''
        },
        {
            name: 'Amul',
            timing: '12pm To 11pm',
            picture: Amul,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Mess (AC01 Entry)',
            website: ''
        },
        {
            name: 'Food Village',
            timing: '12pm To 2am',
            picture: FoodVillage,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Food Street (Next To Tennis Court)',
            website: ''
        },
        {
            name: 'LocoMoko',
            timing: '12pm To 11pm',
            picture: LocoMoko,
            phone: '+918104213125',
            menu: [Grey, Grey, Grey, Grey],
            location: 'Mess Ground Floor',
            website: ''
        },
    ]

    const [modalIsOpen, setModalIsOpen] = useState(false);

    // This state holds the menu images to display in the carousel
    const [activeMenuImages, setActiveMenuImages] = useState([]);

    // Function to open the modal/gallery with the given menu images
    const openModalWithImages = (menuImages) => {
        setActiveMenuImages(menuImages);
        setModalIsOpen(true);
    };

    // Function to close the modal/gallery
    const closeModal = () => {
        setModalIsOpen(false);
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
    };

    // Function to check if the current time is within the opening hours range
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
    };


    return (
        <Grid.Container css={{
            width: '100vw',
            jc: 'center',
            alignItems: 'center'
        }}>
            <Text css={{
                '@xsMin': {
                    fontSize: '$2xl',
                    margin: '24px 0px 48px 0px'
                },
                '@xsMax': {
                    fontSize: '$xl',
                    margin: '24px 0px 24px 0px'
                },
                fontWeight: '$semibold',
                width: '100vw',
                textAlign: 'center'
            }}>
                Food Outlets
            </Text>
            {outlets.map((outlet, index) => {
                const isOpen = isCurrentlyOpen(outlet.timing);
                return (
                    <Grid key={index} css={{
                        width: '320px',
                        margin: '12px 0px'
                    }}>
                        <Col css={{
                            width: '100%',
                            padding: '12px'
                        }}>
                            <Row css={{
                                jc: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Row css={{
                                    jc: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Image
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
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {outlet.name}
                                        </Text>
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
                                    <Badge variant={'flat'} color={isOpen ? 'success' : 'error'}>
                                        {isOpen ? 'Open' : 'Closed'}
                                    </Badge>
                                    <Badge variant={'flat'} color={'primary'}>
                                        {outlet.phone}
                                    </Badge>
                                </Row>

                            </Row>
                            {/* caorusel of menu images on click of which the image would expand and user can still go left and right so as to explore teh whole menu and a cross button to close this gallery of menu*/}
                            <Image
                                css={{
                                    width: '320px',
                                    height: '300px',
                                    borderRadius: '8px',
                                    marginTop: '4px'
                                }}
                                src={Grey} // Replace with your trigger image or an icon
                                onClick={() => openModalWithImages(outlet.menu)}
                            />
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

            {/* The Modal for the gallery */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Menu Images"
            // Add custom styles to the modal here if needed
            >
                <Carousel
                    showArrows={true}
                    showThumbs={false}
                    dynamicHeight={true}
                    swipeable={true}
                    useKeyboardArrows={true}
                    infiniteLoop={true}
                >
                    {activeMenuImages.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={`Menu Item ${index}`} />
                        </div>
                    ))}
                </Carousel>

                {/* Close button */}
                <button onClick={closeModal}>Close</button>
            </Modal>
        </Grid.Container>
    )
}