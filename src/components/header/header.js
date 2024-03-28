import React, { useEffect, useState } from "react";
import AshokaLogo from '../../assets/AshokaLogo.png'
import { Link, Text, Avatar, Dropdown, Image, Navbar, Modal, Col, Row } from "@nextui-org/react";
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
import { useNavigate } from 'react-router-dom';
import { MdOutlinePhoneIphone } from "react-icons/md";

export default function Header() {
    const [render, setRender] = useState(false)
    const [loginLoader, setLoginLoader] = useState(true)
    const [showAshokaOnlyModal, setShowAshokaOnlyModal] = useState(false)
    const backend = process.env.REACT_APP_BACKEND
    // console.log(backend)
    const navigate = useNavigate();

    const collapseItemsLoggedOut = [
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
    function handleCallbackresponse(response) {
        var googleUserObject = jwt_decode(response.credential);
        console.log(googleUserObject);
        if (googleUserObject.email.split('@')[1] !== 'ashoka.edu.in') {
            setShowAshokaOnlyModal(true);
        } else {
            fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: response.credential }), // Send Google token to backend
                credentials: 'include', // Necessary to include the cookie in requests
            })
                .then(res => res.json()) // Adjusted to parse JSON body
                .then(data => {
                    if (data.user) { // Assuming the backend sends back an object with a user property
                        // Store user details for future use.
                        console.log(data.user)
                        localStorage.setItem('userEmail', data.user.userEmail);
                        localStorage.setItem('userName', data.user.userName);
                        localStorage.setItem('userPicture', data.user.userPicture);
                        setRender((prev) => !prev);
                        window.location.pathname = '/';
                    } else {
                        throw new Error('Authentication failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle authentication error (e.g., show error message)
                });
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (localStorage.getItem('userEmail')) {
                try {
                    const postedItemsResponse = await fetch(`${backend}/api/user/items`, { credentials: 'include' });
                    const postedItems = await postedItemsResponse.json();
                    localStorage.setItem('itemsPosted', JSON.stringify(postedItems));
                    const favoriteItemsResponse = await fetch('http://localhost:8080/api/user/favorites', { credentials: 'include' });
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
        fetch('http://localhost:8080/api/auth/logout', {
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
                    // Redirect user to the homepage or login page
                    window.location.pathname='/' // Adjust the path as necessary for your application
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Optionally handle the error, maybe show a notification to the user
            });
    }

    useEffect(() => {
        fetch('/api/auth/profile', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.isAuthenticated) {
                    // Update UI to reflect authenticated state
                } else {
                    // User is not authenticated
                }
            });
    }, []);

    useEffect(() => {
        setLoginLoader(true)
        window.setTimeout(() => {
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENTID,
                callback: handleCallbackresponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById("GoogleButton"),
                { theme: 'outlined', size: 'large', shape: 'circle', type: 'icon' }
            );
            setLoginLoader(false)
        }, 2000)

    }, [])

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
                                    >
                                        <Navbar.Link href={category.key} css={{
                                            fontWeight: '$semibold'
                                        }}
                                        // onClick={()=>{
                                        //     navigate('/saleitems', {state: {
                                        //         category: `${category.key}`
                                        //     }})
                                        // }}
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
                                <Dropdown.Item key="mode" color=""
                                    icon={<MdOutlinePhoneIphone size={16} />}>
                                    <Row>
                                        <Text>
                                            Light/Dark Mode
                                        </Text>
                                    </Row>
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
                                    <Link href="" onClick={handleLogout} css={{
                                        color: '$error'
                                    }}>
                                        {item.value}
                                    </Link>
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

        </>
    );
}
