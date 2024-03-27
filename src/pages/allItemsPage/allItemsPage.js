import React, { useEffect, useState } from "react";
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Button, Col, Grid, Input, Text, Row } from "@nextui-org/react";
import { IoFilter } from "react-icons/io5";
import ItemCard from "../../components/items/itemCard";
import Pic1 from '../../assets/Amul.jpeg'
import Pic2 from '../../assets/ChaiShai.jpeg'
import Pic3 from '../../assets/ChicagoPizzaOrder.jpeg'
import Pic4 from '../../assets/Dhaba.jpeg'
import Pic5 from '../../assets/FuelZone.jpeg'
import Pic6 from '../../assets/HomeImage.jpg'
import Skeleton from '@mui/material/Skeleton';

export default function AllItemsPage() {
    const [fetchingAllItems, setFetchingAllItems] = useState(true)
    const [searchedItem, setSearchedItem] = useState('')
    const [render, setRender] = useState(false)
    // const[allItems, setAllItems] = useState()
    const allItems = [
        {
            id: 1,
            userName: 'Aryan Yadav',
            userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
            userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
            itemName: 'Corsette',
            itemDescription: 'Corsette my girlfriend has bought but is not allowed to wear.',
            itemPrice: 250,
            itemCategory: 'apparel',
            itemPicture: Pic1,
            contactNumber: "+918104213125",
            live: 'y',
            dateAdded: 'date'
        },
        {
            id: 2,
            userName: 'Aryan Yadav',
            userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
            userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
            itemName: 'Cargo Pants',
            itemDescription: "My roommate's cargos I stole and am now selling",
            itemPrice: 450,
            itemCategory: 'apparel',
            itemPicture: Pic2,
            contactNumber: "+918104213125",
            live: 'y',
            dateAdded: 'date'
        },
        {
            id: 3,
            userName: 'Aryan Yadav',
            userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
            userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
            itemName: 'Apple',
            itemDescription: 'Apple I bought today but did not have',
            itemPrice: 30,
            itemCategory: 'food',
            itemPicture: Pic3,
            contactNumber: "+918104213125",
            live: 'y',
            dateAdded: 'date'
        },
        {
            id: 4,
            userName: 'Aryan Yadav',
            userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
            userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
            itemName: 'Shuttle Ticket',
            itemDescription: 'Shuttle Ticket for thursday 10:00 am',
            itemPrice: 0,
            itemCategory: 'tickets',
            itemPicture: Pic4,
            contactNumber: "+918104213125",
            live: 'y',
            dateAdded: 'date'
        },
        {
            id: 5,
            userName: 'Aryan Yadav',
            userEmail: 'aryan.yadav_asp24@ashoka.edu.in',
            userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
            itemName: 'Necklace',
            itemDescription: 'Necklace I boguth for my girlfriend but she refuses to wear it.',
            itemPrice: 80,
            itemCategory: 'jewellry',
            itemPicture: Pic5,
            contactNumber: "+918104213125",
            live: 'y',
            dateAdded: 'date'
        },
        {
            id: 6,
            userName: 'Zahaan Shapoorjee',
            userEmail: 'zahaan.shapoorjee_ug24@ashoka.edu.in',
            userPicture: "https://lh3.googleusercontent.com/a/ACg8ocJWo5t5Y6Xzht9M2-NIejpohhPrYmvxc-hkP8kijHUzBQ=s96-c",
            itemName: 'Keyboard',
            itemDescription: 'My old keyboard I have played countless valorant games on',
            itemPrice: 350,
            itemCategory: 'miscellaneous',
            itemPicture: Pic6,
            contactNumber: "+918104213125",
            live: 'y',
            dateAdded: 'date'
        },
    ]

    // this is fetched from the users DB (favouriteItems: array of (ObjectID()))
    let tempFavouriteItems = JSON.parse(localStorage.getItem('favouriteItems'))
    const [favouriteItems, setFavouriteItems] = useState(tempFavouriteItems)

    const fetchAllItems = () => {
        console.log('Fetching')
    }

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
        if (updatedFavItems.includes(itemIDToUpdate)){
            updatedFavItems = updatedFavItems.filter(itemID => itemID !== itemIDToUpdate)
        }
        else{
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


    useEffect(()=>{
        console.log('Updated favourite items on allItemsPage')
    }, [favouriteItems])

    useEffect(() => {
        window.setTimeout(() => {
            // Fetch all items for sale
            fetchAllItems()
            setFetchingAllItems(false)
        }, 2000)
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
                    <Row css={{
                        '@xsMin': {
                            padding: '0.5% 2% 2% 2%'
                        },
                        '@xsMax': {
                            padding: '1% 4% 5% 4%'
                        },
                        alignItems: 'center',
                        gap: 10,
                        jc: 'center'
                    }}>
                        <IoFilter />
                        <Input
                            clearable
                            underlined
                            placeholder="Corsette / Pants ..."
                            css={{
                                width: '280px'
                            }}
                        />
                    </Row>
                    {fetchingAllItems &&
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
                    {!fetchingAllItems && favouriteItems &&
                        <>
                            {allItems.map((item, index) => (
                                <ItemCard key={index} item={item} favouriteItems={favouriteItems} handleFavouriteItemToggle={handleFavouriteItemToggle}/>
                            ))}
                        </>
                    }
                </Grid.Container>
            </Grid.Container>
        )
    }
}