import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setUserItems } from '../../slices/userItemsSlice';
import { useNavigate } from 'react-router-dom';
import { Col, Grid, Input, Text, Row, Badge, Avatar, useTheme, Button } from "@nextui-org/react";
import ItemCard from "../../components/items/itemCard";
import { IoSearchSharp } from "react-icons/io5";
import './eventsPage.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PullToRefresh from 'react-simple-pull-to-refresh';
import FlatList from 'flatlist-react';
import { Ri24HoursFill } from "react-icons/ri";
import EventCard from "../../components/events/eventCard";
import messaging from "../../firebase.js";
import { getToken } from "firebase/messaging";

export default function EventsPage() {

    const backend = process.env.REACT_APP_BACKEND
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userItems = useSelector(state => state.userItems);
    const [userFCMToken, setUserFCMToken] = useState('')
    const [filteredItems, setFilteredItems] = useState([]);
    const events = [
        {
            _id: 1,
            userName: 'Ashoka Premier League',
            userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
            userPicture: '',
            eventName: `APL Auction`,
            eventDescription: 'Yadav to Suiiicide Squad? Achappa to Gaddi Red Challengers? Jaidhar to Pineapple Express? Come and witness live, cheer for your friends!',
            eventDate: '2024-04-20',
            eventTime: '20:00:00.000+00:00',
            eventLocation: 'MPH, Sports Block',
            eventCategory: 'sports',
            notifications: ['cVIiyQ04Doti-kIsQTj4WN:APA91bFpqBRzd6ERAtE_jpU0P37rQSAYqAgSCbeRgY8o1y5QWP12NJqkajgbQxbIfq00Mqc8pxNfrpxWGNYw65maM80Y7VMHwDs28xtSH1iSMpWOzQYgRBB48Rm6QhAS5QDXLoMMo6eT', 'y', 'z'],
            live: 'y'
        },
        {
            _id: 2,
            userName: 'Computer Science Society',
            userEmail: 'aryan.yadav_ug@ashoka.edu.in',
            userPicture: '',
            eventName: `CS Mixer`,
            eventDescription: 'CS is awesome. Come join us. Free cookies for everyone hehehehehe.',
            eventDate: '2024-04-16',
            eventTime: '15:30:00.000+00:00',
            eventLocation: '207, AC02',
            eventCategory: 'academic',
            notifications: ['cVIiyQ04Doti-kIsQTj4WN:APA91bFpqBRzd6ERAtE_jpU0P37rQSAYqAgSCbeRgY8o1y5QWP12NJqkajgbQxbIfq00Mqc8pxNfrpxWGNYw65maM80Y7VMHwDs28xtSH1iSMpWOzQYgRBB48Rm6QhAS5QDXLoMMo6eT'],
            live: 'y'
        },
        {
            _id: 3,
            userName: 'R3spawn',
            userEmail: 'riwa.desai_ug23@ashoka.edu.in',
            userPicture: '',
            eventName: `R3spawn Inductions`,
            eventDescription: `Fresher? Into gaming? Join Ashoka's gaming club and go crazy`,
            eventDate: '2024-04-22',
            eventTime: '12:00:00.000+00:00',
            eventLocation: 'Outside Mess',
            eventCategory: 'club',
            notifications: [],
            live: 'y'
        },
        {
            _id: 4,
            userName: 'Banjaara',
            userEmail: 'riwa.desai_ug23@ashoka.edu.in',
            userPicture: '',
            eventName: `Banjaara Cultural Fest`,
            eventDescription: `About time for the university cultural fest. Come and experience it blow your mind yet again!`,
            eventDate: '2024-04-26',
            eventTime: '15:00:00.000+00:00',
            eventLocation: 'Mess Lawns',
            eventCategory: 'club',
            notifications: [],
            live: 'y'
        },
    ]
    const [filtersApplied, setFiltersApplied] = useState({
        category: [],
        searched: '',
        upcoming: false
    });
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false)
    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)
    const [fetchingAllItems, setFetchingAllItems] = useState(true)
    const [render, setRender] = useState(false)
    const ITEMS_PER_PAGE = 10;
    const [lastItemIndex, setLastItemIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState([]);
    const [bgColor, setBgColor] = useState('')
    const [topImageLoading, setTopImageLoading] = useState(true)

    const loadMoreItems = () => {

        const nextItems = filteredItems.slice(lastItemIndex, lastItemIndex + ITEMS_PER_PAGE);

        setVisibleItems(prevItems => [...prevItems, ...nextItems]);
        setLastItemIndex(lastItemIndex + ITEMS_PER_PAGE);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 20) return;
            loadMoreItems(); // Load more items when the user scrolls to the bottom
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastItemIndex, filteredItems]);

    const [categoryFilters, setCategoryFilters] = useState([
        { key: 'academic', value: 'Academic', color: "error", chosen: false }, // Vibrant Pink
        { key: 'sports', value: 'Sports', color: "primary", chosen: false }, // Indigo
        { key: 'food', value: 'Food', color: "warning", chosen: false }, // Yellow
        { key: 'club', value: 'Club', color: "success", chosen: false }, // Orange
    ]);

    useEffect(() => {
        verifyUserSession()
        checkFCMToken()

        const categoryKeyFromNavbar = location.state?.category;
        if (categoryKeyFromNavbar) {
            // Toggle the "chosen" property for the clicked filter
            const updatedCategoryFilters = categoryFilters.map(filter => {
                if (filter.key === categoryKeyFromNavbar) {
                    return { ...filter, chosen: !filter.chosen };
                }
                return filter;
            });
            // console.log(categoryKeyFromNavbar)
            setCategoryFilters(updatedCategoryFilters);

            // Update filtersApplied state for categories
            setFiltersApplied(prevState => {
                const isFilterApplied = prevState.category.includes(categoryKeyFromNavbar);
                const newCategoryFilters = isFilterApplied
                    ? prevState.category.filter(k => k !== categoryKeyFromNavbar) // Remove filter
                    : [...prevState.category, categoryKeyFromNavbar]; // Add filter

                return {
                    ...prevState,
                    category: newCategoryFilters,
                };
            });
        }

    }, [])

    useEffect(() => {
        filterItems()
    }, [filtersApplied, userItems]);

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
                // fetchAllItems(data.user.userEmail)
                setFilteredItems(events)
                // Optionally update the UI or state based on the response
            })
            .catch(error => {
                console.error('Error verifying user session:', error);
                setShowErrorSnackbar(true)
                // Redirect to login page or show an error page
                navigate('/unauthorized'); // Adjust the path as necessary
            });
    };

    function filterItems() {
        // setBackdropLoaderOpen(true)
        // console.log("filtering")
        // let result = userItems;
        let result = events

        // Filter by category
        if (filtersApplied.category.length > 0) {
            result = result.filter(event =>
                filtersApplied.category.includes(event.eventCategory)
            );
        }

        // Filter by searched text
        if (filtersApplied.searched.trim() !== '') {
            const searchTerms = filtersApplied.searched.toLowerCase().trim().split(/\s+/);
            result = result.filter(event => {
                const eventText = `${event.userName} ${event.userEmail} ${event.eventName} ${event.eventDescription} ${event.contactNumber}`.toLowerCase();
                // Check for matches of all search terms in the combined text
                return searchTerms.every(term => eventText.includes(term));
            });
        }

        // Filter by 'upcoming' - within next 24 hours
        if (filtersApplied.upcoming) {
            const now = new Date();
            const twentyFourHoursLater = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 hours from now

            result = result.filter(item => {
                const itemDate = new Date(item.date); // item.date should be in ISO format
                return itemDate >= now && itemDate <= twentyFourHoursLater;
            });
        }

        var final = []
        result.forEach(item => {
            final.push(item)
        })
        setFilteredItems(final);
        setVisibleItems(final.slice(0, ITEMS_PER_PAGE));
        setLastItemIndex(ITEMS_PER_PAGE);
    }

    const fetchAllItems = async (userEmail) => {
        setFetchingAllItems(true);
        try {
            const response = await fetch(`${backend}/items`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let items = await response.json();

            items.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            let tempUserItems = items.filter(item => item.userEmail === userEmail)

            dispatch(setUserItems(tempUserItems));
            setFilteredItems(tempUserItems);
            setVisibleItems(tempUserItems.slice(0, ITEMS_PER_PAGE));
            setLastItemIndex(ITEMS_PER_PAGE);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setFetchingAllItems(false);
        }
    };

    const handleLiveToggle = (itemIDToUpdate, newStatus) => {
        var newUserItems = userItems.map((userItem) => {
            if (userItem._id === itemIDToUpdate) {
                return { ...userItem, live: newStatus };
            }
            return userItem;
        })

        dispatch(setUserItems(newUserItems))
        setRender((prev) => (!prev))
    };

    const onItemDeleted = (itemIDToDelete) => {
        var newUserItems = userItems.map((userItem) => {
            if (userItem._id !== itemIDToDelete) {
                return userItem;
            }
        })

        dispatch(setUserItems(newUserItems))
        window.location.pathname = '/useritems'
    }

    const checkFCMToken = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                getToken(messaging, { vapidKey: "BDiwlGg-uzE3Q5y94jyh_bSPo-b2v0A1thC9ePGnk7nt7E_3yuyGGf-Uqi4p6OSVG7tqdmhBU_T5CXOuoFJMACo" }).then((currentToken) => {
                    if (currentToken) {
                        console.log("Checking FCM Token:", currentToken);
                        setUserFCMToken(currentToken)
                    }
                }).catch((err) => console.log("An error occurred while retrieving token. ", err));
            }
        })
    }

    const getFCMToken = (eventID, operation, setSwitchLoading) => {
        if (Notification.permission === 'granted') {
            getToken(messaging, { vapidKey: "BDiwlGg-uzE3Q5y94jyh_bSPo-b2v0A1thC9ePGnk7nt7E_3yuyGGf-Uqi4p6OSVG7tqdmhBU_T5CXOuoFJMACo" }).then((currentToken) => {
                if (currentToken) {
                    console.log("Getting FCM Token:", currentToken);
                    addUserFCMTokenToEventTokens(eventID, operation, setSwitchLoading, currentToken)
                }
            }).catch((err) => console.log("An error occurred while retrieving token. ", err));
        }
        else{
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    getToken(messaging, { vapidKey: "BDiwlGg-uzE3Q5y94jyh_bSPo-b2v0A1thC9ePGnk7nt7E_3yuyGGf-Uqi4p6OSVG7tqdmhBU_T5CXOuoFJMACo" }).then((currentToken) => {
                        if (currentToken) {
                            console.log("Getting FCM Token:", currentToken);
                            setUserFCMToken(currentToken)
                            addUserFCMTokenToEventTokens(eventID, operation, setSwitchLoading, currentToken)
                        }
                    }).catch((err) => console.log("An error occurred while retrieving token. ", err));
                }
            })
        }
    }

    const addUserFCMTokenToEventTokens = async (eventID, operation, setSwitchLoading, FCMtoken) => {
        // Add user's fcm token to event._id's "notifications" variable that holds the fcm tokens
        // function arguments are user's fcm token and operation which can be either "add" or "remove" hence defining our REST operation of either "put" or "delete"
        
        // Simulating adding token to array below
        window.setTimeout(()=>{
            if(operation==='remove'){
                var updatedEvents = filteredItems.map((event,index)=>{
                    if(event._id === eventID){
                        event.notifications = event.notifications.filter(token => token!==FCMtoken)
                    }
                    return event
                })
            }
            else{
                var updatedEvents = filteredItems.map((event,index)=>{
                    if(event._id === eventID){
                        event.notifications.push(FCMtoken)
                    }
                    return event
                })
            }
            console.log(updatedEvents)
            setFilteredItems(updatedEvents)
            setSwitchLoading(false)
        }, 2000)
    }

    const theme = useTheme()

    const renderItem = (event, index) => {
        return (
            <div key={event._id} id={event._id}>
                <EventCard
                    event={event}
                    type={"live"}
                    userFCMToken={userFCMToken}
                    getFCMToken={getFCMToken}
                />
            </div>
        )
    }

    return (
        <PullToRefresh onRefresh={() => fetchAllItems()}
            pullingContent={''}
            maxPullDownDistance={80}
            pullDownThreshold={60}
            aria-label='pulltorefresh'
        >

            <Grid.Container>
                {/* {!topImageLoading && */}
                <Grid.Container css={{
                    padding: '4px 4px',
                    jc: 'center',
                    marginBottom: '100px',
                    marginTop: '12px'
                }}>
                    <Row css={{
                        '@xsMin': {
                            padding: '0% 2% 1% 2%'
                        },
                        '@xsMax': {
                            padding: '0% 4% 1% 4%'
                        },
                        alignItems: 'center',
                        gap: 12,
                        jc: 'center'
                    }}>
                        <Input clearable placeholder="Corset / Cargos / Necklace" width="280px" css={{ margin: '0px 0px 8px 0px', fontSize: '16px' }}
                            initialValue=""
                            labelLeft={<IoSearchSharp size={'20px'} color={""} />}
                            animated={false}
                            onChange={(e) => {
                                setFiltersApplied(prev => ({
                                    ...prev,
                                    searched: e.target.value
                                }))
                            }}
                            className="items-search-input"
                            aria-label="input-search"
                        />
                        <Ri24HoursFill size={'20px'} color={
                            filtersApplied.upcoming ?
                                '#fff'
                                :
                                'gray'
                        }
                            style={{
                                marginBottom: '8px',
                                marginLeft: '4px'
                            }}
                            onClick={() => {
                                setFiltersApplied(prev => ({
                                    ...prev,
                                    upcoming: !filtersApplied.upcoming
                                }))
                            }}
                        />
                    </Row>

                    <Grid.Container css={{
                        '@xsMin': {
                            padding: '0% 2% 2% 2%'
                        },
                        '@xsMax': {
                            padding: '0% 2% 2% 2%'
                        },
                        alignItems: 'center',
                        jc: 'center'
                    }}>
                        <Row css={{
                            alignItems: 'center',
                            gap: 4,
                            jc: 'center',
                        }}>
                            <div className="horizontal-scroller-events">
                                {categoryFilters.map((categoryFilter) => (
                                    <Grid key={categoryFilter.key} css={{
                                        margin: '4px 2px',
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}>
                                        <Badge
                                            variant="flat"
                                            size="md"
                                            color={categoryFilter.chosen ? categoryFilter.color : "neutral"} // Use the filter's color if chosen
                                            onClick={() => {
                                                // Toggle the "chosen" property for the clicked filter
                                                const updatedCategoryFilters = categoryFilters.map(filter => {
                                                    if (filter.key === categoryFilter.key) {
                                                        return { ...filter, chosen: !filter.chosen };
                                                    }
                                                    return filter;
                                                });
                                                setCategoryFilters(updatedCategoryFilters);

                                                // Assuming you have a similar state management for category as you have for price
                                                // Update a hypothetical filtersApplied state for categories
                                                setFiltersApplied(prevState => {
                                                    const isFilterApplied = prevState.category.includes(categoryFilter.key);
                                                    const newCategoryFilters = isFilterApplied
                                                        ? prevState.category.filter(k => k !== categoryFilter.key) // Remove filter
                                                        : [...prevState.category, categoryFilter.key]; // Add filter

                                                    return {
                                                        ...prevState,
                                                        category: newCategoryFilters,
                                                    };
                                                });
                                            }}
                                        >
                                            {categoryFilter.value}
                                        </Badge>
                                    </Grid>
                                ))}
                            </div>
                        </Row>

                    </Grid.Container>
                    {!fetchingAllItems && !backdropLoaderOpen && filteredItems.length > 0 &&
                        <FlatList
                            list={filteredItems}
                            renderItem={renderItem}
                            renderOnScroll={true}
                            renderWhenEmpty={
                                <Text>
                                    { }
                                </Text>
                            }
                        />
                    }

                    {filteredItems.length === 0 && !fetchingAllItems && !backdropLoaderOpen &&
                        <Grid.Container css={{
                            jc: 'center',
                        }}>
                            <Text css={{
                                width: '100vw',
                                fontSize: '$base',
                                fontWeight: '$medium',
                                textAlign: 'center',
                                // lineHeight: '1',
                                marginTop: '132px',
                                paddingBottom: '8px'
                            }}>
                                No upcoming events
                            </Text>

                        </Grid.Container>
                    }

                </Grid.Container>
                {/* } */}

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

            </Grid.Container>


        </PullToRefresh>
    )
}