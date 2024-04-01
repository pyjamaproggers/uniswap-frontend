import React, { useEffect, useState } from "react";
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown, Image, Avatar, Link, Badge, Collapse, Modal } from "@nextui-org/react";
import { GiClothes } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { GiJewelCrown } from "react-icons/gi";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineQuestionMark } from "react-icons/md";
import Grey from '../../assets/Grey.jpeg'
import { IoLogoWhatsapp } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCloud } from "react-icons/fa6";
import { IoCloudOffline } from "react-icons/io5";
import imageCompression from 'browser-image-compression';


export default function InputItemCard(props) {

    const item = props.item
    const setItem = props.setItem
    const backend = process.env.REACT_APP_BACKEND
    const imageFile = props.imageFile
    const setImageFile = props.setImageFile

    const previewUrl = props.previewUrl
    const setPreviewUrl = props.setImageFile

    const type = props.type

    const [firstName, lastName] = item.userName.split(' ')

    const [number, setNumber] = useState('')
    const [phoneStatus, setPhoneStatus] = useState('default')
    const [showNumberUpdateModal, setShowNumberUpdateModal] = useState(false)

    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    const categoryColors = {
        apparel: 'error',
        food: 'secondary',
        tickets: 'primary',
        stationery: 'success',
        jewellry: 'warning',
        lostandfound: 'neutral',
    };

    // Default to some color if item.category is not found in the mapping
    const badgeColor = categoryColors[item.itemCategory] || 'neutral';

    const categoryItems = [
        { key: 'apparel', value: 'Apparel', icon: <GiClothes size={24} color="#F31260" />, description: 'Tees, Shirts, Corsettes, Shorts, Cargos, Dresses, Footwear and more.' }, // Vibrant Pink
        { key: 'food', value: 'Food', icon: <IoFastFoodSharp size={24} color="#7828C8" />, description: 'Fruits, Ramen, Masalas and more.' }, // Orange
        { key: 'tickets', value: 'Tickets', icon: <IoTicket size={24} color="#0072F5" />, description: 'Concert, Show, Shuttle and more.' }, // Indigo
        { key: 'stationery', value: 'Stationery', icon: <FaFilePen size={24} color="#17C964" />, description: 'Pens, Pencils, Erasers, Sharpeners, Notebooks, Highlighters and more.' }, // Green
        { key: 'jewellry', value: 'Jewellry', icon: <GiJewelCrown size={24} color="#F5A524" />, description: 'Necklaces, Earrings, Nose Rings and more.' }, // Yellow
        { key: 'lostandfound', value: 'Lost & Found', icon: <MdOutlineQuestionMark size={24} color="#889096" />, description: 'Anything and everything lost around campus.' }, // Grey
        { key: 'miscellaneous', value: 'Miscellaneous', icon: <MdMiscellaneousServices size={24} color="#0c0c0c" />, description: "Anything and everything that doesn't fall into the above categories" }, // Cyan
    ]

    const updateContactNumber = () => {
        const updatedPhoneNumber = number.trim();

        if (!updatedPhoneNumber) {
            console.error('No phone number provided');
            return;
        }

        setBackdropLoaderOpen(true);

        fetch(`${backend}/api/user/updatePhoneNumber`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ newPhoneNumber: updatedPhoneNumber }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating phone number');
                }
                return response.json();
            })
            .then(() => {
                console.log('Phone number updated successfully');
                // Update the item state with the new contact number
                setItem(prevItem => ({
                    ...prevItem,
                    contactNumber: updatedPhoneNumber
                }));
                setShowNumberUpdateModal(false);
                setBackdropLoaderOpen(false);
                toast.success('Number updated!', {
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
            })
            .catch(error => {
                console.error('Error updating phone number:', error);
                setBackdropLoaderOpen(false);
                toast.error('Failed to update phone number. Please try again.', {
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
            });
    };

    // const compressImage = async (originalImage) => {
    //     createPreviewURL(originalImage)
    //     console.log(originalImage.size / 1000 / 1000, 'MB (before compression)');
    //     console.log(originalImage)

    //     // Options for the compression
    //     const options = {
    //         maxSizeMB: 3, // The maximum size of the output file in MB
    //         maxWidthOrHeight: 1920, // The maximum width or height of the output image
    //         useWebWorker: true // Enable multi-threading for better performance on supported browsers
    //     };


    //     try {
    //         // Attempt to compress the image with the options
    //         const compressedBlob = await imageCompression(originalImage, options);
    //         console.log(compressedBlob.size / 1000 / 1000, 'MB (after compression)');

    //         // Convert the Blob to a File
    //         const compressedFile = new File([compressedBlob], originalImage.name, {
    //             type: compressedBlob.type,
    //             lastModified: Date.now(), // or use originalImage.lastModified if you want to preserve the original timestamp
    //         });
    //         console.log(compressedFile)
    //         return (compressedFile)
    //     } catch (error) {
    //         console.error('Error compressing the image:', error);
    //         throw error; // Rethrow the error for further handling
    //     }
    // };



    return (
        <Grid css={{
            margin: '24px 24px'
        }}>
            <Col css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Row css={{
                    alignItems: 'center',
                    padding: '0px 8px 4px 8px',
                    jc: 'space-between'
                }}>
                    <Row css={{
                        alignItems: 'center',
                        gap: 6,
                    }}>
                        <Avatar
                            color=""
                            size="md"
                            src={item.userPicture}
                            className="avatar"
                        />
                        <Text css={{
                            display: 'inline-block', // Allows the use of maxW
                            maxW: '100px',
                            fontWeight: '$medium',
                            '@xsMin': {
                                fontSize: '$lg',
                            },
                            '@xsMax': {
                                fontSize: '$sm'
                            },
                        }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.20' }}>
                                {firstName}
                            </span>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.20' }}>
                                {lastName}
                            </span>
                        </Text>
                    </Row>
                    <Dropdown isBordered size={'sm'}>
                        <Dropdown.Button flat color={badgeColor}
                            css={{
                                lineHeight: '1',
                                padding: '6px 12px',
                                height: 'max-content'
                            }}>
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
                    <div className="input-wrapper">
                        <span className="currency-icon">₹</span>
                        <input
                            required
                            className="sale-price-input"
                            placeholder="0"
                            maxLength={10}
                            value={item.itemPrice.toString()} // Convert to string for input value
                            onChange={(e) => {
                                // Directly update itemPrice with the new value, or fallback to 0 if not a number
                                const value = parseInt(e.target.value, 10);
                                setItem(prevItem => ({
                                    ...prevItem,
                                    itemPrice: isNaN(value) ? 0 : value
                                }));
                            }}
                        />

                    </div>

                </Row>

                <div style={{ position: 'relative', width: '330px', height: '300px' }}>
                    {previewUrl === null ?
                        <Image src={type === 'createSale' ? Grey : item.itemPicture} width={'330px'} height={'300px'} css={{
                            borderRadius: '4px',
                            opacity: type === 'createSale' ? '0.25' : '1',
                            objectFit: 'cover'
                        }} />
                        :
                        <Image src={previewUrl} width={'330px'} height={'300px'} css={{
                            borderRadius: '4px',
                            opacity: '1',
                            objectFit: 'cover'
                        }} />
                    }

                    <label className="custom-file-upload" style={{
                        position: 'absolute', // Position the label absolutely within the relative container
                        bottom: '10px', // Position towards the bottom of the image
                        left: '50%', // Center horizontally
                        transform: 'translateX(-50%)', // Adjust for true centering
                        fontSize: '12px',
                        maxWidth: '150px',
                        backgroundColor: '#cee4f3', // Optional: make label slightly opaque for better visibility
                        color: '#0072f5',
                        fontWeight: 500,
                        padding: '6px 12px', // Add some padding around the text
                        borderRadius: '12px', // Optional: round corners for the label
                        textAlign: 'center',
                        cursor: 'pointer', // Change cursor to pointer to indicate it's clickable
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        <input onChange={(event) => {
                            if (event.target.files && event.target.files[0]) {
                                // console.log(event.target.files[0].size/1000/1000)
                                // console.log(event.target.files[0])
                                if (event.target.files[0].size > (7 * 1000 * 1000)) {
                                    window.alert('Maximum file size: 7mb!');
                                } else {
                                    setImageFile(event.target.files[0]);
                                    // Assuming you have logic here to create a preview URL
                                }
                            } else {
                                setImageFile(null); // Reset state if no file is selected
                                setPreviewUrl(null); // Also reset the preview URL
                            }
                        }} className="photobtn" type='file' accept="image/*" required style={{ display: 'none' }} />
                        {imageFile === null ?
                            "Upload Picture +"
                            :
                            `Change Picture`
                        }
                    </label>
                </div>

                <input
                    required
                    className="sale-itemName-input"
                    placeholder="Corset / Cargos / Necklace..."
                    maxLength={40}
                    value={item.itemName}
                    onChange={(e) => {
                        setItem({
                            ...item,
                            itemName: e.target.value
                        })
                    }}
                />

                <textarea
                    required
                    className="sale-itemDesc-input"
                    placeholder="Size M, blue colour, brand new..."
                    cols={50}
                    maxLength={150}
                    value={item.itemDescription}
                    onChange={(e) => {
                        setItem({
                            ...item,
                            itemDescription: e.target.value ? e.target.value : ''
                        })
                    }}
                />

                <Row css={{
                    jc: 'space-between',
                    margin: '4px 0px 24px 0px',
                    alignItems: 'normal'
                }}>
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 'max-content'
                    }}>
                        <Row css={{
                            padding: '4px 8px 0px 8px',
                            gap: 6,
                            alignItems: 'center',
                            width: 'max-content',
                        }}>
                            <Button auto flat color={'success'} className="sale-buttons"
                                icon={<IoLogoWhatsapp size={'20px'} color={"#25D366"} className="item-icon" />}
                                css={{
                                    lineHeight: '1.2',
                                    height: 'max-content'
                                }}>
                                {item.contactNumber}
                            </Button>
                        </Row>
                        <Link css={{
                            fontSize: '12px'
                        }}
                            onClick={() => {
                                setShowNumberUpdateModal(true)
                            }}>
                            Change number?
                        </Link>
                    </Col>
                </Row>
            </Col>

            <Modal
                open={showNumberUpdateModal}
                closeButton
                onClose={() => {
                    setShowNumberUpdateModal(false)
                }}
            >
                <Grid.Container css={{
                    jc: 'center',
                    alignItems: '',
                    padding: '24px 0px',
                }}>
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 'max-content',
                        gap: 24
                    }}>
                        <Text css={{
                            '@xsMin': {
                                fontSize: '$xl'
                            },
                            '@xsMax': {
                                fontSize: '$lg'
                            },
                            fontWeight: '$semibold'
                        }}>
                            Update Phone Number
                        </Text>

                        <Input css={{
                            width: '200px',
                            backgroundColor: '#697177'
                        }}
                            labelLeft={
                                <IoLogoWhatsapp size={24} color="#25D366" />
                            }
                            animated={false}
                            placeholder="9876512340"
                            maxLength={12}
                            status={phoneStatus}
                            helperText="Whatsapp Contact Number!"
                            onChange={(e) => {
                                const inputVal = e.target.value;
                                const numVal = parseInt(inputVal, 10);
                                setNumber(numVal)

                                // Check if the input value is a number and its length
                                if (!isNaN(numVal) && inputVal.length >= 10) {
                                    setPhoneStatus('success');
                                    setNumber(e.target.value)
                                } else {
                                    setPhoneStatus('error');
                                }
                                if (inputVal.length === 0) {
                                    setPhoneStatus('default')
                                }
                            }}

                        />

                        <Button flat auto color={'primary'} css={{
                            margin: '24px 0px'
                        }}
                            disabled={phoneStatus !== 'success'}
                            onClick={() => {
                                updateContactNumber()
                            }}>
                            Update
                        </Button>
                    </Col>
                </Grid.Container>
            </Modal>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropLoaderOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

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
        </Grid>
    )
}