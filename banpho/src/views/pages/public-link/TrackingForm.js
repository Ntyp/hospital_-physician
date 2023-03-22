import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Grid,
    Typography,
    Container,
    Box,
    Link,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemIcon
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment/moment';
import axios from 'axios';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const theme = createTheme();

const TrackingForm = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const track = searchParams.get('track');
    const [data, setData] = useState();
    const [recipient, setRecipient] = useState();
    const [date, setDate] = useState();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPickup, setOpenPickup] = useState(false);
    const [status, setStatus] = useState();
    const navigate = useNavigate();
    const [meetDate, setMeetDate] = useState();
    useEffect(() => {
        axios
            .get(`http://localhost:7000/tracking-data/${track}`)
            .then((response) => {
                console.log(response.data.data[0]);
                const value = response?.data?.data[0];
                setData(value);
                setStatus(value.tracking_status);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const styles = {
        fontFamily: 'Kanit, sans-serif'
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const recipient = event.target.elements.recipient.value;
        const date = event.target.elements.date.value;
        setRecipient(recipient);
        setDate(date);
        setOpenConfirm(true);
    };

    const handlePickup = (event) => {
        event.preventDefault();
        const date = event.target.elements.date.value;
        setDate(date);
        setOpenPickup(true);
    };

    const handleClosePickup = () => {
        setOpenPickup(false);
    };

    const handleGetBack = (event) => {
        axios
            .put(`http://localhost:7000/tracking-back/${track}`)
            .then(function (response) {
                window.open('about:blank', '_self');
                window.close();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleClickOpen = () => {
        setOpenConfirm(true);
    };

    const handleClose = () => {
        setOpenConfirm(false);
    };

    const handleAccept = () => {
        if (date) {
            axios
                .put(`http://localhost:7000/tracking/${track}`, {
                    recipient: recipient,
                    date: date
                })
                .then(function (response) {
                    if (response.status == 'ok') {
                        setOpenConfirm(false);
                        console.log('hello');
                        window.open('about:blank', '_self');
                        window.close();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            axios
                .put(`http://localhost:7000/tracking/${track}`, {
                    recipient: recipient,
                    date: null
                })
                .then(function (response) {
                    if (response.status == 'ok') {
                        setOpenConfirm(false);
                        window.open('about:blank', '_self');
                        window.close();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    const handleAcceptPickup = () => {
        axios
            .put(`http://localhost:7000/tracking-date/${track}`, {
                date: date
            })
            .then(function (response) {
                console.log('response =>', response);
                if (response.status == 'ok') {
                    setOpenPickup(false);
                    console.log('hello');
                    window.open('about:blank', '_self');
                    window.close();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return status == 'จัดส่งอุปกรณ์และเครื่องมือ' ? (
        <ThemeProvider theme={styles}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <img src={logo} alt="logo" style={{ width: 200, marginBottom: 20 }} />

                    <p style={{ fontSize: '26px' }}>ยืนยันสถานะการรับอุปกรณ์</p>
                    <p style={{ fontSize: '18px', textAlign: 'center' }}>{data.tracking_hospital}</p>
                    <p style={{ fontSize: '18px' }}>{track}</p>

                    <form onSubmit={handleSubmit}>
                        <Box>
                            <TextField
                                sx={{ mt: 2 }}
                                margin="normal"
                                required
                                fullWidth
                                id="recipient"
                                label="ชื่อผู้รับ"
                                name="recipient"
                                color="success"
                            />
                            <TextField
                                id="date"
                                name="date"
                                label="วันนัดรับอุปกรณ์"
                                type="date"
                                color="success"
                                fullWidth
                                sx={{ mt: 2 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <p style={{ color: '#dd2c00' }}>* หากยังไม่สามารถระบุวันที่นัดรับได้กรุณาเว้นว่าง</p>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    backgroundColor: '#357a38',
                                    '&:hover': {
                                        backgroundColor: '#43a047'
                                    }
                                }}
                            >
                                ยืนยันการรับอุปกรณ์
                            </Button>
                        </Box>
                    </form>
                </Box>
                <Dialog
                    fullWidth={true}
                    maxWidth={'sm'}
                    open={openConfirm}
                    onClose={handleClose}
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <Box textAlign="center">
                            <CheckCircleOutlineOutlinedIcon sx={{ color: '#357a38', fontSize: 180 }} />
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#357a38' }}
                        >
                            ยืนยันการรับอุปกรณ์
                        </Typography>
                        <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                            <Button variant="outlined" color="error" sx={{ borderRadius: 100 }} onClick={handleClose}>
                                ย้อนกลับ
                            </Button>
                            <Button variant="outlined" color="success" sx={{ marginLeft: 3, borderRadius: 100 }} onClick={handleAccept}>
                                ยืนยัน
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
                ;
            </Container>
        </ThemeProvider>
    ) : status === 'รอระบุวันนัดรับ' ? (
        <ThemeProvider theme={styles}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <img src={logo} alt="logo" style={{ width: 200, marginBottom: 20 }} />

                    <p style={{ fontSize: '26px' }}>ยืนยันวันนัดรับอุปกรณ์</p>
                    <p style={{ fontSize: '18px', textAlign: 'center' }}>{data.tracking_hospital}</p>
                    <p style={{ fontSize: '18px' }}>{track}</p>

                    <form onSubmit={handlePickup}>
                        <Box>
                            <TextField
                                id="date"
                                name="date"
                                label="วันนัดรับอุปกรณ์"
                                type="date"
                                color="success"
                                fullWidth
                                sx={{ mt: 2 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#357a38',
                                    '&:hover': {
                                        backgroundColor: '#43a047'
                                    }
                                }}
                            >
                                ยืนยันวันนัดรับอุปกรณ์
                            </Button>
                        </Box>
                    </form>
                </Box>
                <Dialog
                    fullWidth={true}
                    maxWidth={'sm'}
                    open={openPickup}
                    onClose={handleClosePickup}
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <Box textAlign="center">
                            <CheckCircleOutlineOutlinedIcon sx={{ color: '#357a38', fontSize: 180 }} />
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#357a38' }}
                        >
                            ยืนยันวันนัดรับอุปกรณ์คืน
                        </Typography>
                        <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                            <Button variant="outlined" color="error" sx={{ borderRadius: 100 }} onClick={handleClosePickup}>
                                ย้อนกลับ
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                sx={{ marginLeft: 3, borderRadius: 100 }}
                                onClick={handleAcceptPickup}
                            >
                                ยืนยัน
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
                ;
            </Container>
        </ThemeProvider>
    ) : (
        <ThemeProvider theme={styles}>
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
                    <img src={logo} alt="logo" style={{ width: 200, marginBottom: 20 }} />
                    <p style={{ fontSize: '26px' }}>ยืนยันการรับคืน</p>
                    {/* <p style={{ fontSize: '18px', textAlign: 'center' }}>{data.tracking_hospital}</p> */}
                    <p style={{ fontSize: '18px' }}>{track}</p>
                    <Box sx={{ mt: 1 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
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
                            onClick={handleGetBack}
                        >
                            เสร็จสิ้นกระบวนการส่งอุปกรณ์ไปฆ่าเชื้อ
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default TrackingForm;
