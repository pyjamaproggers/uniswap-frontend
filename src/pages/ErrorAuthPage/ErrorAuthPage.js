import React, { useEffect, useState } from "react";
import { Button, Col, Grid, Text } from "@nextui-org/react";
import './ErrorAuthPage.css'

export default function ErrorAuthPage(){
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