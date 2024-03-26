import React from "react";
import { Badge, Col, Grid, Avatar, Text, Image, Row, Collapse } from "@nextui-org/react";
import './itemCard.css'
import { IoLogoWhatsapp } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";



export default function ItemCard(props) {
    const item = props.item
    const URL = 'https://wa.me'
    let number = item.contactNumber.replace(/[^\w\s]/gi, '').replace(/ /g, '')
    let message = `Hi, this is regarding the ${item.itemName} you put on the UniSwap™ website priced at ${item.itemPrice}...`
    let url = `${URL}/${number}?text=${encodeURI(message)}`;
    let favouriteItems = props.favouriteItems
    // console.log(item.id, favouriteItems, favouriteItems.includes(item.id))

    const categoryColors = {
        apparel: 'error', // Assuming NextUI's color system
        food: 'secondary', // Adjust color names as per NextUI's color system
        tickets: 'primary',
        stationery: 'success',
        jewellry: 'warning',
        lostandfound: 'neutral', // Assuming 'default' is akin to grey in NextUI
    };

    // Default to some color if item.category is not found in the mapping
    const badgeColor = categoryColors[item.itemCategory] || 'default';

    return (
        <Grid css={{
            margin: '24px 12px'
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
                            {/* Here, you'd calculate the post time based on "dateAdded" */}
                        </Text>
                    </Row>
                    <Badge variant="flat" size={'lg'} color={badgeColor}>
                        {item.itemCategory.charAt(0).toUpperCase() + item.itemCategory.slice(1)}
                    </Badge>
                </Row>
                <Image src={item.itemPicture}
                    css={{
                        height: '300px',
                        width: '330px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    }} />
                <Collapse css={{
                    width: '330px'
                }}
                    divider={false}
                    title={
                        <Row css={{
                            alignItems: 'center',
                            jc: 'start'
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
                                lineHeight: '1.15'
                            }}>
                                {item.itemName}
                            </Text>
                            <Badge variant="flat" size={'lg'} color={"primary"}>
                                ₹ {item.itemPrice}
                            </Badge>
                        </Row>
                    }
                // arrowIcon={<PriceComponent price={item.itemPrice}/>}
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
                    }}>
                        {item.itemDescription}
                    </Text>
                    <Row css={{
                        padding: '8px 8px 0px 8px',
                        gap: 6,
                        alignItems: 'center'
                    }}>
                        <IoLogoWhatsapp size={'24px'} color={"#25D366"} onClick={() => {
                            window.open(url)
                        }} className="item-icon"/>
                        {favouriteItems.includes(item.id) ?
                            <IoMdHeart size={24} style={{
                                borderRadius: '12px',
                                color: 'red'
                            }} className="item-icon"/>
                            :
                            <IoMdHeart size={24} style={{
                                borderRadius: '12px',
                                // color: 'white',
                                // borderWidth: '1px',
                                // borderStyle: 'solid',
                                // borderColor: 'black'
                            }} className="item-icon"/>
                        }
                    </Row>
                </Collapse>
            </Col>
        </Grid>
    );
}
