import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, Box, Button } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrintIcon from '@mui/icons-material/Print';
import logo from '../../../assets/images/logo.png';

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
                <img src={logo} alt="logo" style={{ width: 200, marginBottom: 20 }} />
                <p style={{ fontSize: '26px' }}>{params}</p>
                <p style={{ fontSize: '26px' }}>{value.tracking_hospital}</p>
                <QRCodeSVG
                    value={`http://localhost:3000/tracking-link?track=${params}`}
                    size={350}
                    bgColor={'#ffffff'}
                    fgColor={'#000000'}
                    level={'L'}
                    includeMargin={false}
                />
                <p style={{ fontSize: '26px', marginTop: '30px', marginBottom: '20px' }}>โปรดแสกน QR CODE นี้เพื่ออัปเดตสถานะ</p>
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
