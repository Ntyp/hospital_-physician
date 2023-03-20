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

const Users = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [firstanme, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [role, setRole] = useState();
    const [hospital, setHospital] = useState();
    const [listHospital, setListHospital] = useState();
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

    const changeRole = (event) => {
        console.log(event.target.value);
        setRole(event.target.value);
    };

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
        getHospital();
    }, []);

    const getData = () => {
        axios
            .get(`http://localhost:7000/users`)
            .then((response) => {
                const value = response?.data;
                setRows(
                    value.map((item, index) =>
                        createData(index + 1, item.user_firstname + ' ' + item.user_lastname, item.user_position, item.user_place)
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const getHospital = () => {
        axios
            .get(`http://localhost:7000/hospital`)
            .then((response) => {
                const value = response?.data;
                console.log(value);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const columns = [
        { id: 'order', label: 'ลำดับที่', minWidth: 30 },
        { id: 'name', label: 'ชื่อ-นามสกุล', minWidth: 100 },
        { id: 'role', label: 'ตำแหน่ง', minWidth: 100 },
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

    function createData(order, name, role, hospital) {
        return { order, name, role, hospital };
    }

    return (
        <Card sx={{ minWidth: 275, minHeight: '100vh' }}>
            <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                จัดการสมาชิก
            </Typography>
            <Button
                variant="outlined"
                onClick={handleOpen}
                sx={{ float: 'right', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                color="success"
                startIcon={<AddCircleIcon />}
            >
                เพิ่มสมาชิก
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
                        เพิ่มสมาชิก
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container sx={{ marginTop: 5 }}>
                            <Grid xs={3} sx={{ alignSelf: 'center' }}>
                                <Typography sx={{ fontSize: '18px' }}>ชื่อสมาชิก</Typography>
                            </Grid>
                            <Grid xs={9}>
                                <TextField fullWidth placeholder="กรุณาระบุ" variant="outlined" />
                            </Grid>
                        </Grid>
                        <Grid container sx={{ marginTop: 5 }}>
                            <Grid xs={3} sx={{ alignSelf: 'center' }}>
                                <Typography sx={{ fontSize: '18px' }}>รหัสผ่าน</Typography>
                            </Grid>
                            <Grid xs={9}>
                                <TextField fullWidth placeholder="กรุณาระบุ" variant="outlined" />
                            </Grid>
                        </Grid>
                        <Grid container sx={{ marginTop: 5 }}>
                            <Grid xs={3} sx={{ alignSelf: 'center' }}>
                                <Typography sx={{ fontSize: '18px' }}>ชื่อ</Typography>
                            </Grid>
                            <Grid xs={9}>
                                <TextField fullWidth placeholder="กรุณาระบุ" variant="outlined" />
                            </Grid>
                        </Grid>
                        <Grid container sx={{ marginTop: 5 }}>
                            <Grid xs={3} sx={{ alignSelf: 'center' }}>
                                <Typography sx={{ fontSize: '18px' }}>นามสกุล</Typography>
                            </Grid>
                            <Grid xs={9}>
                                <TextField fullWidth placeholder="กรุณาระบุ" variant="outlined" />
                            </Grid>
                        </Grid>
                        <Grid container sx={{ marginTop: 5 }}>
                            <Grid xs={3} sx={{ alignSelf: 'center' }}>
                                <Typography sx={{ fontSize: '18px' }}>ตำแหน่ง</Typography>
                            </Grid>
                            <Grid xs={9}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={role}
                                    onChange={changeRole}
                                    fullWidth
                                >
                                    <MenuItem value={1}>เจ้าหน้าที่โรงพยาบาล</MenuItem>
                                    <MenuItem value={2}>ผู้อำนวยการโรงพยาบาล</MenuItem>
                                    <MenuItem value={3}>เจ้าหน้าที่สาธารณสุข</MenuItem>
                                    <MenuItem value={4}>ผู้ช่วยสาธารณสุข</MenuItem>
                                    <MenuItem value={5}>ผู้อำนวยการสาธารณสุข</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        {/* {(role = 1 | 2 ? 'สวัสดี' : 'อิอิ')} */}
                        <Grid container sx={{ marginTop: 5 }}>
                            <Grid xs={3} sx={{ alignSelf: 'center' }}>
                                <Typography sx={{ fontSize: '18px' }}>โรงพยาบาล</Typography>
                            </Grid>
                            <Grid xs={9}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={role}
                                    // onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value={1}>Ten</MenuItem>
                                    <MenuItem value={2}>Twenty</MenuItem>
                                    <MenuItem value={3}>Thirty</MenuItem>
                                </Select>
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

export default Users;
