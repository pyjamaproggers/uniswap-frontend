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
import InputItemCard from "../../components/items/inputItemCard";

export default function EditSalePage() {

    const location = useLocation()
    const backend = process.env.REACT_APP_BACKEND
    const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;
    const [item, setItem] = useState({ ...location.state })

    const [backdropLoaderOpen, setBackdropLoaderOpen] = useState(false)

    const [originalItemPicture, setOriginalItemPicture] = useState(item.itemPicture);

    const [imageFile, setImageFile] = useState(item.itemPicture)
    const [previewUrl, setPreviewUrl] = useState(null)

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
        if (!item.contactNumber || typeof item.contactNumber !== 'string' || item.contactNumber.trim().length === 0) {
            alert('Contact number is required.');
            return false;
        }
    
        // If all checks pass
        return true;
    };

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
        if (typeof(imageFile)=='object') {
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

                <InputItemCard item={item} setItem={setItem} imageFile={imageFile} setImageFile={setImageFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} type={'editSale'}/>

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