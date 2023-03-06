import { useEffect, useState } from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';

import AllCard from './components/Documents/AllCard';
import FinishCard from './components/Documents/FinishCard';
import ProcessCard from './components/Documents/ProcressCard';
import WaitingCard from './components/Documents/WaitingCard';
import TotalGrowthBarChart from './components/Documents/TotalGrowthBarChart';
import { gridSpacing } from '../../../store/constant';

const DashboardDocument = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <AllCard isLoading={isLoading} />
                    </Grid>
                    {/* <Grid item lg={4} md={4} sm={4} xs={12}>
                        <WaitingCard isLoading={isLoading} />
                    </Grid> */}
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <ProcessCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
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

export default DashboardDocument;
