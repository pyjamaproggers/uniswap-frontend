import React, { useEffect, useState } from "react";
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown, Image, Avatar } from "@nextui-org/react";
import { GiClothes } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { GiJewelCrown } from "react-icons/gi";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineQuestionMark } from "react-icons/md";
import './editSalePage.css'
import Grey from '../../assets/Grey.jpeg'
import { IoLogoWhatsapp } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function EditSalePage() {

    const location = useLocation()
    const backend = process.env.REACT_APP_BACKEND
    const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;
    const [item, setItem] = useState({ ...location.state })

    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    const [originalItemPicture, setOriginalItemPicture] = useState(item.itemPicture);

    const [itemsStatus, setItemsStatus] = useState({
        itemName: 'success',
        itemDescription: 'success',
        itemPrice: 'success',
        itemCategory: 'success',
        itemPicture: 'success',
        contactNumber: 'success'
    })

    const [imageFile, setImageFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const categoryItems = [
        { key: 'apparel', value: 'Apparel', icon: <GiClothes size={24} color="#F31260" />, description: 'Tees, Shirts, Corsettes, Shorts, Cargos, Dresses, Footwear and more.' }, // Vibrant Pink
        { key: 'food', value: 'Food', icon: <IoFastFoodSharp size={24} color="#7828C8" />, description: 'Fruits, Ramen, Masalas and more.' }, // Orange
        { key: 'tickets', value: 'Tickets', icon: <IoTicket size={24} color="#0072F5" />, description: 'Concert, Show, Shuttle and more.' }, // Indigo
        { key: 'stationery', value: 'Stationery', icon: <FaFilePen size={24} color="#17C964" />, description: 'Pens, Pencils, Erasers, Sharpeners, Notebooks, Highlighters and more.' }, // Green
        { key: 'jewellry', value: 'Jewellry', icon: <GiJewelCrown size={24} color="#F5A524" />, description: 'Necklaces, Earrings, Nose Rings and more.' }, // Yellow
        { key: 'lostandfound', value: 'Lost & Found', icon: <MdOutlineQuestionMark size={24} color="#889096" />, description: 'Anything and everything lost around campus.' }, // Grey
        { key: 'miscellaneous', value: 'Miscellaneous', icon: <MdMiscellaneousServices size={24} color="#0c0c0c" />, description: "Anything and everything that doesn't fall into the above categories" }, // Cyan
    ]

    const checkForm = () => {
        if (Object.values(itemsStatus).some(value => (value === 'default' || value === 'error'))) {
            setBackdropLoaderOpen(false)
            return false
        }
        else return true
    }
    const sendItem = async () => {
        setBackdropLoaderOpen(true)
        if (!checkForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        let imageUrl = originalItemPicture; // Default to the original picture URL

        if (imageFile) {
            try {
                // Obtain the pre-signed URL from your backend
                const uploadResponse = await fetch(`${backend}/api/upload`, { credentials: 'include' });
                const uploadData = await uploadResponse.json();
                const { url, key } = uploadData;

                // Upload the image to S3 using the pre-signed URL
                const putResponse = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'image/jpeg', // Adjust according to your image's MIME type
                    },
                    body: imageFile,
                });

                if (!putResponse.ok) throw new Error('Failed to upload image to S3.');

                // Construct the image URL from the response
                imageUrl = `https://${bucket}.s3.amazonaws.com/${key}`;

            } catch (error) {
                console.error('Image upload error:', error);
                return;
            }
        }

        // Update the item with the new details, including the new image URL if applicable
        try {
            const itemUpdateResponse = await fetch(`${backend}/api/items/${item._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, itemPicture: imageUrl }),
                credentials: 'include',
            });

            if (!itemUpdateResponse.ok) throw new Error('Failed to update item.');
            setBackdropLoaderOpen(false)
            console.log('Item updated successfully');
            toast.success('Item updated!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: "Flip",
            });
            window.setTimeout(() => {
                window.location.pathname = '/useritems'
            }, 2000)
            // Further actions on successful update, like redirecting or refreshing the item details
        } catch (error) {
            setBackdropLoaderOpen(false)
            console.error('Error updating item:', error);
            toast.error('Some error occured. Please try again.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: 'Flip',
            });
        }
    };



    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            // console.log(url)
            setPreviewUrl(url);

            // Cleanup function to revoke the object URL
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

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
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition="Flip"
                />
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backdropLoaderOpen}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Text css={{
                    '@xsMin': {
                        fontSize: '$2xl'
                    },
                    '@xsMax': {
                        fontSize: '$xl'
                    },
                    fontWeight: '$semibold',
                    marginBottom: '6px'
                }}>
                    Edit Your Sale
                </Text>
                <Text css={{
                    '@xsMin': {
                        fontSize: '$md'
                    },
                    '@xsMax': {
                        fontSize: '$sm'
                    },
                    fontWeight: '$medium',
                    marginBottom: '8px',
                    color: 'black',
                    padding: '0px 12px',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    marginTop: '12px'
                }}>
                    Picture
                </Text>
                <Avatar size={'lg'} src={localStorage.getItem('userPicture')} />
                <Input readOnly label="Name" width="300px" css={{ margin: '12px 0px 12px 0px' }}
                    initialValue={localStorage.getItem('userName')}
                    animated={false}
                    status="success"
                />
                <Input readOnly label="Email" width="300px" css={{ margin: '16px 0px 8px 0px' }}
                    initialValue={localStorage.getItem('userEmail')}
                    animated={false}
                    status="success"
                />
                <Input clearable label="Title" placeholder="Corsette / Cargo Pants / Necklace" width="300px" css={{ margin: '24px 0px' }}
                    initialValue={item.itemName}
                    helperText="Max. 40 characters"
                    animated={false}
                    status={itemsStatus.itemName}
                    onChange={(e) => {
                        if (e.target.value.length <= 40) {
                            setItemsStatus({
                                ...itemsStatus,
                                itemName: 'success'
                            })
                            setItem({
                                ...item,
                                itemName: e.target.value
                            })
                        }
                        else {
                            setItemsStatus({
                                ...itemsStatus,
                                itemName: 'error'
                            })
                            setItem({
                                ...item,
                                itemName: ''
                            })
                        }
                        if (e.target.value.length == 0) {
                            setItemsStatus({
                                ...itemsStatus,
                                itemName: 'default'
                            })
                        }
                    }} />
                <Textarea
                    label="Description"
                    placeholder="Color, size, age..."
                    width="300px"
                    helperText="Max. 200 characters"
                    css={{ margin: '24px 0px' }}
                    animated={false}
                    clearable
                    initialValue={item.itemDescription}
                    status={itemsStatus.itemDescription}
                    onChange={(e) => {
                        if (e.target.value.length <= 200) {
                            setItemsStatus({
                                ...itemsStatus,
                                itemDescription: 'success'
                            })
                            setItem({
                                ...item,
                                itemDescription: e.target.value
                            })
                        }
                        else {
                            setItemsStatus({
                                ...itemsStatus,
                                itemDescription: 'error'
                            })
                            setItem({
                                ...item,
                                itemDescription: ''
                            })
                        }
                        if (e.target.value.length == 0) {
                            setItemsStatus({
                                ...itemsStatus,
                                itemDescription: 'default'
                            })
                        }
                    }}
                />
                <Input clearable label="Price" placeholder="400" width="300px" css={{ margin: '24px 0px' }}
                    labelLeft="₹"
                    helperText="What are you listing this item at?"
                    animated={false}
                    status={itemsStatus.itemPrice}
                    initialValue={item.itemPrice}
                    onChange={(e) => {
                        if (e.target.value.length !== 0 && /^[0-9]+$/.test(e.target.value)) {
                            setItem({
                                ...item,
                                itemPrice: parseInt(e.target.value, 10)
                            })
                            setItemsStatus({
                                ...itemsStatus,
                                itemPrice: 'success'
                            })
                        }
                        else {
                            setItem({
                                ...item,
                                itemPrice: ''
                            })
                            setItemsStatus({
                                ...itemsStatus,
                                itemPrice: 'error'
                            })
                        }
                        if (e.target.value.length == 0) {
                            setItemsStatus({
                                ...itemsStatus,
                                itemPrice: 'default'
                            })
                        }
                    }}
                />
                <Input clearable label="Phone" placeholder="9876543210" width="300px" css={{ margin: '24px 0px' }}
                    initialValue={item.contactNumber}
                    labelLeft={<IoLogoWhatsapp size={'20px'} color={"#25D366"} />}
                    helperText="WhatsApp contact number!"
                    animated={false}
                    status={itemsStatus.contactNumber}
                    onChange={(e) => {
                        if (e.target.value.length !== 0 && /^\d{10}$/.test(e.target.value)) {
                            setItem({
                                ...item,
                                contactNumber: parseInt(e.target.value, 10)
                            })
                            setItemsStatus({
                                ...itemsStatus,
                                contactNumber: 'success'
                            })
                        }
                        else {
                            setItem({
                                ...item,
                                contactNumber: ''
                            })
                            setItemsStatus({
                                ...itemsStatus,
                                contactNumber: 'error'
                            })
                        }
                        if (e.target.value.length == 0) {
                            setItemsStatus({
                                ...itemsStatus,
                                contactNumber: 'default'
                            })
                        }
                    }}
                />
                <Grid css={{
                    margin: '16px 12px'
                }}>
                    <Dropdown isBordered>
                        <Dropdown.Button default flat color={itemsStatus.itemCategory}>
                            {item.itemCategory === '' ? 'Category' : item.itemCategory.charAt(0).toUpperCase() + item.itemCategory.slice(1)}
                        </Dropdown.Button>
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
                            }}
                            onSelectionChange={(selection) => {
                                setItem({
                                    ...item,
                                    itemCategory: selection.currentKey
                                })
                                setItemsStatus({
                                    ...itemsStatus,
                                    itemCategory: 'success'
                                })
                            }}
                        >
                            {categoryItems.map((category, index) => (
                                <Dropdown.Item
                                    key={category.key}
                                    icon={category.icon}
                                    showFullDescription={false}
                                    description={category.description}
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
                <Text css={{
                    '@xsMin': {
                        fontSize: '$lg'
                    },
                    '@xsMax': {
                        fontSize: '$sm'
                    },
                    fontWeight: '$regular',
                    marginBottom: '4px',
                    marginTop: '12px',
                    textAlign: 'left',
                    justifySelf: 'flex-start',
                    display: 'flex'
                }}>
                    Item Picture
                </Text>

                <div>
                    {previewUrl === null ?
                        <Image src={originalItemPicture} width={'300px'} height={'300px'} css={{
                            borderRadius: '8px',
                            opacity: '0.5',
                            objectFit: 'cover'
                        }} />
                        :
                        <Image src={previewUrl} width={'300px'} height={'300px'} css={{
                            borderRadius: '8px',
                            opacity: '1',
                            objectFit: 'cover'
                        }} />
                    }
                    <label className="custom-file-upload">
                        <input
                            onChange={(event) => {
                                if (event.target.files && event.target.files[0]) {
                                    if (event.target.files[0].size > 2200000) {
                                        window.alert('Maximum file size: 2mb!');
                                    } else {
                                        setImageFile(event.target.files[0]);
                                        setItemsStatus({
                                            ...itemsStatus,
                                            itemPicture: 'success'
                                        });
                                        console.log('Thank you for the correct image size');
                                    }
                                } else {
                                    setImageFile(null); // Reset state if no file is selected
                                    setPreviewUrl(null); // Also reset the preview URL
                                }
                            }}
                            className="photobtn" animated={'true'} type='file' accept="image/*" required />
                        {imageFile === null ?
                            "Upload Picture"
                            :
                            `${imageFile.name} uploaded`
                        }
                    </label>
                    {imageFile && (
                        <button onClick={() => {
                            setImageFile(null);
                            setPreviewUrl(originalItemPicture); // Revert to the original picture
                            setItemsStatus({
                                ...itemsStatus,
                                itemPicture: 'success'
                            });
                        }}>Revert to Original Picture</button>
                    )}
                </div>

                <Text css={{
                    '@xsMin': {
                        fontSize: '$sm'
                    },
                    '@xsMax': {
                        fontSize: '$sm'
                    },
                    fontWeight: '$regular',
                    marginBottom: '12px',
                    marginTop: '0px',
                    textAlign: 'left',
                    justifySelf: 'flex-start',
                    display: 'flex'
                }}>
                    Max: 2mb
                </Text>
                <Button auto flat css={{
                    marginTop: '24px'
                }}
                    onClick={() => {
                        if (checkForm()) {
                            sendItem()
                        }
                        else {
                            window.alert('You seem to have missed something')
                        }
                    }}>
                    <Row css={{
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <Text css={{
                            '@xsMin': {
                                fontSize: '$md'
                            },
                            '@xsMax': {
                                fontSize: '$sm'
                            },
                            fontWeight: '$regular',
                            color: '$blue600'
                        }}>
                            Upload
                        </Text>
                        <IoSendSharp size={16} />
                    </Row>
                </Button>
            </Grid.Container>
        )
    }
}