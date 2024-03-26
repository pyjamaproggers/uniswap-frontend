import React, { useEffect, useState } from "react";
import AshokaLogo from '../../assets/AshokaLogo.png'
import { Link, Text, Avatar, Dropdown, Image, Navbar } from "@nextui-org/react";
import { icons } from "../icons/icons.js";
import { GiClothes } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { GiJewelCrown } from "react-icons/gi";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineQuestionMark } from "react-icons/md";
import jwt_decode from "jwt-decode";

export default function Header() {
    const [render, setRender] = useState(false)
    const [userPicture, setUserPicture] = useState()

    const collapseItems = [
        { key: 'about', value: "About" },
        { key: 'logout', value: "Log Out" }
    ];

    const categories = [
        { key: 'clothing', value: 'Apparel', icon: <GiClothes size={40} color="#e91e63" />, description: 'Tees, Shirts, Corsettes, Shorts, Cargos, Dresses, Footwear and more.' }, // Vibrant Pink
        { key: 'food', value: 'Food', icon: <IoFastFoodSharp size={40} color="#ff9800" />, description: 'Fruits, Ramen, Masalas and more.' }, // Orange
        { key: 'tickets', value: 'Tickets', icon: <IoTicket size={40} color="#3f51b5" />, description: 'Concert, Show, Shuttle and more.' }, // Indigo
        { key: 'stationery', value: 'Stationery', icon: <FaFilePen size={40} color="#26a69a" />, description: 'Pens, Pencils, Erasers, Sharpeners, Notebooks, Highlighters and more.' }, // Green
        { key: 'jewellry', value: 'Jewellry', icon: <GiJewelCrown size={40} color="gold" />, description: 'Necklaces, Earrings, Nose Rings and more.' }, // Yellow
        { key: 'lostandfound', value: 'Lost & Found', icon: <MdOutlineQuestionMark size={40} color="#9e9e9e" />, description: 'Anything and everything lost around campus.' }, // Grey
        { key: 'miscellaneous', value: 'Miscellaneous', icon: <MdMiscellaneousServices size={40} color="#0c0c0c" />, description: "Anything and everything that doesn't fall into the above categories" }, // Cyan
    ]

    // funciton to handle callback for google sign in
    function handleCallbackresponse(response) {
        var userObject = jwt_decode(response.credential)
        document.getElementById("GoogleButton").hidden = true;
        console.log(userObject)
        localStorage.setItem('userEmail', userObject.email)
        localStorage.setItem('userName', userObject.name)
        localStorage.setItem('userEmailVerified', userObject.email_verified)
        localStorage.setItem('userPicture', userObject.picture)
        console.log(localStorage)
        setRender((prev)=>!prev)
    }

    function handleLogout() {
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        localStorage.removeItem('userEmailVerified')
        localStorage.removeItem('userPicture')
        console.log(localStorage)
        window.location.pathname='/'
    }

    useEffect(() => {
        window.setTimeout(() => {
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENTID,
                callback: handleCallbackresponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById("GoogleButton"),
                { theme: 'outlined', size: 'large', shape: 'circle', type: 'icon'}
            );
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
                <Navbar.Brand>
                    <Image
                        css={{
                            height: '48px',
                            width: '100%',
                        }}
                        src={AshokaLogo} />
                    <Text b color="inherit" css={{
                        padding: '0px 8px'
                    }}>
                        UniSwap™
                    </Text>
                </Navbar.Brand>
                <Navbar.Content
                    enableCursorHighlight
                    activeColor="error"
                    hideIn="xs"
                    variant="underline"
                >
                    <Navbar.Link href="/">Items</Navbar.Link>
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
                            onSelectionChange={(selection) => { window.location.pathname = selection.currentKey }}
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
                                    <Navbar.Link href={category.key}>
                                        {category.value}
                                    </Navbar.Link>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Navbar.Link href="/about">About</Navbar.Link>
                </Navbar.Content>
                <Navbar.Content
                    css={{
                        "@xs": {
                            w: "12%",
                            jc: "flex-end",
                        },
                    }}
                >
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
                                onAction={(actionKey)=>{
                                    actionKey==='logout' ? handleLogout() : console.log(`Yes ${localStorage.getItem('userName')}, you are signed in. `)
                                }}
                            >
                                <Dropdown.Item key="profile" css={{ height: "$18" }}>
                                    <Text b color="inherit" css={{ d: "flex" }}>
                                        Signed in as
                                    </Text>
                                    <Text b color="inherit" css={{ d: "flex", fontSize: '$xs' }}>
                                        {localStorage.getItem('userEmail')}
                                    </Text>
                                </Dropdown.Item>
                                <Dropdown.Item key="logout" withDivider color="error">
                                    Log Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Navbar.Content>
                <Navbar.Collapse>
                    {collapseItems.map((item, index) => (
                        <Navbar.CollapseItem
                            key={item.key}
                            activeColor=""
                            css={{
                                color: index === collapseItems.length - 1 ? "$error" : "",
                            }}
                            isActive={index === 2}
                        >
                            <Link
                                color="inherit"
                                css={{
                                    minWidth: "100%",
                                }}
                                href={item.key}
                            >
                                {item.value}
                            </Link>
                        </Navbar.CollapseItem>
                    ))}
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
