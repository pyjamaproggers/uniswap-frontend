import React, { useEffect, useState } from "react";
import { Badge, Col, Grid, Text, Row, useTheme, Switch, Loading, Collapse } from "@nextui-org/react";
import './eventCard.css'
import { GoBellFill } from "react-icons/go";
import { CgSpinner } from "react-icons/cg";

export default function EventCard(props) {
    const type = props.type
    const event = props.event
    const userFCMToken = props.userFCMToken
    const getFCMToken = props.getFCMToken
    const [showDescription, setShowDescription] = useState(false)
    const theme = useTheme()
    const categoryColors = {
        academic: 'error',
        sports: 'primary',
        food: 'warning',
        club: 'success',
    };
    const badgeColor = categoryColors[event.eventCategory] || 'default';
    const [switchLoading, setSwitchLoading] = useState(false)

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);

        // Adding ordinal suffix
        const day = date.getDate();
        return formattedDate.replace(day, getOrdinalSuffix(day));
    }

    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return day + 'th';
        switch (day % 10) {
            case 1: return day + "st";
            case 2: return day + "nd";
            case 3: return day + "rd";
            default: return day + "th";
        }
    }

    function convertToIST(timeString) {
        // Split the time and the millisecond parts
        const [time] = timeString.split('.');
        // Create a date object using a placeholder date with the time in UTC
        const date = new Date(`1970-01-01T${time}Z`);

        // IST is UTC + 5:30
        const ISTOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds

        // Get the time in milliseconds and add the IST offset
        const ISTTime = new Date(date.getTime() + ISTOffset);

        // Return the adjusted time as a string in 12-hour format with AM/PM
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return ISTTime.toLocaleTimeString('en-US', options);
    }

    if (event.live !== 'y') {
        return null
    }

    return (
        <Grid.Container css={{
            margin: '8px 0px',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* <Row css={{
                alignItems: 'start',
                jc: 'center',
                width: '97.5vw',
                maxW: '400px',
                padding: '8px 12px 8px 8px',
                backgroundColor: theme.type === 'light' ? '#fdfdfd' : 'rgb(35,35,35)',
                borderRadius: '6px',
                boxShadow: theme.type === 'light' ? '0px 0px 4px rgba(150,150,150, 0.5)' : ''
            }}>
                <Col css={{
                    marginLeft: '0px'
                }}>
                    <Row css={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '4px',
                        borderStyle: 'solid',
                        borderWidth: '0px 0px 1px 0px',
                        borderColor: theme.type === 'light' ? '$gray200' : '$gray200'
                    }}>
                        <Row css={{
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <img
                                src={`https://api.multiavatar.com/${event.userName}.png?apikey=Bvjs0QyHcCxZNe`}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 40,
                                }}
                            />
                            <Col>
                                <Text css={{
                                    fontSize: '$md',
                                    fontWeight: "$medium",
                                    lineHeight: '1.4'
                                }}>
                                    {event.eventName}
                                </Text>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: "$medium",
                                    lineHeight: '1.5'
                                }}>
                                    <span style={{ color: 'gray' }}>by</span> {event.userName}
                                </Text>
                            </Col>
                        </Row>
                        <Badge variant="flat" size={'md'} color={badgeColor} css={{
                            border: 'none'
                        }}>
                            {event.eventCategory.charAt(0).toUpperCase() + event.eventCategory.slice(1)}
                        </Badge>
                    </Row>
                    {showDescription ?
                        <Row css={{
                            jc: 'start'
                        }}>
                            <Text css={{
                                fontSize: '$sm',
                                fontWeight: '$medium',
                                lineHeight: '1.7',
                                padding: '6px 0px 8px 4px',
                                borderStyle: 'solid',
                                borderWidth: '0px 0px 1px 0px',
                                borderColor: theme.type === 'light' ? '$gray200' : '$gray200',
                            }}>
                                {event.eventDescription}
                            </Text>
                        </Row>
                        :
                        <Row css={{
                            jc: 'start',
                            alignItems: 'center',
                            gap: 4
                        }}>
                            <Text css={{
                                fontSize: '$sm',
                                fontWeight: '$medium',
                                lineHeight: '1.7',
                                width: '70%',
                                height: '10',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                padding: '6px 0px 8px 4px',
                                borderStyle: 'solid',
                                borderWidth: '0px 0px 1px 0px',
                                borderColor: theme.type === 'light' ? '$gray200' : '$gray200',
                            }}>
                                {event.eventDescription}
                            </Text>
                            <Text css={{
                                fontSize: '$sm',
                                fontWeight: '$medium',
                                color: '$gray600',
                                lineHeight: '1.7',
                                padding: '6px 0px 8px 0px',
                            }}
                                onClick={() => {
                                    setShowDescription(true)
                                }}>
                                Read more
                            </Text>
                        </Row>
                    }

                    <Row css={{
                        alignItems: 'start',
                        paddingLeft: '4px',
                        paddingTop: '4px',
                        justifyContent: 'space-between'
                    }}>
                        <Row css={{
                            width: 'max-content',
                            gap: 4,
                        }}>
                            <Col css={{
                                width: 'max-content',
                            }}>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                    color: '$gray600',
                                    lineHeight: '1.1'
                                }}>
                                    at
                                </Text>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                }}>
                                    {convertToIST(event.eventTime)}
                                </Text>
                            </Col>

                            <Col css={{
                                width: 'max-content',
                                paddingLeft: '4px',
                            }}>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                    color: '$gray600',
                                    lineHeight: '1.1'
                                }}>
                                    on
                                </Text>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                }}>
                                    {formatDate(event.eventDate).split(' ')[0]} {formatDate(event.eventDate).split(' ')[1]}, {formatDate(event.eventDate).split(' ')[2].slice(2, 4)}
                                </Text>
                            </Col>

                            <Col css={{
                                width: 'max-content',
                                paddingLeft: '4px'
                            }}>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                    color: '$gray600',
                                    lineHeight: '1.1'
                                }}>
                                    in
                                </Text>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                }}>
                                    {event.eventLocation}
                                </Text>
                            </Col>
                        </Row>

                        <Col css={{
                            width: 'max-content',
                            paddingLeft: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'end'
                        }}>
                            <Text css={{
                                fontSize: '$sm',
                                fontWeight: '$medium',
                                color: '$gray600',
                                lineHeight: '1.1',
                                marginBottom: '4px'
                            }}>
                                notify me?
                            </Text>
                            {switchLoading ?
                                <Loading
                                    size="xs"
                                    // color={theme.type === 'light' ? '#0c0c0c' : '#fff'}
                                    color={'primary'}
                                />
                                :
                                <Switch
                                    size={'xs'}
                                    color={'primary'}
                                    checked={event.notifications.includes(userFCMToken)}
                                    icon={<GoBellFill />}
                                    onChange={(e) => {
                                        setSwitchLoading(true)
                                        getFCMToken(event._id, e.target.checked ? "add" : "remove", setSwitchLoading)
                                    }}
                                />
                            }
                        </Col>
                    </Row>

                </Col>
            </Row> */}

            <Grid
                css={{
                    width: '97.5vw',
                    maxW: '400px',
                    // padding: '4px 4px 4px 4px',
                    backgroundColor: theme.type === 'light' ? '#fdfdfd' : 'rgb(35,35,35)',
                    borderRadius: '4px',
                    boxShadow: '0px 0px 2px rgba(150,150,150,0.75)'
                }}
            >
                <Collapse
                    className="event-card"
                    expanded={false}
                    bordered={false}
                    title={
                        <Row css={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            // paddingBottom: '4px',
                            // borderStyle: 'solid',
                            // borderWidth: '0px 0px 1px 0px',
                            borderColor: theme.type === 'light' ? '$gray200' : '$gray200',
                        }}
                            className="event-card-title"
                        >
                            <Row css={{
                                alignItems: 'center',
                                gap: 8
                            }}>
                                <img
                                    src={`https://api.multiavatar.com/${event.userName}.png?apikey=Bvjs0QyHcCxZNe`}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 40,
                                    }}
                                />
                                <Col>
                                    <Text css={{
                                        fontSize: '$md',
                                        fontWeight: "$medium",
                                        lineHeight: '1.4'
                                    }}>
                                        {event.eventName}
                                    </Text>
                                    <Text css={{
                                        fontSize: '$sm',
                                        fontWeight: "$medium",
                                        lineHeight: '1.5'
                                    }}>
                                        <span style={{ color: 'gray' }}>by</span> {event.userName}
                                    </Text>
                                </Col>
                            </Row>
                            <Badge variant="flat" size={'md'} color={badgeColor} css={{
                                border: 'none'
                            }}>
                                {event.eventCategory.charAt(0).toUpperCase() + event.eventCategory.slice(1)}
                            </Badge>
                        </Row>
                    }
                >
                    <Row css={{
                        alignItems: 'stretch',
                        paddingLeft: '2px',
                        paddingTop: '4px',
                        justifyContent: 'space-between',
                        height: '100%'
                    }}>
                        <Col css={{
                            width: 'max-content',
                            gap: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            borderStyle: 'solid',
                            borderWidth: '0px 1px 0px 0px',
                            borderColor: '$gray200',
                            paddingRight: '12px',
                        }}>
                            <Col css={{
                                width: 'max-content',
                                paddingLeft: '4px'
                            }}>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                    color: '$gray600',
                                    lineHeight: '1'
                                }}>
                                    at
                                </Text>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                }}>
                                    {convertToIST(event.eventTime)}
                                </Text>
                            </Col>

                            <Col css={{
                                width: 'max-content',
                                paddingLeft: '4px',
                            }}>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                    color: '$gray600',
                                    lineHeight: '1'
                                }}>
                                    on
                                </Text>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                }}>
                                    {formatDate(event.eventDate).split(' ')[0]} {formatDate(event.eventDate).split(' ')[1]}, {formatDate(event.eventDate).split(' ')[2].slice(2, 4)}
                                </Text>
                            </Col>

                            <Col css={{
                                width: 'max-content',
                                paddingLeft: '4px'
                            }}>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                    color: '$gray600',
                                    lineHeight: '1'
                                }}>
                                    in
                                </Text>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                }}>
                                    {event.eventLocation}
                                </Text>
                            </Col>
                        </Col>

                        <Col css={{
                            jc: 'space-between',
                            padding: '0px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            width: '100%'
                        }}>
                            <Text css={{
                                fontSize: '$sm',
                                fontWeight: '$medium',
                                lineHeight: '1.7',
                                borderColor: theme.type === 'light' ? '$gray200' : '$gray200',
                            }}>
                                {event.eventDescription}
                            </Text>

                            <Row css={{
                                width: '100%',
                                justifyContent: 'end',
                                // borderStyle: 'solid',
                                // borderWidth: '1px 0px 0px 0px',
                                // borderColor: "$gray200",
                                alignItems: 'center',
                                gap: 6
                            }}>
                                <Text css={{
                                    fontSize: '$sm',
                                    fontWeight: '$medium',
                                }}>
                                    Notify me 1 hour prior?
                                </Text>
                                {switchLoading ?
                                    <Loading
                                        size="xs"
                                        // color={theme.type === 'light' ? '#0c0c0c' : '#fff'}
                                        color={'primary'}
                                        css={{
                                            margin: '0px 8px'
                                        }}
                                    />
                                    :
                                    <Switch
                                        size={'xs'}
                                        color={'primary'}
                                        checked={event.notifications.includes(userFCMToken)}
                                        icon={<GoBellFill />}
                                        onChange={(e) => {
                                            setSwitchLoading(true)
                                            getFCMToken(event._id, e.target.checked ? "add" : "remove", setSwitchLoading)
                                        }}
                                    />
                                }
                            </Row>
                        </Col>
                    </Row>

                </Collapse>


            </Grid>
        </Grid.Container>
    )
}