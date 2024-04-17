import React from 'react';
import { Text, useTheme } from "@nextui-org/react";

function Segmentation({ pageValue, pageIndex, setPageIndex, getBackgroundColor, getTextColor }) {
    const theme = useTheme();

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            marginBottom: '6px',
            background: theme.type === 'light' ? 'rgb(250,250,250)' : '#000',
            borderRadius: '10px',
            padding: '5px 6px',
        }}>
            {pageValue.map((value, index) => (
                <div
                    key={index}
                    onClick={() => {
                        setPageIndex(index);
                    }}
                    style={{
                        flexGrow: 1,
                        padding: '4px 2px',
                        cursor: 'pointer',
                        color: index === pageIndex ? '#FFF' : 'gray',
                        backgroundColor: index === pageIndex ? getBackgroundColor(value, theme) : 'transparent',
                        textAlign: 'center',
                        borderRadius: '6px',
                        transition: 'all 0.45s',
                    }}
                >
                    <Text css={{
                        color: index === pageIndex ? getTextColor(value, theme) : '$gray600',
                        fontSize: '$sm',
                        fontWeight: '$semibold',
                        lineHeight: '1.5',
                    }}>
                        {value}
                    </Text>
                </div>
            ))}
        </div>
    );
}

export default Segmentation;
