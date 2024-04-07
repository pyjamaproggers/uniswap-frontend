import React, { useEffect, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import { useNavigate } from 'react-router-dom';
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Button, Col, Grid, Input, Text, Row, Badge } from "@nextui-org/react";
import { IoFilter } from "react-icons/io5";
import ItemCard from "../../components/items/itemCard";
import Skeleton from '@mui/material/Skeleton';
import { IoSearchSharp } from "react-icons/io5";
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Chip from '@mui/material/Chip';
import './ItemsPage.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImSpinner9 } from "react-icons/im";
import { faSpinner, faV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
// import PullToRefresh from 'pulltorefreshjs';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { FixedSizeList as List } from 'react-window';


export default function ItemsPage(props) {

    const backend = process.env.REACT_APP_BACKEND
    const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;
    const navigate = useNavigate();

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false)

    const type = props.type

    const [fetchingAllItems, setFetchingAllItems] = useState(true)
    const [render, setRender] = useState(false)

    const [scrollRender, setScrollRender] = useState(false)

    const [filtersApplied, setFiltersApplied] = useState({
        price: [],
        category: [],
        searched: ''
    })

    const [allItems, setAllItems] = useState([])

    const [userItems, setUserItems] = useState([])

    const [filteredItems, setFilteredItems] = useState([...allItems]);

    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    // this is fetched from the users DB in header.js (favouriteItems: array of (ObjectID()))
    let tempFavouriteItems = JSON.parse(localStorage.getItem('favouriteItems'))
    const [favouriteItems, setFavouriteItems] = useState(tempFavouriteItems ? tempFavouriteItems : [])

    const [visibleItems, setVisibleItems] = useState([]);
    const [lastItemIndex, setLastItemIndex] = useState(0);

    const ITEMS_PER_PAGE = 5; // Number of items you want to load per chunk

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('favouriteItems'))) {
            localStorage.setItem('favouriteItems', JSON.stringify([]))
        }
    }, [])

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
                setShowErrorSnackbar(true)
                // Redirect to login page or show an error page
                navigate('/unauthorized'); // Adjust the path as necessary
            });
    };

    useEffect(() => {
        verifyUserSession();
    }, []);

    const toggleLiveStatus = async (itemId) => {
        try {
            const response = await fetch(`${backend}/api/items/live/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Other necessary headers like authorization if needed
                },
                credentials: 'include',
                // If you need to send additional data in the body, include it here
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse JSON response here if needed
            const data = await response.json();

            console.log('Live status toggled:', data);
            // Update state or show a notification to the user based on the response
        } catch (error) {
            console.error('Failed to toggle live status:', error);
            setShowErrorSnackbar(true)
            // Handle error by showing a message to the user
        }
    };

    useEffect(() => {
        document.querySelectorAll('input, select, textarea').forEach((element) => {
            element.addEventListener('focus', (event) => event.preventDefault());
        });

        let searchInputElement = document.getElementsByClassName('items-search-input')[0]
        searchInputElement.addEventListener('focus', (event) => event.preventDefault())

    }, [])

    const [priceFilters, setPriceFilters] = useState([
        { key: '1', value: '₹0-₹100', chosen: false },
        { key: '2', value: '₹100-₹500', chosen: false },
        { key: '3', value: '₹500-₹1000', chosen: false },
        { key: '4', value: '₹1000-₹2000', chosen: false },
        { key: '5', value: '₹2000+', chosen: false }
    ]);

    const [categoryFilters, setCategoryFilters] = useState([
        { key: 'apparel', value: 'Apparel', color: "error", chosen: false }, // Vibrant Pink
        { key: 'food', value: 'Food', color: "secondary", chosen: false }, // Orange
        { key: 'tickets', value: 'Tickets', color: "primary", chosen: false }, // Indigo
        { key: 'stationery', value: 'Stationery', color: "success", chosen: false }, // Green
        { key: 'jewellry', value: 'Jewellry', color: "warning", chosen: false }, // Yellow
        { key: 'lost&found', value: 'Lost & Found', color: "default", chosen: false }, // Grey
        { key: 'miscellaneous', value: 'Miscellaneous', color: "default", chosen: false }, // Cyan
    ]);

    const getPriceRange = (rangeStr) => {
        const match = rangeStr.match(/₹(\d+)-₹(\d+)/) || rangeStr.match(/₹(\d+)\+/);
        if (match) {
            return match[1] ? { min: parseInt(match[1], 10), max: match[2] ? parseInt(match[2], 10) : Infinity } : null;
        }
        return null;
    };

    const isPriceWithinRange = (itemPrice, rangeStr) => {
        const range = getPriceRange(rangeStr);
        if (!range) return false;
        return itemPrice >= range.min && itemPrice <= range.max;
    };

    function filterItems(type) {
        setBackdropLoaderOpen(true)
        window.setTimeout(() => {
            let result = type === 'sale' || type === 'favourites' ? allItems : userItems;

            // Filter by price
            if (filtersApplied.price.length > 0) {
                const activePriceRanges = filtersApplied.price.map(key =>
                    priceFilters.find(filter => filter.key === key).value
                );

                result = result.filter(item =>
                    activePriceRanges.some(rangeStr => isPriceWithinRange(item.itemPrice, rangeStr))
                );
            }

            // Filter by category
            if (filtersApplied.category.length > 0) {
                result = result.filter(item =>
                    filtersApplied.category.includes(item.itemCategory)
                );
            }

            // Filter by searched text
            if (filtersApplied.searched.trim() !== '') {
                const searchTerms = filtersApplied.searched.toLowerCase().trim().split(/\s+/);
                result = result.filter(item => {
                    const itemText = `${item.userName} ${item.userEmail} ${item.itemName} ${item.itemDescription} ${item.contactNumber}`.toLowerCase();
                    // Check for matches of all search terms in the combined text
                    return searchTerms.every(term => itemText.includes(term));
                });
            }
            var final = []
            result.forEach(item => {
                final.push(item)
            })


            setFilteredItems(final);
            // console.log({ favouriteItems })
            setBackdropLoaderOpen(false)
        }, 200)
    }

    useEffect(() => {
        if (type === 'sale' || type === 'favourites') {
            filterItems(type);
        }
        else {
            filterItems(type)
        }
        setLastItemIndex(0)
        setVisibleItems([])
    }, [filtersApplied]);

    // useEffect(()=>{
    //     // run to refresh items
    // }, [type])

    const loadMoreItems = () => {
        // Determine the items to show based on the filters applied and type
        const currentItems = type === 'sale' || type === 'favourites' ? filteredItems : userItems;
        let currentLiveItems = []
        if(type === 'sale' || type === 'favourites'){
            currentLiveItems = currentItems.filter(x => x.live === 'y');
        }
        else{
            currentLiveItems = currentItems
        }
        let nextItems = [];
    
        if (type === 'favourites') {
            // Filter to get only favourite items that are live
            console.log('fv items: ', favouriteItems)
            let favouriteLiveItems = currentLiveItems.filter(liveItem => favouriteItems.includes(liveItem._id));
            
            // Filter out items that are already visible to avoid duplicates
            nextItems = favouriteLiveItems.filter(liveItem => !visibleItems.some(item => item._id === liveItem._id));
        } else {
            // Slice the next set of items for non-favourite types
            nextItems = currentLiveItems.slice(lastItemIndex, lastItemIndex + ITEMS_PER_PAGE);
        }
    
        // Debugging logs
        console.log('CURRENT LIVE ITEMS', currentLiveItems);
        console.log('nextItems: ', nextItems);
    
        if (currentLiveItems.length === 0) {
            console.log('its 0');
            // Handle the case when no more items are left to add
        } else {
            console.log('its not 0');
            // Only update the lastItemIndex if we are not processing favourites
            // This prevents advancing the index when re-filtering favourites
            if (type !== 'favourites') {
                setLastItemIndex(lastItemIndex + ITEMS_PER_PAGE);
            }
        }
    
        // Update the visible items with the new set of next items
        setVisibleItems(prevItems => [...prevItems, ...nextItems]);
    };
    

    const fetchAllItems = async () => {
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
    
            setAllItems(items);
            setFilteredItems(items); // Assuming you want to initially display all items regardless of type
            loadMoreItems()
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setFetchingAllItems(false);
        }
    };

    const sendNewFavouriteItemsToDB = (newFavouriteItems) => {
        console.log('New Favourite Items to save: ', newFavouriteItems)
        // post request to update user's "favouriteItems" data variable - replace old array with new array

    }

    const handleFavouriteItemToggle = (favouriteItems, itemIDToUpdate) => {
        // to toggle favourite iteam (like instagram "save" option)
        let updatedFavItems = favouriteItems
        if (updatedFavItems.includes(itemIDToUpdate)) {
            updatedFavItems = updatedFavItems.filter(itemID => itemID !== itemIDToUpdate)
        }
        else {
            updatedFavItems.push(itemIDToUpdate)
        }
        setFavouriteItems(updatedFavItems)
        localStorage.setItem('favouriteItems', JSON.stringify(updatedFavItems))
        sendNewFavouriteItemsToDB(updatedFavItems)
        setRender((prev) => (!prev))
    }

    const handleLiveToggle = (itemIDToUpdate, newStatus) => {
        var newUserItems = userItems.map((userItem) => {
            if (userItem._id === itemIDToUpdate) {
                return { ...userItem, live: newStatus };
            }
            return userItem;
        })

        setUserItems(newUserItems)

        var newVisibleItems = visibleItems.map((visibleItem) => {
            if (visibleItem._id === itemIDToUpdate) {
                return { ...visibleItem, live: newStatus };
            }
            return visibleItem;
        })
        setVisibleItems(newVisibleItems)
        setRender((prev) => (!prev))
    };

    const onItemDeleted = () => {
        window.location.pathname = '/useritems'
    }

    const shareItemViaWhatsApp = (itemId) => {
        // Your website's base URL
        const baseUrl = "https://uniswap.co.in";

        // Construct the URL to the specific item
        // Using a query parameter
        const itemUrl = `${baseUrl}/saleitems?itemId=${itemId}`;
        // Or using a hash fragment
        // const itemUrl = `${baseUrl}/saleitems#${itemId}`;

        // Encode the URL
        const encodedUrl = encodeURIComponent(itemUrl);

        // Message to share
        const message = `Check out this item on UniSwap: ${encodedUrl}`;

        // Open WhatsApp with the constructed URL
        window.open(`https://wa.me/?text=${message}`, "_blank");
    };

    function scrollToSharedItem() {
        const searchParams = new URLSearchParams(window.location.search);
        const itemId = searchParams.get('itemId');

        if (itemId) {
            const attemptScroll = (retryCount = 0) => {
                const elementToScrollTo = document.getElementById(itemId);
                if (elementToScrollTo) {
                    elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (retryCount < 5) { // Retry up to 5 times
                    setTimeout(() => attemptScroll(retryCount + 1), 500); // Wait 500ms before retrying
                }
            };

            attemptScroll();
        }
    }

    function filterItemsByEmail(email) {
        return allItems.filter(item => item.userEmail === email);
    }

    useEffect(() => {
        if (type === 'user') {
            let userEmail = localStorage.getItem('userEmail')
            let tempUserItems = filterItemsByEmail(userEmail)
            setUserItems(tempUserItems)
        }
    }, [allItems])

    useEffect(() => {
        console.log("User's items updated")
    }, [userItems])

    useEffect(() => {
        console.log('Updated favourite items on allItemsPage')
    }, [favouriteItems])

    useEffect(() => {
        const initializeItems = async () => {
            await fetchAllItems(); // Make sure this correctly sets allItems and filteredItems
        };
        initializeItems();
    }, []); // This effect runs once on component mount
    
    useEffect(()=> {
        loadMoreItems()
    }, [filteredItems, userItems, allItems])

    useEffect(() => {
        scrollToSharedItem()
    }, [scrollRender])

    const location = useLocation();

    useEffect(() => {
        const categoryKeyFromNavbar = location.state?.category;
        if (categoryKeyFromNavbar) {
            // Toggle the "chosen" property for the clicked filter
            const updatedCategoryFilters = categoryFilters.map(filter => {
                if (filter.key === categoryKeyFromNavbar) {
                    return { ...filter, chosen: !filter.chosen };
                }
                return filter;
            });
            console.log(categoryKeyFromNavbar)
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
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 20) return;
            loadMoreItems(); // Load more items when the user scrolls to the bottom
        };

        // Add the event listener
        window.addEventListener('scroll', handleScroll);
    
        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastItemIndex]); // Dependency on lastItemIndex ensures the effect runs again when items are added
    

    // useEffect(() => {
    //     console.log('SETTING IT FROM HERE')
    //     // Temporary check to see if manually setting visibleItems works
    //     setVisibleItems(allItems.filter(x=>x.live==='y').slice(0, ITEMS_PER_PAGE));
    // }, [allItems]);

    // const calculateListHeight = () => {
    //     if (type === 'sale') {
    //         return allItems.filter(x => x.live === 'y').length * 509
    //     }
    //     else if (type === 'favourites') {
    //         return allItems.filter(x => x.live === 'y').length * 509
    //     }
    // }

    // function ListRow({ index, style, data }) {
    //     if (!data) {
    //         console.error('Data is undefined in Row component');
    //         return null; // Or render a fallback UI
    //     }
    //     // console.log('Row data:', data);
    //     const { items, type, favouriteItems, handleFavouriteItemToggle, handleLiveToggle, onItemDeleted, shareItemViaWhatsApp } = data;
    //     const item = items[index];

    //     // Determine whether to include share or live toggle functions based on the item type
    //     const extraProps = type === 'sale' || type === 'favourites' ? { shareItemViaWhatsApp } : { handleLiveToggle, onItemDeleted };

    //     return (
    //         <div style={{
    //             ...style,
    //             display: 'flex',
    //             flexDirection: 'column',
    //         }}
    //             id={item._id}>
    //             <ItemCard
    //                 key={item._id}
    //                 item={item}
    //                 favouriteItems={favouriteItems}
    //                 handleFavouriteItemToggle={handleFavouriteItemToggle}
    //                 type={type}
    //                 {...extraProps}
    //             />
    //         </div>
    //     );
    // }


    if (localStorage.getItem('userEmail') === null) {
        return (
            <ErrorAuthPage />
        )
    }
    else {
        return (
            <PullToRefresh onRefresh={fetchAllItems}
                pullingContent={''}
                maxPullDownDistance={80}
                pullDownThreshold={60}
            >

                <Grid.Container>

                    {/* {console.log(visibleItems)} */}
                    <Grid.Container css={{
                        padding: '4px 4px',
                        jc: 'center'
                    }}>
                        {type === 'sale' &&
                            <Text css={{
                                fontWeight: '$semibold',
                                '@xsMin': {
                                    fontSize: '$3xl',
                                    padding: '1% 2%'
                                },
                                '@xsMax': {
                                    fontSize: '$2xl',
                                    padding: '4%'
                                },
                                width: 'max-content'
                            }}>
                                All Items On Sale
                            </Text>
                        }
                        {type === 'user' &&
                            <Text css={{
                                fontWeight: '$semibold',
                                '@xsMin': {
                                    fontSize: '$3xl',
                                    padding: '1% 2%'
                                },
                                '@xsMax': {
                                    fontSize: '$2xl',
                                    padding: '4%'
                                },
                                width: 'max-content'
                            }}>
                                {localStorage.getItem('userName').split(" ")[0]}'s Sale Items
                            </Text>
                        }
                        {type === 'favourites' &&
                            <Text css={{
                                fontWeight: '$semibold',
                                '@xsMin': {
                                    fontSize: '$3xl',
                                    padding: '1% 2%'
                                },
                                '@xsMax': {
                                    fontSize: '$2xl',
                                    padding: '4%'
                                },
                                width: 'max-content'
                            }}>
                                {localStorage.getItem('userName').split(" ")[0]}'s Favourites
                            </Text>
                        }
                        <Row css={{
                            '@xsMin': {
                                padding: '0% 2% 1% 2%'
                            },
                            '@xsMax': {
                                padding: '0% 4% 1% 4%'
                            },
                            alignItems: 'center',
                            gap: 10,
                            jc: 'center'
                        }}>
                            <Input clearable placeholder="Corset / Cargos / Necklace" width="280px" css={{ margin: '0px 0px 8px 0px' }}
                                initialValue=""
                                labelLeft={<IoSearchSharp size={'20px'} color={""} />}
                                animated={false}
                                onChange={(e) => {
                                    window.setTimeout(() => {
                                        setFiltersApplied(prev => ({
                                            ...prev,
                                            searched: e.target.value
                                        }))
                                    }, 1500)
                                }}
                                className="items-search-input"
                            />
                        </Row>

                        <Grid.Container css={{
                            '@xsMin': {
                                padding: '0% 2% 1% 2%'
                            },
                            '@xsMax': {
                                padding: '0% 0% 1% 0%'
                            },
                            alignItems: 'center',
                            jc: 'center'
                        }}>
                            <Row css={{
                                alignItems: 'center',
                                gap: 4,
                                jc: 'center',
                            }}>
                                <IoIosArrowBack color="#7f7f7f" size={16} />
                                <div className="horizontal-scroller">
                                    {priceFilters.map((priceFilter) => (
                                        <Grid key={priceFilter.key} css={{
                                            margin: '4px 2px',
                                            '&:hover': {
                                                cursor: 'pointer'
                                            }
                                        }}>
                                            <Badge
                                                variant="flat"
                                                size={'md'}
                                                color={priceFilter.chosen ? "primary" : "default"}
                                                onClick={() => {
                                                    // Toggle the "chosen" property for the clicked filter
                                                    const updatedPriceFilters = priceFilters.map(filter => {
                                                        if (filter.key === priceFilter.key) {
                                                            return { ...filter, chosen: !filter.chosen };
                                                        }
                                                        return filter;
                                                    });
                                                    setPriceFilters(updatedPriceFilters);

                                                    // Update the filtersApplied state
                                                    setFiltersApplied(prevState => {
                                                        const isFilterApplied = prevState.price.includes(priceFilter.key);
                                                        const newPriceFilters = isFilterApplied
                                                            ? prevState.price.filter(k => k !== priceFilter.key) // Remove filter
                                                            : [...prevState.price, priceFilter.key]; // Add filter

                                                        return {
                                                            ...prevState,
                                                            price: newPriceFilters,
                                                        };
                                                    });
                                                }}
                                            >
                                                {priceFilter.value}
                                            </Badge>
                                        </Grid>
                                    ))}
                                </div>
                                <IoIosArrowForward color="#7f7f7f" size={16} />
                            </Row>
                        </Grid.Container>

                        <Grid.Container css={{
                            '@xsMin': {
                                padding: '0% 2% 2% 2%'
                            },
                            '@xsMax': {
                                padding: '0% 2% 5% 2%'
                            },
                            alignItems: 'center',
                            jc: 'center'
                        }}>
                            <Row css={{
                                alignItems: 'center',
                                gap: 4,
                                jc: 'center',
                            }}>
                                <IoIosArrowBack color="#7f7f7f" size={16} />
                                <div className="horizontal-scroller">
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
                                                color={categoryFilter.chosen ? categoryFilter.color : ""} // Use the filter's color if chosen
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
                                <IoIosArrowForward color="#7f7f7f" size={16} />
                            </Row>

                        </Grid.Container>

                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={backdropLoaderOpen}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        {(fetchingAllItems || backdropLoaderOpen) &&
                            <>
                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '330px',
                                    margin: '24px 24px'
                                }}>
                                    <Row css={{
                                        alignItems: 'center',
                                        padding: '4px 4px 12px 4px',
                                        jc: 'space-between'
                                    }}>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content',
                                            gap: 10
                                        }}>
                                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                            <Col css={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                jc: 'center',
                                                gap: 4,
                                                width: 'max-content'
                                            }}>
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                            </Col>
                                        </Row>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content'
                                        }}>
                                            <Skeleton animation="wave" variant="rounded" width={60} height={20} />
                                        </Row>
                                    </Row>
                                    <Skeleton animation="wave" variant="rounded" width={330} height={300} />
                                    <Row css={{
                                        alignItems: 'center',
                                        paddingTop: '12px',
                                        gap: 10
                                    }}>
                                        <Skeleton animation="wave" variant="rounded" width={120} height={10} />
                                        <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                    </Row>
                                </Col>

                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '330px',
                                    margin: '24px 24px'
                                }}>
                                    <Row css={{
                                        alignItems: 'center',
                                        padding: '4px 4px 12px 4px',
                                        jc: 'space-between'
                                    }}>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content',
                                            gap: 10
                                        }}>
                                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                            <Col css={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                jc: 'center',
                                                gap: 4,
                                                width: 'max-content'
                                            }}>
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                            </Col>
                                        </Row>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content'
                                        }}>
                                            <Skeleton animation="wave" variant="rounded" width={60} height={20} />
                                        </Row>
                                    </Row>
                                    <Skeleton animation="wave" variant="rounded" width={330} height={300} />
                                    <Row css={{
                                        alignItems: 'center',
                                        paddingTop: '12px',
                                        gap: 10
                                    }}>
                                        <Skeleton animation="wave" variant="rounded" width={120} height={10} />
                                        <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                    </Row>
                                </Col>

                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '330px',
                                    margin: '24px 24px'
                                }}>
                                    <Row css={{
                                        alignItems: 'center',
                                        padding: '4px 4px 12px 4px',
                                        jc: 'space-between'
                                    }}>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content',
                                            gap: 10
                                        }}>
                                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                            <Col css={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                jc: 'center',
                                                gap: 4,
                                                width: 'max-content'
                                            }}>
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                            </Col>
                                        </Row>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content'
                                        }}>
                                            <Skeleton animation="wave" variant="rounded" width={60} height={20} />
                                        </Row>
                                    </Row>
                                    <Skeleton animation="wave" variant="rounded" width={330} height={300} />
                                    <Row css={{
                                        alignItems: 'center',
                                        paddingTop: '12px',
                                        gap: 10
                                    }}>
                                        <Skeleton animation="wave" variant="rounded" width={120} height={10} />
                                        <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                    </Row>
                                </Col>

                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '330px',
                                    margin: '24px 24px'
                                }}>
                                    <Row css={{
                                        alignItems: 'center',
                                        padding: '4px 4px 12px 4px',
                                        jc: 'space-between'
                                    }}>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content',
                                            gap: 10
                                        }}>
                                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                            <Col css={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                jc: 'center',
                                                gap: 4,
                                                width: 'max-content'
                                            }}>
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                            </Col>
                                        </Row>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content'
                                        }}>
                                            <Skeleton animation="wave" variant="rounded" width={60} height={20} />
                                        </Row>
                                    </Row>
                                    <Skeleton animation="wave" variant="rounded" width={330} height={300} />
                                    <Row css={{
                                        alignItems: 'center',
                                        paddingTop: '12px',
                                        gap: 10
                                    }}>
                                        <Skeleton animation="wave" variant="rounded" width={120} height={10} />
                                        <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                    </Row>
                                </Col>

                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '330px',
                                    margin: '24px 24px'
                                }}>
                                    <Row css={{
                                        alignItems: 'center',
                                        padding: '4px 4px 12px 4px',
                                        jc: 'space-between'
                                    }}>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content',
                                            gap: 10
                                        }}>
                                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                            <Col css={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                jc: 'center',
                                                gap: 4,
                                                width: 'max-content'
                                            }}>
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                            </Col>
                                        </Row>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content'
                                        }}>
                                            <Skeleton animation="wave" variant="rounded" width={60} height={20} />
                                        </Row>
                                    </Row>
                                    <Skeleton animation="wave" variant="rounded" width={330} height={300} />
                                    <Row css={{
                                        alignItems: 'center',
                                        paddingTop: '12px',
                                        gap: 10
                                    }}>
                                        <Skeleton animation="wave" variant="rounded" width={120} height={10} />
                                        <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                    </Row>
                                </Col>

                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '330px',
                                    margin: '24px 24px'
                                }}>
                                    <Row css={{
                                        alignItems: 'center',
                                        padding: '4px 4px 12px 4px',
                                        jc: 'space-between'
                                    }}>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content',
                                            gap: 10
                                        }}>
                                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                            <Col css={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                jc: 'center',
                                                gap: 4,
                                                width: 'max-content'
                                            }}>
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                                <Skeleton animation="wave" variant="rounded" width={80} height={5} />
                                            </Col>
                                        </Row>
                                        <Row css={{
                                            alignItems: 'center',
                                            width: 'max-content'
                                        }}>
                                            <Skeleton animation="wave" variant="rounded" width={60} height={20} />
                                        </Row>
                                    </Row>
                                    <Skeleton animation="wave" variant="rounded" width={330} height={300} />
                                    <Row css={{
                                        alignItems: 'center',
                                        paddingTop: '12px',
                                        gap: 10
                                    }}>
                                        <Skeleton animation="wave" variant="rounded" width={120} height={10} />
                                        <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                    </Row>
                                </Col>
                            </>
                        }

                        {!fetchingAllItems && !backdropLoaderOpen &&
                            <>
                                {
                                    visibleItems.map((item, index) => (
                                        <div key={item._id} id={item._id}>
                                            {/* Integrate the ItemCard component with the necessary props */}
                                            <ItemCard
                                                item={item}
                                                favouriteItems={favouriteItems}
                                                handleFavouriteItemToggle={handleFavouriteItemToggle}
                                                type={type}
                                                handleLiveToggle={type !== 'sale' && type !== 'favourites' ? handleLiveToggle : undefined}
                                                onItemDeleted={type !== 'sale' && type !== 'favourites' ? onItemDeleted : undefined}
                                                shareItemViaWhatsApp={type === 'sale' || type === 'favourites' ? shareItemViaWhatsApp : undefined}
                                            />
                                        </div>
                                    ))
                                }
                            </>
                        }


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

            </PullToRefresh>
        )
    }
}