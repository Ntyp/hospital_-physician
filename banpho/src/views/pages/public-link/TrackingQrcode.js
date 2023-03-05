import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, Box, Button } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrintIcon from '@mui/icons-material/Print';
import { style } from '@mui/system';

const TrackingQrcode = () => {
    const [url, setUrl] = useState(null);
    const [id, setId] = useState();
    const [isPrinting, setIsPrinting] = useState(false);
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

    const handlePrint = () => {
        setIsPrinting(true);
        window.print();
    };

    return (
        <div>
            <Grid sx={{ textAlign: 'center' }}>
                <Typography variant="h1" sx={{ marginBottom: '20px', marginTop: '20px' }}>
                    {params}
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
                <Typography variant="h2" sx={{ marginTop: '30px', marginBottom: '20px' }}>
                    โปรดแสกน QR CODE นี้เพื่ออัปเดตสถานะอุปกรณ์
                </Typography>

                <Box>
                    <Button
                        variant="contained"
                        onClick={handlePrint}
                        sx={{
                            display: 'block',
                            displayPrint: 'none',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#357a38',
                            '&:hover': {
                                backgroundColor: '#43a047'
                            }
                        }}
                    >
                        <PrintIcon sx={{ mr: '0.5rem' }} />
                        <Typography>พิมพ์เอกสาร</Typography>
                    </Button>
                </Box>
            </Grid>
        </div>
    );
};

export default TrackingQrcode;
