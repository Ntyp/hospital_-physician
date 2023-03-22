import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import menuLeft from '../../assets/images/336597097_178106335011664_970700067564541146_n.png';
import menuRight from '../../assets/images/336601094_207769731901640_4066615954395778442_n.png';
import {
    createTheme,
    ThemeProvider,
    makeStyles,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Paper,
    Box,
    Grid,
    Typography,
    Alert
} from '@mui/material';
import { textAlign } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

const Home = () => {
    const navigate = useNavigate();

    const handleMenuLeft = () => {
        navigate('/notification');
    };

    const handleMenuRight = () => {
        navigate('/notification');
    };

    return (
        <div>
            {/* <img src={logo} style={{ width: 200, marginBottom: 20 }} /> */}
            <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                ระบบสารสนเทศเพื่อสนับสนุนการปฏิบัติงาน สำนักงานสาธารณสุขอำเภอบ้านโพธิ์จังหวัดฉะเชิงเทรา
            </Typography>
            <Grid container>
                <Grid xs={6} sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                        ระบบติดตามอุปกรณ์ - เครื่องมือการแพทย์
                    </Typography>
                    <img src={menuLeft} alt="logoLogin" style={{ width: 600, marginBottom: 20 }} />
                </Grid>
                <Grid xs={6} sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                        ระบบจัดการงานสารบรรณ
                    </Typography>
                    <img src={menuRight} alt="logoLogin" style={{ width: 600, marginBottom: 20 }} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Home;
