import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TrackingQrcode = () => {
    const [url, setUrl] = useState(null);
    const [id, setId] = useState();
    const [value, setValue] = useState([]);
    const { state } = useLocation();
    const { params } = state;
    useEffect(() => {
        axios
            .get(`http://localhost:7000/tracking-data/${params}`)
            .then((response) => {
                setValue(response.data.data[0]);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <Grid sx={{ textAlign: 'center' }}>
                <Typography variant="h1" sx={{ marginBottom: '20px', marginTop: '20px' }}>
                    TRACK:{params}
                </Typography>
                <Typography variant="h2" sx={{ marginBottom: '20px' }}>
                    {value.tracking_hospital}
                </Typography>
                <QRCodeSVG
                    value={`http://localhost:3000/tracking-link?track=${params}`}
                    size={400}
                    bgColor={'#ffffff'}
                    fgColor={'#000000'}
                    level={'L'}
                    includeMargin={false}
                />
            </Grid>
        </div>
    );
};

export default TrackingQrcode;
