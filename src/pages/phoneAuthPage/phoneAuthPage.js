import { Button, Col, Grid, Input, Text } from "@nextui-org/react";
import React, { useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io";

export default function PhoneAuthPage () {

    const [number, setNumber] = useState('')

    const [phoneStatus, setPhoneStatus] = useState('default')

    return(
        <Grid.Container css={{
            jc: 'center',
            alignItems: '',
            padding: '24px 0px',
            height: window.screen.height - 76
        }}>
            <Col css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 'max-content',
                gap: 24
            }}>
                <Text css={{
                    '@xsMin':{
                        fontSize: '$xl'
                    },
                    '@xsMax':{
                        fontSize: '$lg'
                    },
                    fontWeight: '$semibold'
                }}>
                    Update Phone Number
                </Text>

                <Input css={{
                    width: '200px'
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
                
                    // Check if the input value is a number and its length
                    if (!isNaN(numVal) && inputVal.length >= 10) {
                        setPhoneStatus('success');
                    } else {
                        setPhoneStatus('error');
                    }
                    if(inputVal.length === 0){
                        setPhoneStatus('default')
                    }
                }}
                
                />

                <Button flat auto color={'primary'} css={{
                    margin: '24px 0px'
                }}>
                    Save
                </Button>
            </Col>
        </Grid.Container>
    )
}