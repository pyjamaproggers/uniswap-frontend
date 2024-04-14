import React, { useEffect, useState } from "react";
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { useNavigate } from 'react-router-dom';
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown, Image, Avatar, useTheme } from "@nextui-org/react";
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
import InputItemCard from "../../components/items/inputItemCard";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FaChevronLeft } from "react-icons/fa";
import getCroppedImg from '../../components/items/cropImage'
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';

export default function EditSalePage() {

    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false)

    const theme = useTheme()
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const location = useLocation()
    const backend = process.env.REACT_APP_BACKEND
    const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;
    const [item, setItem] = useState({ ...location.state })

    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    const [originalItemPicture, setOriginalItemPicture] = useState(item.itemPicture);

    const [imageFile, setImageFile] = useState(item.itemPicture)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    document.querySelectorAll('input, select, textarea').forEach((element) => {
        element.addEventListener('focus', (event) => event.preventDefault());
    });

    const checkForm = () => {
        // itemName: Required and must be a non-empty string
        if (!item.itemName || typeof item.itemName !== 'string' || item.itemName.trim().length === 0) {
            alert('Item name is required.');
            return false;
        }

        // itemPrice: Required and must be an integer
        if (!Number.isInteger(item.itemPrice)) {
            alert('Item price must be a number.');
            return false;
        }

        // itemCategory: Required and must be a non-empty string
        if (!item.itemCategory || typeof item.itemCategory !== 'string' || item.itemCategory.trim().length === 0) {
            alert('Item category is required.');
            return false;
        }

        // contactNumber: Required and must be a non-empty string
        // Additional validation can be added here, e.g., regex for phone numbers
        // if (!item.contactNumber || typeof item.contactNumber !== 'string' || item.contactNumber.trim().length === 0) {
        //     alert('Contact number is required.');
        //     return false;
        // }

        // If all checks pass
        return true;
    };

    const navigate = useNavigate();
    const verifyUserSession = () => {
        fetch(`${backend}/api/auth/verify`, {
            method: 'GET',
            credentials: 'include', // Necessary to include the cookie in the request
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Session expired or user not logged in');
                }
            })
            .then(data => {
                console.log('User session verified:', data);
                // Optionally update the UI or state based on the response
            })
            .catch(error => {
                console.error('Error verifying user session:', error);
                // Redirect to login page or show an error page
                navigate('/unauthorized'); // Adjust the path as necessary
            });
    };

    useEffect(() => {
        verifyUserSession();
    }, []);

    const sendItem = async () => {
        setBackdropLoaderOpen(true);
        if (!checkForm()) {
            setBackdropLoaderOpen(false);
            return;
        }

        let imageUrl = originalItemPicture; // Default to the original picture URL

        if (imageFile && typeof imageFile === 'object' && imageFile.size) { // Check if imageFile is a file object
            try {
                // Obtain the pre-signed URL from your backend
                const finalImage = await getCroppedImg(previewUrl, croppedAreaPixels)
                const uploadResponse = await fetch(`${backend}/api/upload`, { credentials: 'include' });
                const uploadData = await uploadResponse.json();
                const { url, key } = uploadData;

                // Upload the image to S3 using the pre-signed URL
                const putResponse = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'image/jpeg', // Adjust according to your image's MIME type
                    },
                    body: finalImage,
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
            setShowSuccessSnackbar(true)
            window.setTimeout(() => {
                window.location.pathname = '/useritems'
            }, 1000)
            // Further actions on successful update, like redirecting or refreshing the item details
        } catch (error) {
            setBackdropLoaderOpen(false)
            console.error('Error updating item:', error);
            setShowErrorSnackbar(true)
        }
    };

    useEffect(() => {
        if (typeof (imageFile) === 'object' && imageFile) {
            console.log('editsalepage: ', imageFile)
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
                padding: '16px 0px 104px',
                jc: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '24px',
                    left: '15px'
                }}
                    onClick={() => navigate(-1)}>
                    <FaChevronLeft size={16} color={theme.type === 'light' ? "#0c0c0c" : "#f0f0f0"} />
                </div>
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

                <InputItemCard item={item} setItem={setItem} imageFile={imageFile} setImageFile={setImageFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} type={'editsale'} setCroppedAreaPixels={setCroppedAreaPixels} />

                <Grid.Container css={{
                    '@xsMin': {
                        display: 'none'
                    },
                    '@xsMax': {
                        display: 'flex'
                    },
                    zIndex: '1000',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}>
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                        <BottomNavigation style={{
                            backgroundColor: theme.type === 'light' ? '#fff' : '#0c0c0c',
                            width: '100vw',
                            height: 'max-content',
                            alignItems: 'center'
                        }}>
                            <Button auto flat css={{
                                marginTop: '8px',
                                marginBottom: isIOS? '48px' : '8px',
                                height: 'max-content',
                                padding: '6px 12px',
                                width: '100%',
                                marginLeft: '24px',
                                marginRight: '24px'
                            }}
                                onClick={() => {
                                    if (checkForm()) {
                                        sendItem()
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
                                            fontSize: '$md'
                                        },
                                        fontWeight: '$medium',
                                        color: '$blue600'
                                    }}>
                                        Update
                                    </Text>
                                    <IoSendSharp size={16} style={{  }} />
                                </Row>
                            </Button>
                        </BottomNavigation>
                    </Paper>
                </Grid.Container>


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

            </Grid.Container>
        )
    }
}