import React, { useEffect, useState } from "react";
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { useNavigate } from "react-router-dom";
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown, Image, Avatar, Link, Badge, Collapse, Modal, useTheme } from "@nextui-org/react";
import { GiClothes } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { GiJewelCrown } from "react-icons/gi";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineQuestionMark } from "react-icons/md";
import './createEventPage.css'
import Grey from '../../assets/Grey.jpeg'
import { IoLogoWhatsapp } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputItemCard from "../../components/items/inputItemCard";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FaChevronLeft } from "react-icons/fa";
import getCroppedImg from '../../components/items/cropImage'
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import InputEventCard from "../../components/events/inputEventCard";

export default function CreateEventPage() {

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false)
    const backend = process.env.REACT_APP_BACKEND
    const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;
    const theme = useTheme()
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const [render, setRender] = useState(false)

    const navigate = useNavigate();

    document.querySelectorAll('input, select, textarea').forEach((element) => {
        element.addEventListener('focus', (event) => event.preventDefault());
    });

    const verifyUserSession = () => {
        fetch(`${backend}/api/auth/verify`, {
            method: 'GET',
            credentials: 'include', // Necessary to include the cookie in the request
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Session expired or user not logged in');
                }
            })
            .then(data => {
                console.log('User session verified:', data);
                // Optionally update the UI or state based on the response
            })
            .catch(error => {
                console.error('Error verifying user session:', error);
                // Redirect to login page or show an error page
                navigate('/unauthorized'); // Adjust the path as necessary
            });
    };

    useEffect(() => {
        verifyUserSession();
    }, []);

    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    const [event, setEvent] = useState({
        userName: localStorage.getItem('userName'),
        userEmail: localStorage.getItem('userEmail'),
        userPicture: localStorage.getItem('userPicture'),
        eventName: '', //required, max 40 char
        eventDescription: '', //required, max 150 char
        eventDate: '', //required, cannot post event for beyond a week
        eventTime: '', //required
        eventLocation: '', //required from dropdown
        eventCategory: '', //required from dropdown
        notifications: [], 
        live: 'y',
        dateAdded: '' //today's date
    })

    const checkForm = () => {
        // eventName: Required and must be a non-empty string
        if (!event.eventName || typeof event.eventName !== 'string' || event.eventName.trim().length === 0) {
            alert('Event name is required.');
            return false;
        }

        // eventCategory: Required and must be a non-empty string
        if (!event.eventCategory || typeof event.eventCategory !== 'string' || event.eventCategory.trim().length === 0) {
            alert('Event category is required.');
            return false;
        }

        // eventDescription: Required and must be a non-empty string
        if (!event.eventDescription || typeof event.eventDescription !== 'string' || event.eventDescription.trim().length === 0) {
            alert('Event description is required.');
            return false;
        }

        // eventTime: Required and must be a non-empty string
        if (!event.eventTime || event.eventTime.trim().length === 0) {
            alert('Event time is required.');
            return false;
        }

        // eventLocation: Required and must be a non-empty string
        if (!event.eventLocation || event.eventLocation.trim().length === 0) {
            alert('Event location is required.');
            return false;
        }

        // eventDate: Required and must be a non-empty string
        if (!event.eventDate || event.eventDate.trim().length === 0) {
            alert('Event date is required.');
            return false;
        }

        // If all checks pass
        return true;
    };

    const postEventToBackend = async (itemData) => {
        setBackdropLoaderOpen(true)
        if (!checkForm()) {
            setBackdropLoaderOpen(false)
            return;
        }
        console.log(`${backend}/api/items`)
        try {
            const response = await fetch(`${backend}/api/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify(itemData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Item posted successfully:', responseData);
                setBackdropLoaderOpen(false)
                setShowSuccessSnackbar(true)
                window.setTimeout(() => {
                    window.location.pathname = '/useritems'
                }, 1000)
                // Here, you can redirect the user or show a success message
            } else {
                // Handle the error if the server response was not OK.
                const errorData = await response.json();
                console.error('Failed to post event:', errorData);
                setShowErrorSnackbar(true)
                setBackdropLoaderOpen(false)
                // Show an error message to the user
            }
        } catch (error) {
            console.error('Error posting event to backend:', error);
            setShowErrorSnackbar(true)
            setBackdropLoaderOpen(false)
            // Handle network errors or other errors outside the HTTP response
        }
    };

    if (localStorage.getItem('userEmail') === null) {
        return (
            <ErrorAuthPage />
        )
    }
    else {
        return (
            <Grid.Container css={{
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 0px 104px 0px',
                jc: 'center',
                alignItems: 'center'
            }}>
                <Text css={{
                    '@xsMin': {
                        fontSize: '$lg'
                    },
                    '@xsMax': {
                        fontSize: '$md'
                    },
                    fontWeight: '$medium',
                    marginBottom: '0px',
                    color: '$gray600',
                    padding: '0px 12px',
                    textAlign: 'center',
                    lineHeight: '1.3'
                }}>
                    Complete your event, upload to the public and reach your audience faster!
                </Text>

                <InputEventCard
                    event={event}
                    setEvent={setEvent}
                    type={'createevent'} />

                <Grid.Container css={{
                    '@xsMin': {
                        display: 'none'
                    },
                    '@xsMax': {
                        display: 'flex'
                    },
                    zIndex: '1000',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}>
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                        <BottomNavigation style={{
                            backgroundColor: theme.type === 'light' ? '#fff' : '#0c0c0c',
                            width: '100vw',
                            height: 'max-content',
                            alignItems: 'center'
                        }}>
                            <Button auto flat css={{
                                marginTop: '8px',
                                marginBottom: isIOS ? '48px' : '8px',
                                height: 'max-content',
                                padding: '6px 12px',
                                width: '100%',
                                marginLeft: '24px',
                                marginRight: '24px'
                            }}
                                color={'primary'}
                                onClick={() => {
                                    if (checkForm()) {
                                        postEventToBackend()
                                    }
                                }}>

                                <Row css={{
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                    <Text css={{
                                        '@xsMin': {
                                            fontSize: '$md'
                                        },
                                        '@xsMax': {
                                            fontSize: '$md'
                                        },
                                        fontWeight: '$medium',
                                        color: theme.type === 'light' ? '#0072F5' : '#3694FF'
                                    }}>
                                        Create Event
                                    </Text>
                                    <IoSendSharp size={16} style={{}} />
                                </Row>
                            </Button>
                        </BottomNavigation>
                    </Paper>
                </Grid.Container>

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

            </Grid.Container>
        )
    }
}