import { useEffect, useState } from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';

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

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <AllCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <WaitingCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <ProcessCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FinishCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={12}>
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
