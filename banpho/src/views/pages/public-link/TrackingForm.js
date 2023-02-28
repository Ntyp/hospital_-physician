import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Grid, Typography, Container, Box, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment/moment';
import axios from 'axios';

const theme = createTheme();

const TrackingForm = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const track = searchParams.get('track');
    const [data, setData] = useState();
    const [status, setStatus] = useState();
    useEffect(() => {
        axios
            .get(`http://localhost:7000/tracking-data/${track}`)
            .then((response) => {
                console.log(response.data.data[0]);
                const value = response.data.data[0];
                setData(value);
                setStatus(value.tracking_status);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    const navigate = useNavigate();
    const [meetDate, setMeetDate] = useState();

    const handleSubmit = (event) => {
        event.preventDefault();
        const recipient = event.target.elements.recipient.value;
        const date = event.target.elements.date.value;
        axios
            .put(`http://localhost:7000/tracking/${track}`, {
                recipient: recipient,
                date: date
            })
            .then(function (response) {
                if (response.status == 'ok') {
                    navigate('/success');
                    console.log('OK');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleGetBack = (event) => {
        console.log(track);
        axios
            .put(`http://localhost:7000/tracking-back/${track}`)
            .then(function (response) {
                navigate('/success');
                console.log('OK');
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return status == 'จัดส่งอุปกรณ์และเครื่องมือ' ? (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        หมายเลข:{track}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mt: 1 }}>
                            <TextField margin="normal" required fullWidth id="recipient" label="ชื่อผู้รับ" name="recipient" />
                            <TextField id="date" type="date" disablePast={true} required fullWidth />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                ยืนยันการรับ
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    ) : (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        หมายเลข:{track}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleGetBack}>
                            ยืนยันการรับคืน
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default TrackingForm;
