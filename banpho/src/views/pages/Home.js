import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
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

const theme = createTheme();

const Home = () => {
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
                </Grid>
                <Grid xs={6} sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                        ระบบจัดการงานสารบรรณ
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default Home;
