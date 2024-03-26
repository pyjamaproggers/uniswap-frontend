import React, { useEffect, useState } from "react";
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown } from "@nextui-org/react";
import { GiClothes } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { GiJewelCrown } from "react-icons/gi";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineQuestionMark } from "react-icons/md";
import './createSalePage.css'

export default function CreateSalePage() {

    const [item, setItem] = useState({
        userName: localStorage.getItem('userName'),
        userEmail: localStorage.getItem('userEmail'),
        userPicture: localStorage.getItem('userPicture'),
        itemName: '',
        itemDescription: '',
        itemPrice: 0,
        itemCategory: '',
        itemPicture: '', //this has to be the url we obtain by uploading the user-uploaded picture to aws bucket
        contactNumber: "",
        live: 'y',
        dateAdded: '' //today's date
    })

    const categoryItems = [
        { key: 'apparel', value: 'Apparel', icon: <GiClothes size={24} color="#F31260" />, description: 'Tees, Shirts, Corsettes, Shorts, Cargos, Dresses, Footwear and more.' }, // Vibrant Pink
        { key: 'food', value: 'Food', icon: <IoFastFoodSharp size={24} color="#7828C8" />, description: 'Fruits, Ramen, Masalas and more.' }, // Orange
        { key: 'tickets', value: 'Tickets', icon: <IoTicket size={24} color="#0072F5" />, description: 'Concert, Show, Shuttle and more.' }, // Indigo
        { key: 'stationery', value: 'Stationery', icon: <FaFilePen size={24} color="#17C964" />, description: 'Pens, Pencils, Erasers, Sharpeners, Notebooks, Highlighters and more.' }, // Green
        { key: 'jewellry', value: 'Jewellry', icon: <GiJewelCrown size={24} color="#F5A524" />, description: 'Necklaces, Earrings, Nose Rings and more.' }, // Yellow
        { key: 'lostandfound', value: 'Lost & Found', icon: <MdOutlineQuestionMark size={24} color="#889096" />, description: 'Anything and everything lost around campus.' }, // Grey
        { key: 'miscellaneous', value: 'Miscellaneous', icon: <MdMiscellaneousServices size={24} color="#0c0c0c" />, description: "Anything and everything that doesn't fall into the above categories" }, // Cyan
    ]

    if (localStorage.getItem('userEmail') === null) {
        return (
            <ErrorAuthPage />
        )
    }
    else {
        return (
            <Grid.Container css={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 12px 24px',
                jc: 'center',
                alignItems: 'center'
            }}>
                <Text css={{
                    '@xsMin': {
                        fontSize: '$2xl'
                    },
                    '@xsMax': {
                        fontSize: '$xl'
                    },
                    fontWeight: '$semibold',
                    marginBottom: '12px'
                }}>
                    Create Post
                </Text>
                <Input clearable label="Title" placeholder="Max. 40 characters" width="300px" css={{ margin: '24px 0px' }}
                    initialValue=""
                    helperText="Max. 40 characters" />
                <Textarea
                    label="Description"
                    placeholder="max. 200 characters"
                    width="300px"
                    helperText="Max. 200 characters"
                    css={{ margin: '24px 0px' }}
                />
                <Input clearable label="Price" placeholder="400" width="300px" css={{ margin: '24px 0px' }}
                    initialValue=""
                    labelLeft="₹"
                    helperText="What are you listing this item at?"
                />
                {/* <Dropdown isBordered>
                    <Dropdown.Menu
                        aria-label="Items Category"
                        selectionMode="single"
                        // selectedKeys={selected}
                        css={{
                            $$dropdownMenuWidth: "340px",
                            $$dropdownItemHeight: "70px",
                            "& .nextui-dropdown-item": {
                                py: "$4",
                                // dropdown item left icon
                                // dropdown item title
                                "& .nextui-dropdown-item-content": {
                                    w: "100%",
                                    fontWeight: "$semibold",
                                },
                            },
                        }}
                    >
                        {categoryItems.map((category, index) => (
                            <Dropdown.Item
                                key={category.key}
                                icon={category.icon}
                            >
                                <Text href={category.key} css={{
                                    fontWeight: '$semibold'
                                }}>
                                    {category.value}
                                </Text>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown> */}
                <Grid css={{
                    margin: '12px'
                }}>
                    <Dropdown isBordered>
                        <Dropdown.Button default light>Category</Dropdown.Button>
                        <Dropdown.Menu aria-label="Items Category"
                            selectionMode="single"
                            css={{
                                $$dropdownMenuWidth: "270px",
                                $$dropdownItemHeight: "60px",
                                "& .nextui-dropdown-item": {
                                    py: "$2",
                                    // dropdown item left icon
                                    svg: {
                                        color: "$secondary",
                                        mr: "$2",
                                    },
                                    // dropdown item title
                                    "& .nextui-dropdown-item-content": {
                                        w: "100%",
                                        fontWeight: "$semibold",
                                    },
                                },
                            }}>
                            {categoryItems.map((category, index) => (
                                <Dropdown.Item
                                    key={category.key}
                                    icon={category.icon}
                                >
                                    <Text css={{
                                        fontWeight: '$semibold'
                                    }}>
                                        {category.value}
                                    </Text>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Grid>
            </Grid.Container>
        )
    }
}