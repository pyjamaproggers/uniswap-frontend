import React from "react";
import { Container, Row, Text, Link, Col } from "@nextui-org/react";

function Footer(){
    return(
        <Container fluid >
            <Col css={{
            }}>
                <Row      
                css={{
                    jc: 'center',
                    textAlign: 'center',
                    alignItems: 'center',
                    borderStyle: 'solid',
                    borderColor: '$gray600',
                    borderWidth: '0px 0px 0px 0px'
                }}>
                    {/* <Text
                    css={{
                        padding: '1% 0.35%',
                        fontSize: '$normal'
                    }}>
                        Made with 🤍
                    </Text> */}
                    {/* <Text showIn={'xs'}
                    css={{
                        padding: '1%',
                    }}>
                        By
                    </Text>
                    <Link
                    css={{
                        color: '#3694ff'
                    }} target='_blank' href="https://aryanyadav.com/"
                    >
                        Aryan Yadav
                    </Link>
                    <Text hideIn={'xs'}
                    css={{
                        padding: '1% 0.35%'
                    }}>
                        and 
                    </Text>
                    <Text showIn={'xs'}
                    css={{
                        padding: '1%'
                    }}>
                        and 
                    </Text>
                    <Link 
                    css={{
                        color: '#3694ff'
                    }} target='_blank' href="https://zahaanshapoorjee.netlify.app/"
                    >
                        Zahaan Shapoorjee
                    </Link> */}
                </Row>
                <Text
                css={{
                    color: '$gray700',
                    jc: 'center',
                    textAlign: 'center',
                    padding: '10px 0px',
                    borderStyle: 'solid',
                    borderColor: '$gray400',
                    borderWidth: '1px 0px 0px 0px',
                    '@xsMax':{
                        fontSize: '$xs'
                    },
                    marginBottom: '72px'
                }}>
                    © 2024 UniSwap™. All Rights Reserved.
                </Text>
            </Col>
        </Container>
    )
}

export default Footer;