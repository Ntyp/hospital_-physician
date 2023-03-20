import { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { Grid, Typography, Card } from '@mui/material';

import AllCard from './components/Tracking/AllCard';
import FinishCard from './components/Tracking/FinishCard';
import ProcessCard from './components/Tracking/ProcressCard';
import WaitingCard from './components/Tracking/WaitingCard';
import TotalGrowthBarChart from './components/Tracking/TotalGrowthBarChart';
import { gridSpacing } from '../../../store/constant';

const DashboardTracking = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    function getProcess(value) {
        const hospital_id = value.hospital_id;

        axios
            .get(`http://localhost:7000/documents-process/${hospital_id}`)
            .then((response) => {
                let count = response.data.data[0].COUNT;
                setCount(count);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        {/* <Card sx={{ backgroundColor: '#e8fcd4', padding: 10 }}>
                                <Typography variant="h3">อุปกรณ์ที่ส่งไปฆ่าเชื้อทั้งหมด</Typography>
                                <Typography variant="h3">0 รายการ</Typography>
                            </Card> */}
                        <AllCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        {/* <Card sx={{ backgroundColor: '#fffc84' }}>
                                <Typography variant="h3">จัดส่งอุปกรณ์การแพทย์</Typography>
                            </Card> */}
                        <WaitingCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        {/* <Card sx={{ backgroundColor: '#c8fcfc' }}>
                                <Typography>อุปกรณ์ที่ยังไม่ได้รับคืน</Typography>
                            </Card> */}
                        <FinishCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={12}>
                        <div className="" style={{ padding: 10 }}></div>
                        <Typography variant="h2" sx={{ marginBottom: '20px' }}>
                            ข้อมูลการส่งในแต่ละวันหรืออาทิตย์หรือเดือน
                        </Typography>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DashboardTracking;
