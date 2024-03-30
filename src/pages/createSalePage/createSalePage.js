import React, { useEffect, useState } from "react";
import ErrorAuthPage from "../ErrorAuthPage/ErrorAuthPage";
import { Button, Col, Grid, Input, Text, Row, Textarea, Dropdown, Image, Avatar, Link, Badge, Collapse, Modal } from "@nextui-org/react";
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
        contactNumber: localStorage.getItem('contactNumber'), //we have to now obtain from localstorage once we set it in cookie after taking it
        live: 'y',
        dateAdded: '' //today's date
    })

    const [imageFile, setImageFile] = useState(null)
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
        setBackdropLoaderOpen(true)
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

                <InputItemCard item={item} setItem={setItem} imageFile={imageFile} setImageFile={setImageFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} type={'createSale'} />

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