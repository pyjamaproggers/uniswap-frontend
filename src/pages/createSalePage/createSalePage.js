import React, { useEffect, useState } from "react";
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown, Image, Avatar, Link, Badge, Collapse } from "@nextui-org/react";
import { GiClothes } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { MdMiscellaneousServices } from "react-icons/md";
import { GiJewelCrown } from "react-icons/gi";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineQuestionMark } from "react-icons/md";
import './createSalePage.css'
import Grey from '../../assets/Grey.jpeg'
import { IoLogoWhatsapp } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputItemCard from "../../components/items/inputItemCard";

export default function CreateSalePage() {

    const backend = process.env.REACT_APP_BACKEND
    const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;

    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

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

    console.log(item)
    const [firstName, lastName] = item.userName.split(' ');

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

    const [itemsStatus, setItemsStatus] = useState({
        itemName: 'default',
        itemDescription: 'default',
        itemPrice: 'default',
        itemCategory: 'default',
        itemPicture: 'default',
        contactNumber: 'default'
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
        setBackdropLoaderOpen(true)
        if (Object.values(itemsStatus).some(value => (value === 'default' || value === 'error'))) {
            setBackdropLoaderOpen(false)
            return false
        }
        else {
            return true
        }
    }

    const postItemToBackend = async (itemData) => {
        console.log(`${backend}/api/items`)
        try {
            const response = await fetch(`${backend}/api/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify(itemData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Item posted successfully:', responseData);
                setBackdropLoaderOpen(false)
                toast.success('Item posted!', {
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
                // Here, you can redirect the user or show a success message
            } else {
                // Handle the error if the server response was not OK.
                const errorData = await response.json();
                console.error('Failed to post item:', errorData);
                toast.error('Image upload failed', {
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
                setBackdropLoaderOpen(false)
                // Show an error message to the user
            }
        } catch (error) {
            console.error('Error posting item to backend:', error);
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
            setBackdropLoaderOpen(false)
            // Handle network errors or other errors outside the HTTP response
        }
    };


    const sendItem = async () => {
        if (!checkForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        try {
            // Get presigned URL from your backend
            const uploadResponse = await fetch(`${backend}/api/upload`, { credentials: 'include' });
            const uploadData = await uploadResponse.json();
            const { url, key } = uploadData; // Assuming your backend provides the key

            // Upload the image to S3 using the presigned URL
            const putResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/jpeg', // Make sure this matches your file's type
                },
                body: imageFile, // Directly use the file as the body
            });

            if (putResponse.ok) {
                console.log('Image uploaded successfully.');

                // Construct the image URL from the key
                const imageUrl = `https://${bucket}.s3.amazonaws.com/${key}`;

                // Prepare item data, including the imageUrl
                const itemData = {
                    ...item,
                    itemPicture: imageUrl,
                    dateAdded: new Date().toISOString(),
                };

                // Send item data to your backend
                await postItemToBackend(itemData);
            } else {
                setBackdropLoaderOpen(false)
                console.error('Failed to upload image:', await putResponse.text());
            }
        } catch (error) {
            setBackdropLoaderOpen(false)
            console.error('Error:', error);
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
                    Create A Sale
                </Text>
                <Text css={{
                    '@xsMin': {
                        fontSize: '$lg'
                    },
                    '@xsMax': {
                        fontSize: '$md'
                    },
                    fontWeight: '$medium',
                    marginBottom: '12px',
                    color: '$gray600',
                    padding: '0px 12px',
                    textAlign: 'center',
                    lineHeight: '1.3'
                }}>
                    Complete your item, upload your sale and people will directly contact you - it's that simple!
                </Text>

                {/* <Grid css={{
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
                                        padding: '6px 0px'
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
                            <div className="input-wrapper">
                                <span className="currency-icon">₹</span>
                                <input
                                    required
                                    className="sale-price-input"
                                    placeholder="0"
                                    maxLength={5}
                                    onChange={(e) => {
                                        setItem({
                                            ...item,
                                            itemPrice: parseInt(e.target.value, 10)
                                        });
                                    }}
                                />
                            </div>

                        </Row>

                        <div style={{ position: 'relative', width: '330px', height: '300px' }}>
                            {previewUrl === null ?
                                <Image src={Grey} width={'330px'} height={'300px'} css={{
                                    borderRadius: '4px',
                                    opacity: '0.5',
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
                                        if (event.target.files[0].size > 2200000) {
                                            window.alert('Maximum file size: 2mb!');
                                        } else {
                                            setImageFile(event.target.files[0]);
                                            setItemsStatus({
                                                ...itemsStatus,
                                                itemPicture: 'success'
                                            });
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
                            placeholder="Item name (Corset / Cargos / Necklace)"
                            animated={false}
                            status={itemsStatus.itemName}
                            maxLength={40}
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
                            placeholder="Item description? (Size M, blue colour, brand new)"
                            animated={false}
                            status={itemsStatus.itemName}
                            cols={50}
                            maxLength={150}
                            onChange={(e) => {
                                setItem({
                                    ...item,
                                    itemName: e.target.value
                                })
                            }}
                        />

                        <Row css={{
                            jc: 'space-between',
                            margin: '4px 0px 24px 0px',
                            alignItems: 'normal'
                        }}>
                            <Text css={{
                                fontWeight: '$medium',
                                '@xsMin': {
                                    fontSize: '$md',
                                },
                                '@xsMax': {
                                    fontSize: '$sm'
                                },
                                color: '$gray600',
                                paddingLeft: '8px'
                            }}>
                                { }
                            </Text>
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
                                            lineHeight: '1.2'
                                        }}>
                                        8104213125
                                    </Button>
                                </Row>
                                <Link href='' css={{
                                    fontSize: '12px'
                                }}>
                                    Change number?
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                </Grid> */}

                <InputItemCard item={item} setItem={setItem} imageFile={imageFile} setImageFile={setImageFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} type={'createSale'}/>

                <Button auto flat css={{
                    margin: '0px 0px 36px 0px',
                    padding: '6px 0px'
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