import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown, Image, Avatar, Link, Badge, Collapse, Modal, useTheme } from "@nextui-org/react";
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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './itemCard.css'
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // You'll need this helper function for cropping
import { debounce } from 'lodash';

export default function InputItemCard(props) {

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false)

    const item = props.item
    const setItem = props.setItem
    const backend = process.env.REACT_APP_BACKEND
    const imageFile = props.imageFile
    const setImageFile = props.setImageFile

    const previewUrl = props.previewUrl
    const setPreviewUrl = props.setPreviewUrl
    const setCroppedAreaPixels = props.setCroppedAreaPixels
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);


    const type = props.type
    const theme = useTheme()

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

    useEffect(()=>{
        console.log(previewUrl)
    },[previewUrl])

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
                    setShowErrorSnackbar(true)
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
                setShowSuccessSnackbar(true)
            })
            .catch(error => {
                console.error('Error updating phone number:', error);
                setBackdropLoaderOpen(false);
                setShowErrorSnackbar(true)
                window.location.pathname = '/useritems'
            });
    };

    const onCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => {
        // console.log(croppedAreaPixels)
        setCroppedAreaPixels(croppedAreaPixels);
        // console.log('cropping')
        // handleSaveCroppedImage();
    }, []);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            // console.log(event.target.files[0].size/1000/1000)
            // console.log(event.target.files[0])
            if (event.target.files[0].size > (20 * 1000 * 1000)) {
                window.alert('Maximum file size: 20mb!');
            } else {
                setImageFile(event.target.files[0]);
                // Assuming you have logic here to create a preview URL
            }
        } else {
            setImageFile(null); // Reset state if no file is selected
            setPreviewUrl(null); // Also reset the preview URL
        }
    };

    return (
        <Grid css={{
            margin: '24px 0px'
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
                            // src={item.userPicture}
                            src={`https://api.multiavatar.com/${localStorage.getItem('userName')}.png?apikey=Bvjs0QyHcCxZNe`}
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
                            style={{ fontSize: "16px" }}
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

                <div style={{ position: 'relative', 
                height: window.screen.width > 400 ? '400px' : '97.5vw', 
                width: window.screen.width > 400 ? '400px' : '97.5vw'
                }}>
                    {(previewUrl === null) ?
                        <>
                            {type === 'editsale' ?
                                <>
                                    <Cropper
                                        image={item.itemPicture}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1} // Set to 1 for a square aspect ratio
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropAreaChange={onCropAreaChange}
                                        cropShape="rect"
                                        showGrid={true}
                                        objectFit="horizontal-cover"
                                        // onMediaLoaded={(mediaSize) => {
                                        //     // Adapt zoom based on media size to fit max height
                                        //     setZoom(400 / mediaSize.naturalHeight)
                                        //   }}
                                    />
                                </>
                                :
                                <>
                                    <Image src={Grey} width={window.screen.width > 400 ? '400px' : '97.5vw'} height={window.screen.width > 400 ? '400px' : '97.5vw'} css={{
                                        borderRadius: '4px',
                                        opacity: '0.25',
                                        objectFit: 'cover',
                                    }}
                                    />
                                </>
                            }
                        </>
                        :
                        <div>
                            <Cropper
                                image={previewUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Set to 1 for a square aspect ratio
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropAreaChange={onCropAreaChange}
                                cropShape="rect"
                                showGrid={true}
                                objectFit="horizontal-cover"
                            />
                        </div>
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
                            handleImageChange(event)
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
                    style={{ fontSize: "16px" }}
                    className={theme.type === 'light' ? "sale-itemName-input-light" : "sale-itemName-input-dark"}
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
                    className={theme.type === 'light' ? "sale-itemName-input-light" : "sale-itemName-input-dark"}
                    placeholder="Size M, blue colour, brand new..."
                    cols={50}
                    style={{ fontSize: "16px" }}
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
                    margin: '4px 0px 0px 0px',
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
                            backgroundColor: '#697177',
                            fontSize: "16px"
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

            {/* <ToastContainer
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
            /> */}

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


        </Grid >
    )
}