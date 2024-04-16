import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setUserItems } from '../../slices/userItemsSlice';
import { useNavigate } from 'react-router-dom';
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Col, Grid, Input, Text, Row, Badge, Avatar, useTheme, Button } from "@nextui-org/react";
import ItemCard from "../../components/items/itemCard";
import Skeleton from '@mui/material/Skeleton';
import { IoSearchSharp } from "react-icons/io5";
import './userItemsPage.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import PullToRefresh from 'react-simple-pull-to-refresh';
import ColorThief from 'colorthief';
import { FaChevronLeft } from "react-icons/fa";
import FlatList from 'flatlist-react';

export default function UserItemsPage() {

    const backend = process.env.REACT_APP_BACKEND
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userItems = useSelector(state => state.userItems);
    const [filteredItems, setFilteredItems] = useState(userItems);
    const [filtersApplied, setFiltersApplied] = useState({
        price: [],
        category: [],
        searched: ''
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


    const [priceFilters, setPriceFilters] = useState([
        { key: '1', value: '₹0-₹100', chosen: false },
        { key: '2', value: '₹100-₹500', chosen: false },
        { key: '3', value: '₹500-₹1000', chosen: false },
        { key: '4', value: '₹1000-₹2000', chosen: false },
        { key: '5', value: '₹2000+', chosen: false }
    ]);

    const [categoryFilters, setCategoryFilters] = useState([
        { key: 'apparel', value: 'Apparel', color: "error", chosen: false }, // Vibrant Pink
        { key: 'electronics', value: 'Electronics', color: "primary", chosen: false }, // Indigo
        { key: 'decor', value: 'Decor', color: "success", chosen: false }, // Yellow
        { key: 'food', value: 'Food', color: "warning", chosen: false }, // Orange
        { key: 'makeup', value: 'Makeup', color: "secondary", chosen: false }, // Vibrant Pink
        { key: 'stationery', value: 'Stationery', color: "primary", chosen: false }, // Green
        { key: 'jewellery', value: 'Jewellery', color: "warning", chosen: false }, // Yellow
        { key: 'lost&found', value: 'Lost & Found', color: "default", chosen: false }, // Grey
        { key: 'miscellaneous', value: 'Miscellaneous', color: "default", chosen: false }, // Cyan
    ]);

    useEffect(() => {
        verifyUserSession()

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
                fetchAllItems(data.user.userEmail)
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
        let result = userItems;

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

    const theme = useTheme()

    const renderItem = (item, index) => {
        return (
            <div key={item._id} id={item._id}>
                <ItemCard
                    item={item}
                    type={"user"}
                    handleLiveToggle={handleLiveToggle}
                    onItemDeleted={onItemDeleted}
                />
            </div>
        )
    }

    return (
        <PullToRefresh onRefresh={() => fetchAllItems(localStorage.getItem('userEmail'))}
            pullingContent={''}
            maxPullDownDistance={80}
            pullDownThreshold={60}
            aria-label='pulltorefresh'
        >

            {/* <>
                {bgColor.length > 0 &&
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderColor: '#0c0c0c',
                        marginBottom: '40px'
                    }}>
                        <img
                            width={'100%'}
                            height={60}
                            style={{
                                background: `linear-gradient(to bottom, ${bgColor}, ${theme.theme.colors.background.value})`,
                                // backgroundColor: bgColor,
                                filter: 'blur(40px)'
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '20px',
                            }}
                        >
                            <img
                                // src={`https://api.multiavatar.com/${'ravina'}.png?apikey=Bvjs0QyHcCxZNe`}
                                src={`https://api.multiavatar.com/${localStorage.getItem('userName')}.png?apikey=Bvjs0QyHcCxZNe`}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 40,
                                }}
                                onLoad={() => {
                                    setTopImageLoading(false)
                                }}
                            />
                        </div>
                    </Col>
                }
            </> */}

            <Grid.Container>
                {/* {!topImageLoading && */}
                    <Grid.Container css={{
                        padding: '4px 4px',
                        jc: 'center',
                        marginBottom: '100px'
                    }}>
                        {/* <Text css={{
                        fontWeight: '$medium',
                        '@xsMin': {
                            fontSize: '$3xl',
                            padding: '1% 2%'
                        },
                        '@xsMax': {
                            fontSize: '$xl',
                            padding: '2%'
                        },
                        width: 'max-content'
                    }}>
                        {localStorage.getItem('userName').split(" ")[0]}'s Sale Items
                    </Text> */}
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

                        {!fetchingAllItems && !backdropLoaderOpen && filteredItems.length>0 &&
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
                                    No items uploaded...
                                </Text>

                                <Button auto flat color={'secondary'} onClick={() => {
                                    navigate('/createsale')
                                }}>
                                    Create A Sale →
                                </Button>

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