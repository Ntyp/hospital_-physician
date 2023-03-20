import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Button,
    Modal,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';

const Hospital = () => {
    const [hospital, setHospital] = useState();
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [openCreate, setOpenCreate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleOpen = () => {
        setOpenCreate(true);
    };

    const handleClose = () => {
        setOpenCreate(false);
    };

    const handleCreate = () => {};

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Delete
    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios
            .get(`http://localhost:7000/hospital`)
            .then((response) => {
                const value = response?.data;
                console.log(value);
                setRows(value.map((item, index) => createData(index + 1, item.hospital_name)));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const columns = [
        { id: 'order', label: 'ลำดับที่', maxWidth: 30 },
        { id: 'hospital', label: 'โรงพยาบาล', minWidth: 100 },
        {
            id: 'mange',
            label: 'จัดการ',
            minWidth: 50,
            render: (row) => (
                <IconButton aria-label="check" color="error" onClick={() => handleOpenDelete(row)}>
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    function createData(order, hospital) {
        return { order, hospital };
    }

    return (
        <Card sx={{ minWidth: 275, minHeight: '100vh' }}>
            <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                จัดการโรงพยาบาล
            </Typography>
            <Button
                variant="outlined"
                onClick={handleOpen}
                sx={{ float: 'right', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                color="success"
                startIcon={<AddCircleIcon />}
            >
                เพิ่มโรงพยาบาล
            </Button>

            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '30px'
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align="center" style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.order}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align="center">
                                            {column.render ? column.render(row) : row[column.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog
                open={openCreate}
                fullWidth={true}
                maxWidth={'sm'}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: '#086c3c' }}>
                    <Typography variant="h3" sx={{ fontWeight: 500, color: '#fff' }}>
                        เพิ่มโรงพยาบาล
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container sx={{ marginTop: 5 }}>
                            <Grid xs={3} sx={{ alignSelf: 'center' }}>
                                <Typography sx={{ alignSelf: 'center', fontSize: '18px' }}>ชื่อโรงพยาบาล</Typography>
                            </Grid>
                            <Grid xs={9}>
                                <TextField fullWidth placeholder="กรุณาระบุ" variant="outlined" />
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        ปิด
                    </Button>
                    <Button variant="outlined" color="success" onClick={handleClose}>
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDelete}
                fullWidth={true}
                maxWidth={'sm'}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box textAlign="center">
                            <ErrorIcon sx={{ color: '#ff0c34', fontSize: 180 }} />
                        </Box>
                        <Typography
                            variant="h3"
                            sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#ff0c34' }}
                        >
                            ยืนยันการลบข้อมูล
                        </Typography>
                        <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                            <Button variant="outlined" color="error" sx={{ borderRadius: 100 }} onClick={handleCloseDelete}>
                                ย้อนกลับ
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                sx={{ marginLeft: 3, borderRadius: 100 }}
                                onClick={handleCloseDelete}
                            >
                                ยืนยัน
                            </Button>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default Hospital;
