import React, { useEffect } from "react";
import { Badge, Col, Grid, Avatar, Text, Image, Row, Collapse, Button } from "@nextui-org/react";
import './itemCard.css'
import { IoLogoWhatsapp } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


export default function ItemCard(props) {

    const navigate = useNavigate()

    const item = props.item

    const [firstName, lastName] = item.userName.split(' ');

    const URL = 'https://wa.me'
    // let number = item.contactNumber.replace(/[^\w\s]/gi, '').replace(/ /g, '')
    let number = item.contactNumber

    let message = `Hi ${firstName}, this is regarding the ${item.itemName} you put on the UniSwap™ website priced at ${item.itemPrice}...`
    let url = `${URL}/${number}?text=${encodeURI(message)}`;

    let favouriteItems = props.favouriteItems
    let handleFavouriteItemToggle = props.handleFavouriteItemToggle
    // console.log(item.id, favouriteItems, favouriteItems.includes(item.id))
    // console.log(props)

    const handleFavouriteButtonClick = (favouriteItems, item) => {
        let itemIDToUpdate = item.id
        handleFavouriteItemToggle(favouriteItems, itemIDToUpdate)
    }

    function getTimeDifference(dateString) {
        const itemDate = new Date(dateString);
        const now = new Date();
        const differenceInSeconds = Math.floor((now - itemDate) / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        if (differenceInSeconds < 60) {
            return `${differenceInSeconds} seconds ago`;
        } else if (differenceInMinutes < 60) {
            return `${differenceInMinutes} minutes ago`;
        } else if (differenceInHours < 24) {
            return `${differenceInHours} hours ago`;
        } else if (differenceInDays < 7) {
            return `${differenceInDays} days ago`;
        } else {
            return formatDate(itemDate);
        }
    }

    function formatDate(date) {
        const day = date.getDate();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const ordinal = getOrdinalIndicator(day);

        return `${day}${ordinal} ${month}, ${year}`;
    }

    function getOrdinalIndicator(day) {
        if (day > 3 && day < 21) return 'th'; // For 4th to 20th
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    useEffect(() => {
        console.log('Updated favouriteItems in ItemCard component')
    }, [favouriteItems])

    const categoryColors = {
        apparel: 'error',
        food: 'secondary',
        tickets: 'primary',
        stationery: 'success',
        jewellry: 'warning',
        lostandfound: 'neutral',
    };

    const type = props.type

    // Default to some color if item.category is not found in the mapping
    const badgeColor = categoryColors[item.itemCategory] || 'default';

    return (
        <Grid css={{
            margin: '24px 24px'
        }}>
            <Col css={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Row css={{
                    alignItems: 'center',
                    padding: '0px 8px 12px 8px',
                    jc: 'space-between'
                }}>
                    <Row css={{
                        alignItems: 'center',
                        gap: 4,
                    }}>
                        <Avatar
                            color=""
                            size="md"
                            src={item.userPicture}
                        />
                        <Text css={{
                            display: 'inline-block', // Allows the use of maxW
                            maxW: '100px',
                            fontWeight: '$medium',
                            '@xsMin': {
                                fontSize: '$lg',
                            },
                            '@xsMax': {
                                fontSize: '$lg'
                            },
                        }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.15' }}>
                                {firstName}
                            </span>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.15' }}>
                                {lastName}
                            </span>
                        </Text>
                    </Row>
                    <Badge variant="flat" size={'lg'} color={badgeColor}>
                        {item.itemCategory.charAt(0).toUpperCase() + item.itemCategory.slice(1)}
                    </Badge>
                    <Badge variant="flat" size={'lg'} color={"primary"}>
                        ₹ {item.itemPrice}
                    </Badge>
                </Row>
                <Image src={item.itemPicture}
                    css={{
                        height: '300px',
                        // minWidth: '300px',
                        // maxW: '330px',
                        width: '320px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }} />
                <Collapse css={{
                    width: '330px',
                    borderStyle: 'solid',
                    borderColor: '$gray100',
                    borderWidth: '0px 0px 1px 0px'
                }}
                    expanded={type === 'user'}
                    divider={false}
                    title={
                        <Row css={{
                            alignItems: 'baseline',
                            jc: 'start',
                        }}>
                            <Col>

                                <Text css={{
                                    fontWeight: '$medium',
                                    '@xsMin': {
                                        fontSize: '$lg'
                                    },
                                    '@xsMax': {
                                        fontSize: '$md'
                                    },
                                    paddingRight: '4px',
                                    lineHeight: '1.25',
                                }}>
                                    {item.itemName}
                                </Text>

                            </Col>

                            {type === 'user' &&
                                <>
                                    {item.live === 'y' ?
                                        <>
                                            <Badge variant="flat" size={'lg'} color={'success'}>
                                                • Live
                                            </Badge>
                                        </>
                                        :
                                        <>
                                            <Badge variant="flat" size={'lg'} color={'error'}>
                                                • Not Live
                                            </Badge>
                                        </>
                                    }
                                </>
                            }
                        </Row>
                    }
                >
                    <Text css={{
                        fontWeight: '$regular',
                        '@xsMin': {
                            fontSize: '$base'
                        },
                        '@xsMax': {
                            fontSize: '$md'
                        },
                        padding: '0px 8px 4px 8px',
                        color: '$gray800'
                    }}>
                        {item.itemDescription}
                    </Text>
                    {type === 'sale' ?
                        <Row css={{
                            padding: '4px 8px 0px 8px',
                            gap: 6,
                            alignItems: 'center'
                        }}>
                            <Button auto flat color={'success'}
                            icon={<IoLogoWhatsapp size={'24px'} color={"#25D366"} onClick={() => {
                                window.open(url)
                            }} className="item-icon" />}
                            css={{
                                height: 'max-content',
                                padding: '0px 12px'
                            }}>
                                WhatsApp
                            </Button>
                            
                            {/* {favouriteItems.includes(item.id) ?
                                <IoMdHeart size={24} style={{
                                    borderRadius: '12px',
                                    color: 'red'
                                }} className="item-icon"
                                    onClick={() => {
                                        handleFavouriteButtonClick(favouriteItems, item)
                                    }} />
                                :
                                <IoMdHeart size={24} style={{
                                    borderRadius: '12px',
                                }} className="item-icon"
                                    onClick={() => {
                                        handleFavouriteButtonClick(favouriteItems, item)
                                    }} />
                            } */}
                        </Row>
                        :
                        <Row css={{
                            jc: 'flex-end',
                            alignItems: 'center',
                            gap: 6,
                            margin: '8px 0px 24px 0px'
                        }}>
                            <Button auto flat color={'primary'}
                                iconRight={<IoPencil size={16} />}
                                onClick={() => {
                                    navigate('/editsale', { state: item })
                                }}>
                                Edit
                            </Button>
                            <Button auto flat color={'error'}
                                iconRight={<MdDelete size={16} />}>
                                Delete
                            </Button>
                        </Row>
                    }
                </Collapse>
                <Text css={{
                    fontWeight: '$medium',
                    '@xsMin': {
                        fontSize: '$sm',
                    },
                    '@xsMax': {
                        fontSize: '$xs'
                    },
                    color: '$gray600',
                    paddingLeft: '8px'
                }}>
                    {getTimeDifference(item.dateAdded)}
                </Text>
            </Col>
        </Grid>
    );
}
