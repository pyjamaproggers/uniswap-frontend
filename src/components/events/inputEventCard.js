import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown, Image, Avatar, Link, Badge, Collapse, Modal, useTheme } from "@nextui-org/react";
import { GiClothes } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { GiJewelCrown } from "react-icons/gi";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineQuestionMark } from "react-icons/md";
import { PiPottedPlantFill } from "react-icons/pi";
import { GiLipstick } from "react-icons/gi";
import { IoLaptop } from "react-icons/io5";
import Grey from '../../assets/Grey.jpeg'
import { IoLogoWhatsapp } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { TbDeviceAirpods } from "react-icons/tb";
import { MdCable } from "react-icons/md";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { FaCloud } from "react-icons/fa6";
import { IoCloudOffline } from "react-icons/io5";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './eventCard.css'

export default function InputEventCard(props) {

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false)

    const event = props.event
    const setEvent = props.setEvent
    const backend = process.env.REACT_APP_BACKEND
    const type = props.type
    const theme = useTheme()
    const [firstName, lastName] = event.userName.split(' ')
    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    const categoryColors = {
        apparel: 'error',
        electronics: 'primary',
        decor: 'success',
        food: 'warning',
        makeup: 'secondary',
        stationery: 'success',
        jewellery: 'warning',
        lostandfound: 'neutral',
    };

    // Default to some color if event.category is not found in the mapping
    const badgeColor = categoryColors[event.itemCategory] || 'neutral';

    const categoryItems = [
        { key: 'apparel', value: 'Apparel', icon: <GiClothes size={24} color="#F31260" />, description: 'Tees, Shirts, Corsettes, Shorts, Cargos, Dresses, Footwear and more.' }, // Vibrant Pink
        { key: 'electronics', value: 'Electronics', icon: <MdCable size={24} color="#0072F5" />, description: 'Concert, Show, Shuttle and more.' }, // Indigo
        { key: 'decor', value: 'Decor', icon: <PiPottedPlantFill size={24} color="#17C964" />, description: 'Plants, Balloons, Room Decor and more.' }, // Yellow
        { key: 'food', value: 'Food', icon: <IoFastFoodSharp size={24} color="#F5A524" />, description: 'Fruits, Ramen, Masalas and more.' }, // Orange
        { key: 'makeup', value: 'Makeup', icon: <GiLipstick size={24} color="#7828C8" />, description: 'Skincare, Bodycare, Lipstick, Mascara and more.' },
        { key: 'stationery', value: 'Stationery', icon: <FaFilePen size={24} color="#0072F5" />, description: 'Pens, Pencils, Erasers, Sharpeners, Notebooks, Highlighters and more.' }, // Green
        { key: 'jewellery', value: 'Jewellery', icon: <GiJewelCrown size={24} color="#F5A524" />, description: 'Necklaces, Earrings, Nose Rings and more.' }, // Yellow
        { key: 'lostandfound', value: 'Lost & Found', icon: <MdOutlineQuestionMark size={24} color="#889096" />, description: 'Anything and everything lost around campus.' }, // Grey
        { key: 'miscellaneous', value: 'Miscellaneous', icon: <MdMiscellaneousServices size={24} color={theme.type==="light"?"#0c0c0c":"f0f0f0"} />, description: "Anything and everything that doesn't fall into the above categories" }, // Cyan
    ]

    return (
        <Grid css={{
            margin: '24px 0px'
        }}>
            <Col css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Row css={{
                    alignItems: 'center',
                    padding: '0px 8px 4px 8px',
                    jc: 'space-between'
                }}>
                    <Row css={{
                        alignItems: 'center',
                        gap: 6,
                    }}>
                        <Avatar
                            color=""
                            size="md"
                            // src={event.userPicture}
                            src={`https://api.multiavatar.com/${localStorage.getItem('userName')}.png?apikey=Bvjs0QyHcCxZNe`}
                            className="avatar"
                        />
                        <Text css={{
                            display: 'inline-block', // Allows the use of maxW
                            maxW: '100px',
                            fontWeight: '$medium',
                            '@xsMin': {
                                fontSize: '$lg',
                            },
                            '@xsMax': {
                                fontSize: '$sm'
                            },
                        }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.20' }}>
                                {firstName}
                            </span>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.20' }}>
                                {lastName}
                            </span>
                        </Text>
                    </Row>
                    <Dropdown isBordered size={'sm'}>
                        <Dropdown.Button flat color={badgeColor}
                            css={{
                                lineHeight: '1',
                                padding: '6px 12px',
                                height: 'max-content'
                            }}>
                            {event.eventCategory === '' ? 'Category' : event.eventCategory.charAt(0).toUpperCase() + event.eventCategory.slice(1)}
                        </Dropdown.Button>
                        <Dropdown.Menu aria-label="Items Category"
                            selectionMode="single"
                            css={{
                                $$dropdownMenuWidth: "270px",
                                $$dropdownItemHeight: "70px",
                                "& .nextui-dropdown-event": {
                                    py: "$2",
                                    // dropdown event left icon
                                    svg: {
                                        color: "$secondary",
                                        mr: "$2",
                                    },
                                    // dropdown event title
                                    "& .nextui-dropdown-event-content": {
                                        w: "100%",
                                        fontWeight: "$semibold",
                                    },
                                },
                            }}
                            onSelectionChange={(selection) => {
                                setEvent({
                                    ...event,
                                    eventCategory: selection.currentKey
                                })
                            }}
                        >
                            {categoryItems.map((category, index) => (
                                <Dropdown.Item
                                    key={category.key}
                                    icon={category.icon}
                                    showFullDescription={true}
                                    description={category.description}
                                >
                                    <Text css={{
                                        fontWeight: '$semibold'
                                    }}>
                                        {category.value}
                                    </Text>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                </Row>

            </Col>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropLoaderOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                open={showSuccessSnackbar}
                autoHideDuration={1500}
                onClose={() => { setShowSuccessSnackbar(false) }}
            >
                <Alert
                    onClose={() => { setShowSuccessSnackbar(false) }}
                    severity="success"
                    variant="filled"
                    color="success"
                    sx={{ width: '100%' }}
                >
                    Success
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                open={showErrorSnackbar}
                autoHideDuration={1500}
                onClose={() => { setShowErrorSnackbar(false) }}
            >
                <Alert
                    onClose={() => { setShowErrorSnackbar(false) }}
                    severity="error"
                    variant="filled"
                    color="error"
                    sx={{ width: '100%' }}
                >
                    Error
                </Alert>
            </Snackbar>


        </Grid >
    )
}