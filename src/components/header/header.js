import React, { useEffect, useState } from "react";
import AshokaLogo from '../../assets/AshokaLogo.png'
import { Link, Text, Avatar, Dropdown, Image, Navbar, Modal, Col, Row, Switch, Input, Grid, Button } from "@nextui-org/react";
import { icons } from "../icons/icons.js";
import { GiClothes } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { GiJewelCrown } from "react-icons/gi";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineQuestionMark } from "react-icons/md";
import jwt_decode from "jwt-decode";
import Skeleton from '@mui/material/Skeleton';
import { FaPlus } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlinePhoneIphone } from "react-icons/md";
import { messaging } from "../../services/firebase.js";
import { getToken } from "firebase/messaging";
import './header.css'
import { FaPhone } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import Paper from '@mui/material/Paper';
import { GoHomeFill } from "react-icons/go";
import BottomNavigation from '@mui/material/BottomNavigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Header(props) {
    const [render, setRender] = useState(false)
    const [loginLoader, setLoginLoader] = useState(true)
    const [showAshokaOnlyModal, setShowAshokaOnlyModal] = useState(false)
    const [showNumberModal, setShowNumberModal] = useState(false)
    const [showNumberUpdateModal, setShowNumberUpdateModal] = useState(false)
    const [number, setNumber] = useState(0)
    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    const backend = process.env.REACT_APP_BACKEND
    // console.log(backend)
    const navigate = useNavigate();
    const location = useLocation();

    // const toggleMode = props.toggleMode

    const navigationItems = [
        { path: '/', icon: GoHomeFill },
        { path: '/saleitems', icon: FaBagShopping },
        { path: '/createsale', icon: FaPlus },
        { path: '/favourites', icon: IoMdHeart }
    ];

    const collapseItemsLoggedOut = [
        { key: 'outlets', value: "Outlets" },
        { key: 'about', value: "About" },
    ];

    const collapseItemsLoggedIn = [
        { key: 'saleitems', value: "Sale Items" },
        { key: 'outlets', value: "Outlets" },
        { key: 'about', value: "About" },
        { key: 'logout', value: "Log Out" },
    ];

    const categories = [
        { key: 'apparel', value: 'Apparel', icon: <GiClothes size={24} color="#F31260" />, description: 'Tees, Shirts, Corsettes, Shorts, Cargos, Dresses, Footwear and more.' }, // Vibrant Pink
        { key: 'food', value: 'Food', icon: <IoFastFoodSharp size={24} color="#7828C8" />, description: 'Fruits, Ramen, Masalas and more.' }, // Orange
        { key: 'tickets', value: 'Tickets', icon: <IoTicket size={24} color="#0072F5" />, description: 'Concert, Show, Shuttle and more.' }, // Indigo
        { key: 'stationery', value: 'Stationery', icon: <FaFilePen size={24} color="#17C964" />, description: 'Pens, Pencils, Erasers, Sharpeners, Notebooks, Highlighters and more.' }, // Green
        { key: 'jewellry', value: 'Jewellry', icon: <GiJewelCrown size={24} color="#F5A524" />, description: 'Necklaces, Earrings, Nose Rings and more.' }, // Yellow
        { key: 'lostandfound', value: 'Lost & Found', icon: <MdOutlineQuestionMark size={24} color="#889096" />, description: 'Anything and everything lost around campus.' }, // Grey
        { key: 'miscellaneous', value: 'Miscellaneous', icon: <MdMiscellaneousServices size={24} color="#0c0c0c" />, description: "Anything and everything that doesn't fall into the above categories" }, // Cyan
    ]

    // funciton to handle callback for google sign in
    // Adjusted to call requestNotificationPermission after successful authentication

    const [googleUserObject, setGoogleUserObject] = useState()


    function handleCallbackresponse(response) {
        setBackdropLoaderOpen(true);
        var googleUserObject_ = jwt_decode(response.credential);
        console.log(googleUserObject_);
        setGoogleUserObject(response.credential); // This should be the actual token, not decoded object

        // Call backend to verify token and check user's contact number status
        fetch(`${backend}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential }),
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.user)
                // Assuming backend response includes user object with contactNumber
                if (data.user && data.user.contactNumber) {
                    // Set user details in localStorage
                    localStorage.setItem('userEmail', data.user.userEmail);
                    localStorage.setItem('userName', data.user.userName);
                    localStorage.setItem('userPicture', data.user.userPicture);
                    localStorage.setItem('contactNumber', data.user.contactNumber)

                    // Call to request notification permission should be here
                    setBackdropLoaderOpen(false);
                    requestNotificationPermission();
                } else {
                    // User does not have a contact number, show modal to add one
                    setBackdropLoaderOpen(false);
                    console.log("User does not have a contact number, showing modal.",);
                    setShowNumberModal(true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error(`${error}`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: 'Flip',
                });

                // Handle error, e.g., show a message to the user
            });
    }

    const updateContactNumber = () => {
        const updatedPhoneNumber = number; // Assuming `number` contains the new phone number
        setBackdropLoaderOpen(true);

        if (!updatedPhoneNumber) {
            console.error('No phone number provided');
            return;
        }

        // First, update the user's phone number
        fetch(`${backend}/api/user/updatePhoneNumber`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // to ensure cookies are sent with the request
            body: JSON.stringify({ newPhoneNumber: updatedPhoneNumber }),
        })
            .then(response => {
                if (!response.ok) {
                    setBackdropLoaderOpen(false);
                    toast.error('Failed to update phone, try again.', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: 'Flip',
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Phone number updated successfully:', data);
                setBackdropLoaderOpen(false);
                toast.success('Successfully updated.', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: 'Flip',
                });

                // Now, verify the user to get a new token with updated info
                return fetch(`${backend}/api/auth/verify`, {
                    method: 'GET',
                    credentials: 'include', // Important to include cookies
                });
            })
            .then(verifyResponse => {
                if (!verifyResponse.ok) {
                    toast.error('Failed to verify user.', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: 'Flip',
                    });
                    setBackdropLoaderOpen(false);
                    setShowNumberUpdateModal(false);
                    setShowNumberModal(false);
                }
                return verifyResponse.json();
            })
            .then(verifyData => {
                console.log('User verified, and cookie updated:', verifyData);
                setBackdropLoaderOpen(false);
                toast.success('Number updated and user verified successfully.', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: 'Flip',
                });

                // Optionally update local storage or UI based on verified user data
                // Assuming verifyData.user contains the updated user info
                localStorage.setItem('userEmail', verifyData.user.userEmail);
                localStorage.setItem('userName', verifyData.user.userName);
                localStorage.setItem('userPicture', verifyData.user.userPicture);
                localStorage.setItem('contactNumber', verifyData.user.contactNumber);

                setShowNumberUpdateModal(false);
                setShowNumberModal(false);

                // Continue with any further actions, like requesting notification permissions
                // requestNotificationPermission();
            })
            .catch(error => {
                setBackdropLoaderOpen(false);
                console.error('Error:', error);
                toast.error('Some error... please try again', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: 'Flip',
                });
            });
    };

    // function handleCallbackresponse(response) {
    //     var googleUserObject_ = jwt_decode(response.credential);
    //     console.log(googleUserObject_)
    //     setGoogleUserObject(response.credential)

    //     if (jwt_decode(response.credential).email.split('@')[1] === 'ashoka.edu.in') {

    //         setShowNumberModal(true)

    //     } else {
    //         setShowAshokaOnlyModal(true);
    //     }
    // }

    // Function to request notification permission and get the token

    const requestNotificationPermission = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                getToken(messaging, { vapidKey: "BDiwlGg-uzE3Q5y94jyh_bSPo-b2v0A1thC9ePGnk7nt7E_3yuyGGf-Uqi4p6OSVG7tqdmhBU_T5CXOuoFJMACo" }).then((currentToken) => {
                    if (currentToken) {
                        console.log("FCM Token:", currentToken);
                        sendTokenToServer(currentToken);
                    }
                }).catch((err) => console.log("An error occurred while retrieving token. ", err));
            }
            else {
                setRender((prev) => !prev);
                window.location.pathname = '/';
            }
        });
    };

    const sendTokenToServer = (currentToken) => {
        fetch(`${backend}/api/user/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: currentToken }),
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setRender((prev) => !prev);
                window.location.pathname = '/';
            })
            .catch((error) => console.error("Error sending FCM token to server:", error));
    };



    useEffect(() => {
        const fetchUserData = async () => {
            if (localStorage.getItem('userEmail')) {
                try {
                    const postedItemsResponse = await fetch(`${backend}/api/user/items`, { credentials: 'include' });
                    const postedItems = await postedItemsResponse.json();
                    localStorage.setItem('itemsPosted', JSON.stringify(postedItems));
                    const favoriteItemsResponse = await fetch(`${backend}/api/user/favorites`, { credentials: 'include' });
                    const favoriteItems = await favoriteItemsResponse.json();
                    localStorage.setItem('favouriteItems', JSON.stringify(favoriteItems));
                } catch (error) {
                    console.error('Failed to fetch user-specific data:', error);
                }
            }
        };

        fetchUserData();
    }, []);



    function handleLogout() {
        fetch(`${backend}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Necessary to include the cookie in requests
        })
            .then(res => {
                if (res.ok) {
                    // Assuming the backend has now invalidated the session/cookie...

                    // Clear client-side storage of user details
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userPicture');
                    localStorage.removeItem('itemsPosted');
                    localStorage.removeItem('favouriteItems');
                    localStorage.clear()
                    // Redirect user to the homepage or login page
                    window.location.pathname = '/' // Adjust the path as necessary for your application
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Optionally handle the error, maybe show a notification to the user
            });
    }

    // useEffect(() => {
    //     fetch(`${backend}/api/auth/profile`, {
    //         credentials: 'include',
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.isAuthenticated) {
    //                 // Update UI to reflect authenticated state
    //             } else {
    //                 // User is not authenticated
    //             }
    //         });
    // }, []);

    useEffect(() => {
        setLoginLoader(true)
        window.setTimeout(() => {
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENTID,
                callback: handleCallbackresponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById("GoogleButton"),
                { theme: 'dark', size: 'large', shape: 'circle', type: 'icon' }
            );
            setLoginLoader(false)
        }, 2000)

    }, [])

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [phoneStatus, setPhoneStatus] = useState('default')

    useEffect(() => {
        // Handler to call on window resize
        const handleResize = () => {
            // Set window width to state
            setWindowWidth(window.innerWidth);
        };
        // Add event listener
        window.addEventListener('resize', handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [render]); // Empty array ensures that effect is only run on mount and unmount

    return (
        <>
            <Navbar isBordered variant="sticky">

                <Navbar.Toggle showIn={'xs'} />

                <Navbar.Brand onClick={() => {
                    window.location.pathname = '/'
                }}
                    css={{
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    }}>
                    <Image
                        css={{
                            height: '24px',
                            width: '100%',
                        }}
                        src={AshokaLogo} />
                    <Text b color="inherit" css={{
                        padding: '0px 8px',
                        '&:hover': {
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }
                    }}>
                        UniSwap™
                    </Text>
                </Navbar.Brand>

                {Object.keys(localStorage).length >= 2 &&
                    <Navbar.Content
                        enableCursorHighlight
                        activeColor="error"
                        hideIn="xs"
                        variant="underline"
                    >
                        <Navbar.Link href="/saleitems" >Sale Items</Navbar.Link>
                        <Dropdown isBordered>
                            <Navbar.Item>
                                <Dropdown.Button
                                    auto
                                    light
                                    css={{
                                        px: 0,
                                        dflex: "center",
                                        svg: { pe: "none" },
                                    }}
                                    iconRight={icons.chevron}
                                    ripple={false}
                                >
                                    Category
                                </Dropdown.Button>
                            </Navbar.Item>
                            <Dropdown.Menu
                                aria-label="Items Category"
                                selectionMode="single"
                                // selectedKeys={selected}
                                onSelectionChange={(selection) => {
                                    console.log(selection)
                                    navigate('/saleitems', { state: { category: `${selection.currentKey}` } });
                                }}
                                css={{
                                    $$dropdownMenuWidth: "340px",
                                    $$dropdownItemHeight: "70px",
                                    "& .nextui-dropdown-item": {
                                        py: "$4",
                                        // dropdown item left icon
                                        svg: {
                                            color: "$secondary",
                                            mr: "$4",
                                        },
                                        // dropdown item title
                                        "& .nextui-dropdown-item-content": {
                                            w: "100%",
                                            fontWeight: "$semibold",
                                        },
                                    },
                                }}
                            >
                                {categories.map((category, index) => (
                                    <Dropdown.Item
                                        key={category.key}
                                        showFullDescription
                                        description={category.description}
                                        icon={category.icon}
                                    // onClick={()=>{
                                    //     navigate('/saleitems', {state: {
                                    //         category: `${category.key}`
                                    //     }})
                                    // }}
                                    >
                                        <Navbar.Link css={{
                                            fontWeight: '$semibold'
                                        }}
                                        >
                                            {category.value}
                                        </Navbar.Link>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Navbar.Link href="/about">About</Navbar.Link>
                        <Navbar.Link href="/outlets">Outlets</Navbar.Link>
                    </Navbar.Content>
                }

                <Navbar.Content
                    css={{
                        "@xs": {
                            w: "12%",
                            jc: "flex-end",
                        },
                    }}
                >
                    {loginLoader && Object.keys(localStorage).length <= 2 &&
                        <Skeleton variant="circular" width={40} height={40} />
                    }
                    {Object.keys(localStorage).length <= 2 ?
                        <div className="GoogleButton" id='GoogleButton'></div>
                        :
                        <Dropdown placement="bottom-right">
                            <Navbar.Item>
                                <Dropdown.Trigger>
                                    <Avatar
                                        bordered
                                        as="button"
                                        color=""
                                        size="md"
                                        // src={`https://api.multiavatar.com/${localStorage.getItem('userEmail')}.png?apikey=Bvjs0QyHcCxZNe`}
                                        src={localStorage.getItem('userPicture')}
                                    />
                                </Dropdown.Trigger>
                            </Navbar.Item>
                            <Dropdown.Menu
                                aria-label="User menu actions"
                                color="error"
                                onAction={(actionKey) => {
                                    if (actionKey === 'logout') {
                                        handleLogout()
                                    }
                                    else if (actionKey === 'useritems' || actionKey === 'favourites' || actionKey == 'createsale') {
                                        window.location.pathname = `/${actionKey}`
                                    }
                                    else if (actionKey === 'phoneAuth') {
                                        setShowNumberUpdateModal(true)
                                    }
                                    else {
                                        console.log(`Yes ${localStorage.getItem('userName')}, you are signed in. `)
                                    }
                                }}
                            >
                                <Dropdown.Item key="profile" css={{ height: "$22", }}>
                                    <Text b color="$gray600" css={{ d: "flex", fontSize: '$xs' }}>
                                        Signed in as
                                    </Text>
                                    <Text b color="inherit" css={{ d: "flex", fontSize: '$base' }}>
                                        {localStorage.getItem('userName')}
                                    </Text>
                                    {/* <Text b color="inherit" 
                                    css={{ 
                                        d: "flex", 
                                        fontSize: '$sm',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                    >
                                        {localStorage.getItem('userEmail')}
                                    </Text> */}
                                </Dropdown.Item>
                                <Dropdown.Item key="createsale" withDivider color=""
                                    icon={<FaPlus size={16} />}>
                                    Create Sale
                                </Dropdown.Item>
                                <Dropdown.Item key="useritems" color=""
                                    icon={<FaBagShopping size={16} />}>
                                    My Sale Items
                                </Dropdown.Item>
                                <Dropdown.Item key="favourites" color=""
                                    icon={<IoMdHeart size={16} />}>
                                    Favourites
                                </Dropdown.Item>
                                <Dropdown.Item key="phoneAuth" color=""
                                    icon={<FaPhone size={16} />}>
                                    Update Phone
                                </Dropdown.Item>
                                <Dropdown.Item key="logout" withDivider color="error"
                                    icon={<IoLogOut size={16} />}>
                                    Log Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Navbar.Content>

                {Object.keys(localStorage).length <= 2 ?
                    <Navbar.Collapse>
                        {collapseItemsLoggedOut.map((item, index) => (
                            <Navbar.CollapseItem
                                key={item.key}
                                activeColor=""
                            >
                                <Link
                                    color="inherit"
                                    css={{
                                        minWidth: "100%",
                                    }}
                                    href=''
                                >
                                    {item.value}
                                </Link>
                            </Navbar.CollapseItem>
                        ))}
                    </Navbar.Collapse>
                    :
                    <Navbar.Collapse>
                        {collapseItemsLoggedIn.map((item, index) => (
                            <Navbar.CollapseItem
                                key={item.key}
                                activeColor=""
                                css={{
                                    color: index === collapseItemsLoggedIn.length - 1 ? "$error" : "",
                                }}
                            >
                                {item.key === 'logout' ?
                                    <Col>
                                        <Link href="" onClick={handleLogout} css={{
                                            color: '$error'
                                        }}>
                                            {item.value}
                                        </Link>
                                    </Col>
                                    :
                                    <Link
                                        color="inherit"
                                        css={{
                                            minWidth: "100%",
                                        }}
                                        href={item.key}
                                    >
                                        {item.value}
                                    </Link>
                                }
                            </Navbar.CollapseItem>
                        ))}
                    </Navbar.Collapse>
                }
            </Navbar>

            <Modal
                open={showAshokaOnlyModal}
                closeButton
            >
                <Modal.Header
                    css={{
                        paddingTop: '0px',
                    }}>
                    <Col>
                        <Text
                            css={{
                                textAlign: 'center',
                                fontSize: '$2xl',
                                fontWeight: '$bold',
                                color: '$red600',
                                borderStyle: 'solid',
                                borderWidth: '0px 0px 1px 0px',
                                borderColor: '$gray800'
                            }}>
                            Error!
                        </Text>

                    </Col>
                </Modal.Header>
                <Modal.Body
                    css={{
                        paddingTop: '0px'
                    }}>
                    <Text
                        css={{
                            textAlign: 'center',
                            fontSize: '$lg',
                            fontWeight: '$semibold',
                            color: '$black',
                        }}>
                        Please login with an ashoka email only.
                    </Text>
                </Modal.Body>

            </Modal>

            <Modal
                open={showNumberModal}
                preventClose
            >
                <Grid.Container css={{
                    jc: 'center',
                    alignItems: '',
                    padding: '24px 0px',
                }}>
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 'max-content',
                        gap: 12
                    }}>
                        <Text css={{
                            '@xsMin': {
                                fontSize: '$2xl'
                            },
                            '@xsMax': {
                                fontSize: '$lg'
                            },
                            fontWeight: '$semibold'
                        }}>
                            Save Phone Number
                        </Text>

                        <Text css={{
                            '@xsMin': {
                                fontSize: '$md'
                            },
                            '@xsMax': {
                                fontSize: '$sm'
                            },
                            fontWeight: '$regular',
                            marginBottom: '24px',
                            padding: '0px 48px',
                            lineHeight: '1.3'
                        }}>
                            Since this is your first time logging in, we need to save your number so you don't have to ever again.
                        </Text>

                        <Input css={{
                            width: '200px',
                            background: '#697177'
                        }}
                            labelLeft={
                                <IoLogoWhatsapp size={24} color="#25D366" />
                            }
                            animated={false}
                            placeholder="9876512340"
                            maxLength={12}
                            status={phoneStatus}
                            helperText="Whatsapp Contact Number!"
                            onChange={(e) => {
                                const inputVal = e.target.value;
                                const numVal = parseInt(inputVal, 10);
                                // setNumber(numVal)
                                // console.log(number)
                                // Check if the input value is a number and its length
                                if (!isNaN(numVal) && inputVal.length >= 10) {
                                    setPhoneStatus('success');
                                    setNumber(parseInt(e.target.value, 10))
                                } else {
                                    setPhoneStatus('error');
                                }
                                if (inputVal.length === 0) {
                                    setPhoneStatus('default')
                                }
                            }}

                        />

                        <Button flat auto color={'primary'} css={{
                            margin: '24px 0px'
                        }}
                            disabled={phoneStatus !== 'success'}
                            onClick={() => {
                                updateContactNumber()
                            }}>
                            Save
                        </Button>
                    </Col>
                </Grid.Container>
            </Modal>

            <Modal
                open={showNumberUpdateModal}
                closeButton
                onClose={() => {
                    setShowNumberUpdateModal(false)
                }}
            >
                <Grid.Container css={{
                    jc: 'center',
                    alignItems: '',
                    padding: '24px 0px',
                }}>
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 'max-content',
                        gap: 24
                    }}>
                        <Text css={{
                            '@xsMin': {
                                fontSize: '$xl'
                            },
                            '@xsMax': {
                                fontSize: '$lg'
                            },
                            fontWeight: '$semibold'
                        }}>
                            Update Phone Number
                        </Text>

                        <Input css={{
                            width: '200px',
                            backgroundColor: '#697177'
                        }}
                            labelLeft={
                                <IoLogoWhatsapp size={24} color="#25D366" />
                            }
                            animated={false}
                            placeholder="9876512340"
                            maxLength={12}
                            status={phoneStatus}
                            helperText="Whatsapp Contact Number!"
                            onChange={(e) => {
                                const inputVal = e.target.value;
                                const numVal = parseInt(inputVal, 10);
                                setNumber(numVal)

                                // Check if the input value is a number and its length
                                if (!isNaN(numVal) && inputVal.length >= 10) {
                                    setPhoneStatus('success');
                                    setNumber(e.target.value)
                                } else {
                                    setPhoneStatus('error');
                                }
                                if (inputVal.length === 0) {
                                    setPhoneStatus('default')
                                }
                            }}

                        />

                        <Button flat auto color={'primary'} css={{
                            margin: '24px 0px'
                        }}
                            disabled={phoneStatus !== 'success'}
                            onClick={() => {
                                updateContactNumber()
                            }}>
                            Update
                        </Button>
                    </Col>
                </Grid.Container>
            </Modal>

            {!(window.location.pathname === '/createsale' || window.location.pathname === '/editsale' || Object.keys(localStorage).length <= 4) ?
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
                            backgroundColor: '#000',
                            width: '100vw',
                            height: 'max-content'
                        }}>
                            <Row css={{
                                maxW: '330px',
                                justifyContent: 'space-around',
                                padding: '12px 0px 36px 0px',
                                alignItems: 'center'
                            }}>
                                {navigationItems.map(navItem => {
                                    const IconComponent = navItem.icon;
                                    const isSelected = location.pathname === navItem.path;

                                    return (
                                        <IconComponent
                                            key={navItem.path}
                                            size={24}
                                            color={isSelected ? '#F31260' : 'gray'}
                                            onClick={() => navigate(navItem.path)}
                                        />
                                    );
                                })}
                                <Dropdown placement="top-right">
                                    <Dropdown.Trigger>
                                        <Avatar
                                            // as="button"
                                            color=""
                                            size="sm"
                                            // src={`https://api.multiavatar.com/${localStorage.getItem('userEmail')}.png?apikey=Bvjs0QyHcCxZNe`}
                                            src={localStorage.getItem('userPicture')}
                                        />
                                    </Dropdown.Trigger>
                                    <Dropdown.Menu
                                        aria-label="User menu actions"
                                        color="error"
                                        onAction={(actionKey) => {
                                            if (actionKey === 'logout') {
                                                handleLogout()
                                            }
                                            else if (actionKey === 'useritems' || actionKey === 'favourites' || actionKey == 'createsale') {
                                                window.location.pathname = `/${actionKey}`
                                            }
                                            else if (actionKey === 'phoneAuth') {
                                                setShowNumberUpdateModal(true)
                                            }
                                            else {
                                                console.log(`Yes ${localStorage.getItem('userName')}, you are signed in. `)
                                            }
                                        }}
                                    >
                                        <Dropdown.Item key="profile" css={{ height: "$22", }}>
                                            <Text b color="$gray600" css={{ d: "flex", fontSize: '$xs' }}>
                                                Signed in as
                                            </Text>
                                            <Text b color="inherit" css={{ d: "flex", fontSize: '$base' }}>
                                                {localStorage.getItem('userName')}
                                            </Text>
                                            <Text b color="inherit" css={{ d: "flex", fontSize: '$sm' }}>
                                                {localStorage.getItem('contactNumber')}
                                            </Text>
                                        </Dropdown.Item>

                                        <Dropdown.Item key="phoneAuth" withDivider color=""
                                            icon={<FaPhone size={16} />}>
                                            Update Phone
                                        </Dropdown.Item>
                                        <Dropdown.Item key="logout" withDivider color="error"
                                            icon={<IoLogOut size={16} />}>
                                            Log Out
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                        </BottomNavigation>
                    </Paper>
                </Grid.Container>
                :
                <>
                </>
            }

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropLoaderOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

        </>
    );
}