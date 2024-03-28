import React, { useEffect, useState } from "react";
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Button, Col, Grid, Input, Text, Row, Badge } from "@nextui-org/react";
import { IoFilter } from "react-icons/io5";
import ItemCard from "../../components/items/itemCard";
import Pic1 from '../../assets/Amul.jpeg'
import Pic2 from '../../assets/ChaiShai.jpeg'
import Pic3 from '../../assets/ChicagoPizzaOrder.jpeg'
import Pic4 from '../../assets/Dhaba.jpeg'
import Pic5 from '../../assets/FuelZone.jpeg'
import Pic6 from '../../assets/HomeImage.jpg'
import Skeleton from '@mui/material/Skeleton';
import { IoSearchSharp } from "react-icons/io5";
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Chip from '@mui/material/Chip';
import './ItemsPage.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';


export default function ItemsPage(props) {

    const backend = process.env.REACT_APP_BACKEND
    const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;

    const type = props.type

    const [fetchingAllItems, setFetchingAllItems] = useState(true)
    const [render, setRender] = useState(false)

    const [filtersApplied, setFiltersApplied] = useState({
        price: [],
        category: [],
        searched: ''
    })

    const[allItems, setAllItems] = useState([])
    // const allItems = [
    //     {
    //         id: 1,
    //         userName: 'Aryan Yadav',
    //         userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
    //         userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
    //         itemName: 'Corset',
    //         itemDescription: 'Corset my girlfriend has bought but is not allowed to wear.',
    //         itemPrice: 250,
    //         itemCategory: 'apparel',
    //         itemPicture: Pic1,
    //         contactNumber: "+918104213125",
    //         live: 'y',
    //         dateAdded: 'date'
    //     },
    //     {
    //         id: 2,
    //         userName: 'Aryan Yadav',
    //         userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
    //         userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
    //         itemName: 'Cargo Pants',
    //         itemDescription: "My roommate's cargos I stole and am now selling",
    //         itemPrice: 450,
    //         itemCategory: 'apparel',
    //         itemPicture: Pic2,
    //         contactNumber: "+918104213125",
    //         live: 'y',
    //         dateAdded: 'date'
    //     },
    //     {
    //         id: 3,
    //         userName: 'Aryan Yadav',
    //         userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
    //         userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
    //         itemName: 'Apple',
    //         itemDescription: 'Apple I bought today but did not have',
    //         itemPrice: 30,
    //         itemCategory: 'food',
    //         itemPicture: Pic3,
    //         contactNumber: "+918104213125",
    //         live: 'y',
    //         dateAdded: 'date'
    //     },
    //     {
    //         id: 4,
    //         userName: 'Aryan Yadav',
    //         userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
    //         userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
    //         itemName: 'Shuttle Ticket',
    //         itemDescription: 'Shuttle Ticket for thursday 10:00 am',
    //         itemPrice: 0,
    //         itemCategory: 'tickets',
    //         itemPicture: Pic4,
    //         contactNumber: "+918104213125",
    //         live: 'n',
    //         dateAdded: 'date'
    //     },
    //     {
    //         id: 5,
    //         userName: 'Aryan Yadav',
    //         userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
    //         userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
    //         itemName: 'Necklace',
    //         itemDescription: 'Necklace I boguth for my girlfriend but she refuses to wear it.',
    //         itemPrice: 80,
    //         itemCategory: 'jewellry',
    //         itemPicture: Pic5,
    //         contactNumber: "+918104213125",
    //         live: 'y',
    //         dateAdded: 'date'
    //     },
    //     {
    //         id: 6,
    //         userName: 'Zahaan Shapoorjee',
    //         userEmail: 'zahaan.shapoorjee_ug24@ashoka.edu.in',
    //         userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
    //         itemName: 'Keyboard',
    //         itemDescription: 'My old keyboard I have played countless valorant games on',
    //         itemPrice: 350,
    //         itemCategory: 'miscellaneous',
    //         itemPicture: Pic6,
    //         contactNumber: "+918104213125",
    //         live: 'y',
    //         dateAdded: 'date'
    //     },
    // ]

    const [userItems, setUserItems] = useState([])

    const [filteredItems, setFilteredItems] = useState([...allItems]);

    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    // this is fetched from the users DB in header.js (favouriteItems: array of (ObjectID()))
    let tempFavouriteItems = JSON.parse(localStorage.getItem('favouriteItems'))
    const [favouriteItems, setFavouriteItems] = useState(tempFavouriteItems ? tempFavouriteItems : [])

    useEffect(()=>{
        if(!JSON.parse(localStorage.getItem('favouriteItems'))){
            localStorage.setItem('favouriteItems', JSON.stringify([]))
        }
    })

    const [priceFilters, setPriceFilters] = useState([
        { key: '1', value: '₹0-₹100', chosen: false },
        { key: '2', value: '₹100-₹500', chosen: false },
        { key: '3', value: '₹500-1000', chosen: false },
        { key: '4', value: '₹1000-₹2000', chosen: false },
        { key: '5', value: '₹2000+', chosen: false }
    ]);

    const [categoryFilters, setCategoryFilters] = useState([
        { key: 'apparel', value: 'Apparel', color: "error", chosen: false }, // Vibrant Pink
        { key: 'food', value: 'Food', color: "secondary", chosen: false }, // Orange
        { key: 'tickets', value: 'Tickets', color: "primary", chosen: false }, // Indigo
        { key: 'stationery', value: 'Stationery', color: "success", chosen: false }, // Green
        { key: 'jewellry', value: 'Jewellry', color: "warning", chosen: false }, // Yellow
        { key: 'lostandfound', value: 'Lost & Found', color: "default", chosen: false }, // Grey
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
            let result = type === 'sale' ? allItems : userItems;

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
            result.forEach(item=>{
                final.push(item)
            })

            
            setFilteredItems(final);
            console.log({favouriteItems})
            setBackdropLoaderOpen(false)
        }, 1000)
    }

    useEffect(() => {
        if (type === 'sale') {
            filterItems(type);
        }
        else {
            filterItems(type)
        }
    }, [filtersApplied]);

    const fetchAllItems = async () => {
        setFetchingAllItems(true); // Show loading state
        try {
            const response = await fetch(`${backend}/items`, {
                credentials: 'include', // to include cookies in the request (if your backend is set to send cookies)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const items = await response.json();
            console.log(items)
            setAllItems(items); // Update your state with the fetched items
            setFilteredItems(items); // Assuming you want to initially display all items
            setFetchingAllItems(false)
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setFetchingAllItems(false); // Hide loading state
        }
    };

    useEffect(() => {
        fetchAllItems();
    }, []);
    

    const sendNewFavouriteItemsToDB = (newFavouriteItems) => {
        console.log('New Favourite Items to save: ', newFavouriteItems)
        // post request to update user's "favouriteItems" data variable - replace old array with new array

    }

    const handleFavouriteItemToggle = (favouriteItems, itemIDToUpdate) => {
        // to toggle favourite iteam (like instagram "save" option)
        let updatedFavItems = favouriteItems
        // console.log('Function to handle when clicked on favourite: ', updatedFavItems, itemIDToUpdate)
        // console.log('ItemId clicked on: ', itemIDToUpdate)
        // console.log('Favourite Items array: ', updatedFavItems)
        // console.log(updatedFavItems.includes(itemIDToUpdate))
        if (updatedFavItems.includes(itemIDToUpdate)) {
            updatedFavItems = updatedFavItems.filter(itemID => itemID !== itemIDToUpdate)
        }
        else {
            updatedFavItems.push(itemIDToUpdate)
        }
        // console.log('Previous Favourite Items: ', favouriteItems)
        // console.log('New Favourite Items: ', updatedFavItems)
        setFavouriteItems(updatedFavItems)
        localStorage.setItem('favouriteItems', JSON.stringify(updatedFavItems))
        console.log(localStorage)
        sendNewFavouriteItemsToDB(updatedFavItems)
        setRender((prev) => (!prev))
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
        console.log('Updated favourite items on allItemsPage')
    }, [favouriteItems])

    useEffect(() => {
        window.setTimeout(() => {
            // Fetch all items for sale
            fetchAllItems()
            setFetchingAllItems(false)
        }, 2000)
    }, [])

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

    if (localStorage.getItem('userEmail') === null) {
        return (
            <ErrorAuthPage />
        )
    }
    else {
        return (
            <Grid.Container css={{
            }}>
                <Grid.Container css={{
                    padding: '4px 4px',
                    jc: 'center'
                }}>
                    {type === 'sale' ?
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
                        :
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
                            {localStorage.getItem('userName')}'s Items
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
                                setFiltersApplied(prev => ({
                                    ...prev,
                                    searched: e.target.value
                                }))
                            }}
                        />
                    </Row>

                    <Grid.Container css={{
                        '@xsMin': {
                            padding: '0% 2% 1% 2%'
                        },
                        '@xsMax': {
                            padding: '0% 2% 1% 2%'
                        },
                        alignItems: 'center',
                        jc: 'center'
                    }}>
                        <div className="horizontal-scroller">
                            {priceFilters.map((priceFilter) => (
                                <Grid key={priceFilter.key} css={{
                                    margin: '4px 2px',
                                    '&:hover': {
                                        cursor: 'pointer'
                                    }
                                }}> {/* Ensure key is here */}
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
                            {(filtersApplied.searched.length == 0 && filtersApplied.category.length == 0 && filtersApplied.price.length == 0) ? //filters applied or not
                                <>
                                    {/* If filters not applied then show allItems */}
                                    {type === 'sale' ?
                                        <>
                                            {allItems.map((item, index) => (
                                                <ItemCard key={index} item={item} favouriteItems={favouriteItems} handleFavouriteItemToggle={handleFavouriteItemToggle} type={type} />
                                            ))}
                                        </>
                                        :
                                        <>
                                            {userItems.map((item, index) => (
                                                <ItemCard key={index} item={item} favouriteItems={favouriteItems} handleFavouriteItemToggle={handleFavouriteItemToggle} type={type} />
                                            ))}
                                        </>
                                    }
                                </>
                                :
                                <>
                                    {filteredItems && filteredItems.length > 0 &&
                                        <>
                                            {/* If filters applied and there are filtered items */}
                                            {
                                            filteredItems.map((item, index) =>{
                                                console.log("whatsup") 
                                                return (
                                                <ItemCard key={index} item={item} favouriteItems={favouriteItems} handleFavouriteItemToggle={handleFavouriteItemToggle} type={type} />
                                            )})}
                                        </>
                                    }
                                    {filteredItems && filteredItems.length == 0 &&
                                        <>
                                            {/* If filters applied but no filtered items to show */}
                                            <Text css={{
                                                fontWeight: '$semibold',
                                                '@xsMax': {
                                                    fontSize: '$xl'
                                                },
                                                '@xsMin': {
                                                    fontSize: '$2xl'
                                                },
                                                padding: '48px 0px 50vh 0px'
                                            }}>
                                                No results to show...
                                            </Text>
                                        </>
                                    }
                                </>
                            }

                        </>
                    }
                </Grid.Container>
            </Grid.Container>
        )
    }
}