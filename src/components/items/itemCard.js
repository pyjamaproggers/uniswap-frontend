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

    const URL = 'https://wa.me'
    let number = item.contactNumber.replace(/[^\w\s]/gi, '').replace(/ /g, '')
    let message = `Hi, this is regarding the ${item.itemName} you put on the UniSwap™ website priced at ${item.itemPrice}...`
    let url = `${URL}/${number}?text=${encodeURI(message)}`;

    let favouriteItems = props.favouriteItems
    let handleFavouriteItemToggle = props.handleFavouriteItemToggle
    // console.log(item.id, favouriteItems, favouriteItems.includes(item.id))
    // console.log(props)

    const handleFavouriteButtonClick = (favouriteItems, item) => {
        let itemIDToUpdate = item.id
        handleFavouriteItemToggle(favouriteItems, itemIDToUpdate)
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
                            fontWeight: '$semibold',
                            '@xsMin': {
                                fontSize: '$lg',
                            },
                            '@xsMax': {
                                fontSize: '$lg'
                            },
                            maxW: '100px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {item.userName}
                        </Text>
                        <Text css={{
                            fontWeight: '$semibold',
                            '@xsMin': {
                                fontSize: '$base',
                            },
                            '@xsMax': {
                                fontSize: '$md'
                            },
                            color: '$gray600'
                        }}>
                            • 5m
                            {/* Here we need calculate the post time based on "dateAdded" variable of an item */}
                        </Text>
                    </Row>
                    <Badge variant="flat" size={'lg'} color={badgeColor}>
                        {item.itemCategory.charAt(0).toUpperCase() + item.itemCategory.slice(1)}
                    </Badge>
                </Row>
                <Image src={item.itemPicture}
                    css={{
                        height: '300px',
                        // minWidth: '300px',
                        // maxW: '330px',
                        width: '320px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    }} />
                <Collapse css={{
                    width: '330px'
                }}
                    expanded={type === 'user'}
                    divider={false}
                    title={
                        <Row css={{
                            alignItems: 'center',
                            jc: 'start',
                        }}>
                            <Text css={{
                                fontWeight: '$semibold',
                                '@xsMin': {
                                    fontSize: '$xl'
                                },
                                '@xsMax': {
                                    fontSize: '$xl'
                                },
                                paddingRight: '4px',
                                lineHeight: '1.15',
                            }}>
                                {item.itemName}
                            </Text>
                            <Badge variant="flat" size={'lg'} color={"primary"}>
                                ₹ {item.itemPrice}
                            </Badge>
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
                            fontSize: '$lg'
                        },
                        '@xsMax': {
                            fontSize: '$lg'
                        },
                        padding: '4px 8px',
                        lineHeight: '1.3',
                        borderStyle: 'solid',
                        borderColor: '$gray100',
                        borderWidth: '1px 0px'
                    }}>
                        {item.itemDescription}
                    </Text>
                    {type === 'sale' ?
                        <Row css={{
                            padding: '4px 8px 0px 8px',
                            gap: 6,
                            alignItems: 'center'
                        }}>
                            <IoLogoWhatsapp size={'24px'} color={"#25D366"} onClick={() => {
                                window.open(url)
                            }} className="item-icon" />
                            {favouriteItems.includes(item.id) ?
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
                            }
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
                            onClick={()=>{
                                navigate('/editsale', {state: item})
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
            </Col>
        </Grid>
    );
}
