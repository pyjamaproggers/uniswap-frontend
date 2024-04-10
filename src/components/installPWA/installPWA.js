import React from "react";
import Logo from '../../assets/UniSwap2.PNG'
import { Grid, Image, Row, Text, useTheme } from "@nextui-org/react";
import { IoShareOutline } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";
import './installPWA.css'

export default function InstallPWA({ isIOS, isAndroid }) {
    const theme = useTheme()
    return (
        <Grid.Container
            css={{
                jc: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: theme.type==='light' ? '#f6f6f6' : ''
            }}
        >
            <Grid css={{
                display: 'flex',
                flexDirection: 'column',
                width: 'max-content',
                boxShadow: theme.type==='light' ? '32px 0px 32px rgba(224, 203, 245, 0.4)' : '64px 0px 32px rgba(46,15,77, 0.4)',
                borderRadius: '16px',
                alignItems: 'center',
                textAlign: 'center',
                maxW: '90vw',
                zIndex: 999,
                padding: '24px 0px',
                backgroundColor: theme.type==='light' ? '#fff' : 'rgb(20,20,20)'
            }}
            className={theme.type==='light' ? 'pwa-light-bg' : 'pwa-dark-bg'}
            >
                <Image
                    src={Logo}
                    width={60}
                    height={60}
                css={{
                    backgroundColor: theme.type==='light' ? 'rgb(248,248,248)':'rgb(20,20,20)',
                    boxShadow: '0px 0px 2px rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                }}
                />
                <Text css={{
                    fontWeight: '$medium',
                    '@xsMax': {
                        fontSize: '$base',
                    },
                    '@xsMin': {
                        fontSize: '$2xl'
                    },
                    margin: '16px 0px 16px 0px'
                }}>
                    Install UniSwap PWA
                </Text>
                <Text css={{
                    fontWeight: '$medium',
                    '@xsMax': {
                        fontSize: '$sm',
                    },
                    '@xsMin': {
                        fontSize: '$lg'
                    },
                    padding: '16px 32px'
                }}>
                    To receive push notifications and enjoy a better experience install UniSwap on your Home screen.
                </Text>
                <Row css={{
                    alignItems: 'center',
                    width: 'max-content',
                    padding: '12px 0px 12px'
                }}>
                    <Text css={{
                        fontWeight: '$medium',
                        '@xsMax': {
                            fontSize: '$sm',
                        },
                        '@xsMin': {
                            fontSize: '$lg'
                        },
                        alignItems: 'center'
                    }}>
                        Just tap
                    </Text>
                    {isIOS &&
                        <IoShareOutline size={16} color="#9750DD"
                            style={{
                                margin: '0px 4px'
                            }}
                        />
                    }
                    {isAndroid &&
                        <HiDotsVertical size={16} color="#9750DD"
                            style={{
                                margin: '0px 4px'
                            }}
                        />
                    }
                    {isIOS &&
                        <Text css={{
                            fontWeight: '$medium',
                            '@xsMax': {
                                fontSize: '$sm',
                            },
                            '@xsMin': {
                                fontSize: '$lg'
                            },
                            alignItems: 'center'
                        }}>
                            and “Add to Home Screen”
                        </Text>
                    }
                    {isAndroid &&
                        <Text css={{
                            fontWeight: '$medium',
                            '@xsMax': {
                                fontSize: '$sm',
                            },
                            '@xsMin': {
                                fontSize: '$lg'
                            },
                            alignItems: 'center'
                        }}>
                            and “Install App”
                        </Text>
                    }
                </Row>

                <Text css={{
                    fontWeight: '$medium',
                    '@xsMax': {
                        fontSize: '$sm',
                    },
                    '@xsMin': {
                        fontSize: '$lg'
                    },
                    padding: '8px 32px',
                }}>
                    Surf, save, buy, sell. <span style={{ color: '#9750DD' }}> Go crazy!</span>
                </Text>
            </Grid>

        </Grid.Container>
    )
}