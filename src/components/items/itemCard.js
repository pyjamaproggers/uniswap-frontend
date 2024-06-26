import React, { useEffect, useState } from "react";
import { Badge, Col, Grid, Avatar, Text, Image, Row, Collapse, Button, useTheme } from "@nextui-org/react";
import './itemCard.css'
import { IoLogoWhatsapp } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FaCloud } from "react-icons/fa6";
import { IoCloudOffline } from "react-icons/io5";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ReactGA from 'react-ga4'
import { IoPaperPlane } from "react-icons/io5";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function ItemCard(props) {

    const theme = useTheme()
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false)
    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)
    const [showHeartAnimation, setShowHeartAnimation] = useState(false)
    const [lastTap, setLastTap] = useState(0);
    const navigate = useNavigate()
    const backend = process.env.REACT_APP_BACKEND
    const [render, setRender] = useState(false)
    const item = props.item
    const type = props.type
    const [firstName, lastName] = item.userName.split(' ');
    const URL = 'https://wa.me'
    // let number = item.contactNumber.replace(/[^\w\s]/gi, '').replace(/ /g, '')
    let number = item.contactNumber
    let message = `Hi ${firstName}, I saw you put ${item.itemName} on UniSwap™ for ${item.itemPrice}`
    let url = `${URL}/${number}?text=${encodeURI(message)}`;
    let favouriteItems = props.favouriteItems
    let handleFavouriteItemToggle = props.handleFavouriteItemToggle
    let handleLiveToggle = props.handleLiveToggle
    let onItemDeleted = props.onItemDeleted
    const categoryColors = {
        apparel: 'error',
        electronics: 'primary',
        decor: 'success',
        food: 'warning',
        makeup: 'secondary',
        stationery: 'primary',
        jewellery: 'warning',
    };
    const badgeColor = categoryColors[item.itemCategory] || 'default';
    // let shareItemViaWhatsApp = props.shareItemViaWhatsApp

    const handleFavouriteButtonClick = async (favouriteItems, item) => {
        // console.log('invoking')
        const itemIDToUpdate = item._id;

        const isCurrentlyFavourite = favouriteItems.includes(itemIDToUpdate);
        if(!isCurrentlyFavourite){
            setShowHeartAnimation(true);
            setTimeout(() => setShowHeartAnimation(false), 1000); // Animation lasts for 1 second
        }


        try {
            const response = await fetch(`${backend}/api/user/favorites`, {
                method: 'POST', // or 'PATCH' depending on your preference
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as needed, such as for authentication
                },
                body: JSON.stringify({ itemId: itemIDToUpdate }),
                credentials: 'include', // for cookies to be included
            });

            const data = await response.json();
            // Handle the response. For example, refresh the local favorites state
            if (response.ok) {
                // console.log('updating favs itemcard')
                handleFavouriteItemToggle(favouriteItems, itemIDToUpdate);
            } else {
                // Handle failure (e.g., item not found, user not authenticated)
                console.error(data.message);
            }
        } catch (error) {
            console.error('Failed to update favorite items:', error);
        }
    }

    const handleLiveButtonClick = async (itemId, currentStatus) => {
        setBackdropLoaderOpen(true);
        console.log('hi')
        try {
            const response = await fetch(`${backend}/api/items/${itemId}/live`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ live: currentStatus === "y" ? "n" : "y" }),
            });
            // Parse the JSON response and update state accordingly
            const data = await response.json();
            console.log('Live status toggled:', data);

            if (response.ok) {
                console.log('updating live status itemcard')
                setBackdropLoaderOpen(false);
                handleLiveToggle(itemId, data.live)

            } else {
                // Handle failure (e.g., item not found, user not authenticated)
                console.error(data.message);
            }

            // Removed toast success and error messages since `toast` is not defined

        } catch (error) {
            console.error('Failed to toggle live status:', error);
            setBackdropLoaderOpen(false);
            // Removed toast error message since `toast` is not defined
        } finally {
            setBackdropLoaderOpen(false);
        }
    };

    function getTimeDifference(dateString) {
        const itemDate = new Date(dateString);
        const now = new Date();
        const differenceInSeconds = Math.floor((now - itemDate) / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        // Helper function to format the time string correctly
        const formatTimeString = (value, unit) => {
            return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
        };

        if (differenceInSeconds < 60) {
            return formatTimeString(differenceInSeconds, 'second');
        } else if (differenceInMinutes < 60) {
            return formatTimeString(differenceInMinutes, 'minute');
        } else if (differenceInHours < 24) {
            return formatTimeString(differenceInHours, 'hour');
        } else if (differenceInDays < 7) {
            return formatTimeString(differenceInDays, 'day');
        } else {
            return formatDate(itemDate);
        }
    }

    function formatDate(date) {
        const day = date.getDate();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const ordinal = getOrdinalIndicator(day);

        return `${day}${ordinal} ${month}, ${year}`;
    }

    function getOrdinalIndicator(day) {
        if (day > 3 && day < 21) return 'th'; // For 4th to 20th
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    const handleDeleteItem = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            setBackdropLoaderOpen(true);
            try {
                const response = await fetch(`${backend}/api/items/${itemId}`, {
                    method: 'DELETE', // Using the DELETE method for the API request
                    headers: {
                        'Content-Type': 'application/json',
                        // Add other headers like authorization if needed
                    },
                    credentials: 'include', // If your API requires credentials
                });

                if (!response.ok) {
                    setShowErrorSnackbar(true)
                    // throw new Error('Failed to delete the item.');
                }

                // Here you might want to update the state to remove the item from the list
                console.log(`Item with ID ${itemId} deleted successfully.`);
                setBackdropLoaderOpen(false);
                // For example, you could call a prop function to refresh the items
                onItemDeleted(itemId);

            } catch (error) {
                console.error('Error deleting the item:', error);
                setShowErrorSnackbar(true)
                setBackdropLoaderOpen(false);
            }
        }
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300; // milliseconds

        if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
            // console.log('invoking func');
            handleFavouriteButtonClick(favouriteItems, item);

        } else {
            setLastTap(now);
        }
    };

    if (item.live === 'n' && type === 'sale') {
        return null
    }
    if (type === 'favourites' && !(favouriteItems.includes(item._id))) {
        return null
    }
    else {
        return (
            <Grid
                css={{
                    '@xsMax': {
                        margin: '24px 6px'
                    },
                    '@xsMin': {
                        margin: '24px 24px'
                    },
                    jc: 'center'
                }}
            >

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backdropLoaderOpen}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Col css={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Row css={{
                        alignItems: 'center',
                        padding: '0px 8px 8px 8px',
                        jc: 'space-between',
                        width: '100%',
                        maxWidth: '390px'
                    }}>
                        <Row css={{
                            alignItems: 'center',
                            gap: 6,
                        }}>
                            <Avatar
                                color=""
                                size="md"
                                // src={item.userPicture}
                                src={`https://api.multiavatar.com/${item.userName}.png?apikey=Bvjs0QyHcCxZNe`}
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
                                    fontSize: '$md'
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
                        <Badge variant="flat" size={'md'} color={badgeColor}>
                            {item.itemCategory.charAt(0).toUpperCase() + item.itemCategory.slice(1)}
                        </Badge>
                        <Badge variant="flat" size={'md'} color={"primary"}>
                            ₹ {item.itemPrice}
                        </Badge>
                    </Row>
                    <div
                    style={{
                        position: 'relative'
                    }}
                    >
                        <img src={item.itemPicture}
                            style={{
                                height: '400px',
                                width: '97.5vw',
                                maxWidth: '400px',
                                // '@xsMax': {
                                //     width: '90vw'
                                // },
                                // '@xsMin': {
                                //     width: '360px',
                                // },
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                            // onDoubleClick={handleDoubleTap} // For desktop
                            onTouchEnd={handleDoubleTap} // For mobile
                        />
                        {showHeartAnimation && (
                            <div className="heart-animation" style={{
                                position: 'absolute',
                                zIndex: 1200,
                                top: '45%',
                                left: '45%',
                                animation: 'pulse 1s ease'
                            }}>
                                <IoMdHeart size={40} style={{
                                    borderRadius: '12px',
                                    color: '#F31260'
                                }} className="item-icon"
                                />
                            </div>
                        )}
                    </div>
                    <Collapse css={{
                        width: '100%',
                        maxWidth: '390px',
                        borderStyle: 'solid',
                        borderColor: '$gray100',
                        borderWidth: '0px 0px 0px 0px'
                    }}
                        divider={false}
                        title={
                            <Row css={{
                                alignItems: 'baseline',
                                jc: 'start',
                            }}>
                                <Col>

                                    <Text css={{
                                        fontWeight: '$medium',
                                        '@xsMin': {
                                            fontSize: '$lg'
                                        },
                                        '@xsMax': {
                                            fontSize: '$md'
                                        },
                                        paddingRight: '4px',
                                        // lineHeight: '1.25',
                                    }}>
                                        {item.itemName}
                                    </Text>

                                </Col>
                                {(type === 'user') &&
                                    <>
                                        {(item.live === 'y') ?
                                            <Badge variant="flat" size={'md'} color={"success"}>
                                                • Live
                                            </Badge>
                                            :
                                            <Badge variant="flat" size={'md'} color={"warning"}>
                                                • Not Live
                                            </Badge>
                                        }
                                    </>
                                }

                            </Row>
                        }
                    >
                        <Text css={{
                            fontWeight: '$regular',
                            '@xsMin': {
                                fontSize: '$base'
                            },
                            '@xsMax': {
                                fontSize: '$md'
                            },
                            padding: '0px 8px 2px 8px',
                            color: '$gray800',
                            lineHeight: '1.25'
                        }}>
                            {item.itemDescription}
                        </Text>
                    </Collapse>
                    <Row css={{
                        width: '100%',
                        maxWidth: '390px',
                        jc: 'space-between',
                        marginTop: '4px',
                        alignItems: 'normal',
                        marginBottom: type === 'sale' ? '24px' : '0px'
                    }}>
                        <Text css={{
                            fontWeight: '$medium',
                            '@xsMin': {
                                fontSize: '$md',
                            },
                            '@xsMax': {
                                fontSize: '$sm'
                            },
                            color: '$gray600',
                            paddingLeft: '8px'
                        }}>
                            {getTimeDifference(item.dateAdded)}
                        </Text>
                        {(type === 'sale' || type === 'favourites') &&
                            <Row css={{
                                padding: '4px 8px 0px 8px',
                                gap: 6,
                                alignItems: 'center',
                                width: 'max-content',
                            }}>
                                <Button auto flat color={'success'} className="collapse-buttons">
                                    <IoLogoWhatsapp size={'20px'} color={"#25D366"} onClick={() => {
                                        ReactGA.event({
                                            category: item.itemCategory,
                                            action: 'WhatsApp Button Click'
                                        })
                                        window.open(url)
                                    }} className="item-icon" />
                                </Button>
                                {favouriteItems.includes(item._id) ?
                                    <Button auto flat color={'error'} className="collapse-buttons"
                                        onClick={() => {
                                            handleFavouriteButtonClick(favouriteItems, item)
                                        }}>
                                        <IoMdHeart size={20} style={{
                                            borderRadius: '12px',
                                            color: '#F31260'
                                        }} className="item-icon"
                                        />
                                    </Button>
                                    :
                                    <Button auto flat color={'error'} className="collapse-buttons"
                                        onClick={() => {
                                            handleFavouriteButtonClick(favouriteItems, item)
                                        }} >
                                        <IoMdHeart size={20} style={{
                                            borderRadius: '12px',
                                            color: '#fff',
                                            opacity: theme.type === 'light' ? '1' : '0.6'
                                        }} className="item-icon"
                                        />
                                    </Button>
                                }
                            </Row>
                        }
                    </Row>
                    {type === 'user' &&
                        <Row css={{
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingTop: '8px',
                            gap: 4,
                            marginBottom: '24px'
                        }}>
                            {item.live === 'y' ?
                                <Button auto flat color={"warning"}
                                    icon={<IoCloudOffline size={16} />}
                                    onClick={() => { handleLiveButtonClick(item._id) }}
                                    css={{
                                        lineHeight: '2.2'
                                    }}>
                                    Unpublish
                                </Button>
                                :
                                <Button auto flat color={"success"}
                                    icon={<FaCloud size={16} style={{}} />}
                                    onClick={() => { handleLiveButtonClick(item._id) }}
                                    css={{
                                        lineHeight: '2.2'
                                    }}>
                                    Publish
                                </Button>
                            }
                            <Button auto flat color="primary"
                                icon={<IoPencil size={16} />}
                                onClick={() => navigate('/editsale', { state: item })}
                                css={{
                                    lineHeight: '2.2'
                                }}>
                                Edit
                            </Button>
                            <Button auto flat color="error"
                                onClick={() => handleDeleteItem(item._id)}
                                css={{
                                    lineHeight: '2.2'
                                }}>
                                <MdDelete size={16} />
                                Delete
                            </Button>
                        </Row>
                    }
                </Col>

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
            </Grid>
        );
    }

}
