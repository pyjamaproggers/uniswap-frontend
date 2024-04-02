import React, { useEffect, useState } from "react";
import { Button, Col, Grid, Text } from "@nextui-org/react";
import './ErrorAuthPage.css'

export default function ErrorAuthPage(){

    const backend = process.env.REACT_APP_BACKEND

    function handleLogout() {
        fetch(`${backend}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Necessary to include the cookie in requests
        })
            .then(res => {
                if (res.ok) {
                    // Assuming the backend has now invalidated the session/cookie...

                    // Clear client-side storage of user details
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userPicture');
                    localStorage.removeItem('itemsPosted');
                    localStorage.removeItem('favouriteItems');
                    localStorage.removeItem('contactNumber');
                    localStorage.clear()
                    // Redirect user to the homepage or login page
                    window.location.pathname = '/' // Adjust the path as necessary for your application
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Optionally handle the error, maybe show a notification to the user
            });
    }

    useEffect(()=>{
        window.setTimeout(()=>{
            handleLogout()
        }, 2000)
    })

    return(
        <div className="errorAuth-bg">
            <Col
            css={{
                jc: 'center',
                textAlign: 'center',
                alignItems: 'center',
            }}>
                <Text 
                css={{
                    fontWeight: '$semibold',
                    '@xsMin':{
                        fontSize: '$4xl',
                    },
                    '@xsMax':{
                        fontSize: '$2xl'
                    },
                    color: '$error'
                }}>
                    404 Not Found
                </Text>
                <Text 
                css={{
                    fontWeight: '$semibold',
                    '@xsMin':{
                        fontSize: '$2xl',
                    },
                    '@xsMax':{
                        fontSize: '$lg'
                    },
                    color: '$error'
                }}>
                    You don't seem to be logged in...
                </Text>
                {/* <Loading 
                    loadingCss={{ $$loadingSize: "60px", $$loadingBorder: "3px" }}
                    color='white'
                    type="default" 
                    gradientBackground={'#141414'}
                /> */}
            </Col>
        </div>
    )
}