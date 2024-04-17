import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setUserItems } from '../../slices/userItemsSlice';
import { useNavigate } from 'react-router-dom';
import { Grid, Input, Text, Row, Badge, useTheme } from "@nextui-org/react";
import ItemCard from "../../components/items/itemCard";
import { IoSearchSharp } from "react-icons/io5";
import './servicesPage.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import PullToRefresh from 'react-simple-pull-to-refresh';
import FlatList from 'flatlist-react';
import ServiceCard from "../../components/services/serviceCard";

export default function ServicesPage() {

    const backend = process.env.REACT_APP_BACKEND
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userItems = useSelector(state => state.userItems);
    const [filteredItems, setFilteredItems] = useState([
        {
            
        }
    ]);
    const [filtersApplied, setFiltersApplied] = useState({
        price: [],
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

    const [priceFilters, setPriceFilters] = useState([
        { key: '1', value: '₹0-₹100', chosen: false },
        { key: '2', value: '₹100-₹500', chosen: false },
        { key: '3', value: '₹500-₹1000', chosen: false },
        { key: '4', value: '₹1000-₹2000', chosen: false },
        { key: '5', value: '₹2000+', chosen: false }
    ]);

    const [categoryFilters, setCategoryFilters] = useState([
        { key: 'web', value: 'Web', color: "error", chosen: false }, // Vibrant Pink
        { key: 'social media', value: 'Social Media', color: "secondary", chosen: false }, // Indigo
        { key: 'design', value: 'Design', color: "warning", chosen: false }, // Yellow
        { key: 'event planning', value: 'Event Planning', color: "primary", chosen: false }, // Yellow
        { key: 'food', value: 'Food', color: "warning", chosen: false }, // Yellow
        { key: 'homework', value: 'Homework', color: "success", chosen: false }, // Orange
        { key: 'laundry', value: 'Laundry', color: "primary", chosen: false }, // Orange
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

    const theme = useTheme()

    const renderItem = (service, index) => {
        return (
            <div key={service._id} id={service._id}>
                <ServiceCard 
                    service={service}
                    type={"live"}
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
                            <div className="horizontal-scroller-services">
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