import React, { useState, useEffect } from 'react';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
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
    Grid
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ErrorIcon from '@mui/icons-material/Error';

const Tracking = () => {
    const [user, setUser] = useState();
    const [rows, setRows] = useState([]);
    const [showItem, setShowItem] = useState([]);
    const [open, setOpen] = useState(false);
    const [openCheck, setOpenCheck] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [page, setPage] = useState(0);
    const [equipment, setEquipment] = useState([]);
    const [track, setTrack] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [history, setHistory] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [activeStepTracking, setActiveStepTracking] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        const storage = JSON.parse(userData);
        console.log('storage =>', storage);
        setUser(storage);
        getData(storage);
    }, []);

    function getData(value) {
        const id = value.user_id;
        axios
            .get(`http://localhost:7000/tracking/${id}`)
            .then((response) => {
                const value = response.data.data;
                setRows(
                    value.map((item, index) =>
                        createData(index + 1, item.date_at, item.group_id, item.tracking_sender, item.tracking_status)
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // สร้างข้อมูลที่นำมาจาก API
    function createData(date, code, status) {
        return { date, code, status };
    }

    // ปุ่มดวงตาสำหรับดูรายละเอียดแต่ละอัน
    const handleCheck = (row) => {
        const track = row.track;
        axios
            .get(`http://localhost:7000/tracking-data/${track}`)
            .then((response) => {
                console.log(response.data);
                setHistory(response.data.data[0]);
                let status = response.data.data[0].tracking_status;
                if (status == 'จัดส่งอุปกรณ์และเครื่องมือ') {
                    setActiveStepTracking(1);
                } else if (status == 'รอระบุวันนัดรับ') {
                    setActiveStepTracking(2);
                } else if (status == 'รับอุปกรณ์เรียบร้อย') {
                    setActiveStepTracking(3);
                } else if (status == 'เสร็จสิ้น') {
                    setActiveStepTracking(4);
                }
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .get(`http://localhost:7000/tracking-item/${track}`)
            .then((response) => {
                setShowItem(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });

        setOpenCheck(true);
    };

    const handleQrcode = (row) => {
        console.log('row =>', row);
        navigate('/tracking-qrcode', { state: { params: row.track } });
    };

    // เซตหัวข้อ columns
    const columns = [
        { id: 'order', label: 'ลำดับที่', minWidth: 100 },
        { id: 'date', label: 'วันที่ส่ง', minWidth: 100 },
        { id: 'track', label: 'รหัสชุด', minWidth: 100 },
        { id: 'sender', label: 'ผู้ส่ง', minWidth: 100 },
        { id: 'status', label: 'สถานะ', minWidth: 100 },
        {
            id: 'check',
            label: 'ตรวจสอบ',
            minWidth: 50,
            render: (row) => (
                <>
                    <IconButton aria-label="check" onClick={() => handleCheck(row)}>
                        <VisibilityRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="check" onClick={() => handleQrcode(row)}>
                        <QrCode2Icon />
                    </IconButton>
                </>
            )
        }
    ];

    const stepsTracking = [
        {
            label: 'จัดส่งอุปกรณ์และเครื่องมือ'
        },
        {
            label: 'รอระบุวันนัดรับ'
        },
        {
            label: 'รับอุปกรณ์เรียบร้อย'
        },
        {
            label: 'เสร็จสิ้น'
        }
    ];

    // นำค่าไปใส่ในตาราง
    function createData(order, date, track, sender, status) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return { order, date: formattedDate, track, sender, status };
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = () => {
        setOpen(true);
        randomTrack();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveForm = () => {
        axios
            .post('http://localhost:7000/create-tracking', {
                id: track,
                items: equipment,
                count: equipment.length,
                sender: user.user_firstname + ' ' + user.user_lastname,
                date: moment().format('YYYY-MM-DD'),
                user_id: user.user_id,
                hospital: user.hospital_id,
                place: user.user_place
            })
            .then(function (response) {
                console.log(response);
                const value = response.data;
                if (value.status == 'ok') {
                    getData(user);
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        setOpen(false);
        setActiveStep(0);
        setEquipment([]);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // prevent form submission
        const name = event.target.elements.name.value;
        const quantity = event.target.elements.quantity.value;

        // ถ้ามีชื่ออุปกรณ์และจำนวนส่งมา
        if (name && quantity) {
            const newEquipment = { name, quantity };
            setEquipment([...equipment, newEquipment]);

            // reset the form fields
            event.target.elements.name.value = '';
            event.target.elements.quantity.value = '';
        } else {
            // ไม่ทำอะไร
        }
    };

    const handleDeleteEquipment = (key) => {
        // Remove the item from the equipment array using its key value as the index
        setEquipment((prevEquipment) => prevEquipment.filter((item, index) => index !== key));
    };

    // สุ่ม Track
    const randomTrack = () => {
        var track = `BPTH-${user.hospital_id}${moment().format('YYYYMMDDHHmmss')}`;
        setTrack(track);
    };

    const handleClickOpenCheck = () => {
        setOpenCheck(true);
    };

    const handleCloseCheck = () => {
        setOpenCheck(false);
    };

    const handleNext = () => {
        if (equipment.length > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    return (
        <div>
            <Card sx={{ minWidth: 275, minHeight: '100vh' }}>
                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                    การนำส่งอุปกรณ์
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleClickOpen}
                    sx={{ float: 'right', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                    color="success"
                    startIcon={<AddCircleIcon />}
                >
                    นำส่งอุปกรณ์
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
                <Dialog maxWidth={'sm'} open={open} onClose={handleClose}>
                    <DialogTitle sx={{ backgroundColor: '#086c3c' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', color: '#fff' }}>
                            แบบฟอร์มการนำส่งอุปกรณ์-เครื่องมือการแพทย์
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ marginTop: 5 }}>
                        {activeStep === 0 && (
                            <form onSubmit={handleSubmit}>
                                <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                    ชื่ออุปกรณ์ - เครื่องมือการแพทย์
                                </Typography>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    type="text"
                                    fullWidth
                                    placeholder="กรุณาระบุชื่อของอุปกรณ์การแพทย์"
                                    variant="outlined"
                                    sx={{ marginTop: '20px', marginBottom: '10px' }}
                                />
                                <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                    จำนวนที่ต้องการส่ง
                                </Typography>
                                <TextField
                                    margin="dense"
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    fullWidth
                                    placeholder="กรุณาระบุจำนวน"
                                    variant="outlined"
                                    sx={{ marginTop: '20px', marginBottom: '10px' }}
                                />
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        type="submit"
                                        style={{ fontSize: '18px', borderRadius: 100 }}
                                    >
                                        เพิ่มรายการ
                                    </Button>
                                </Box>
                                {equipment.length > 0 ? (
                                    <>
                                        <div
                                            className="header-show-detail"
                                            style={{ backgroundColor: '#086c3c', padding: '15px', borderRadius: 100 }}
                                        >
                                            <Typography variant="h3" sx={{ fontWeight: 500, color: '#fff' }}>
                                                รายการทั้งหมด
                                            </Typography>
                                        </div>
                                        {equipment.map((item, key) => (
                                            <li key={key} style={{ listStyle: 'none', marginTop: 20 }}>
                                                <Grid container>
                                                    <Grid item xs={1} style={{ fontSize: '18px' }}>
                                                        {key + 1}.
                                                    </Grid>
                                                    <Grid item xs={5} style={{ fontSize: '18px' }}>
                                                        {item.name}
                                                    </Grid>
                                                    <Grid item xs={4} style={{ fontSize: '18px' }}>
                                                        จำนวน: {item.quantity}
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <IconButton onClick={() => handleDeleteEquipment(key)} color="error" size="small">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </li>
                                        ))}
                                    </>
                                ) : (
                                    ''
                                )}
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button variant="outlined" color="error" sx={{ borderRadius: 100 }} onClick={handleClose}>
                                        ย้อนกลับ
                                    </Button>
                                    {equipment.length > 0 ? (
                                        <Button
                                            type="submit"
                                            variant="outlined"
                                            color="success"
                                            sx={{ marginLeft: 3, borderRadius: 100 }}
                                            onClick={handleNext}
                                        >
                                            ต่อไป
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                </Box>
                            </form>
                        )}
                        {activeStep === 1 && (
                            <>
                                <Typography
                                    variant="h3"
                                    sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}
                                >
                                    รายการทั้งหมด
                                </Typography>
                                {equipment.map((item, key) => (
                                    <li style={{ fontSize: '18px', marginTop: '10px', listStyle: 'none' }} key={key}>
                                        <Grid container>
                                            <Grid item xs={1} style={{ fontSize: '18px' }}>
                                                {key + 1}.
                                            </Grid>
                                            <Grid item xs={5} style={{ fontSize: '18px' }}>
                                                {item.name}
                                            </Grid>
                                            <Grid item xs={4} style={{ fontSize: '18px' }}>
                                                จำนวน: {item.quantity}
                                            </Grid>
                                        </Grid>
                                    </li>
                                ))}
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button variant="outlined" color="error" sx={{ borderRadius: 100 }} onClick={handleBack}>
                                        ย้อนกลับ
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        sx={{ marginLeft: 3, borderRadius: 100 }}
                                        onClick={handleNext}
                                    >
                                        ต่อไป
                                    </Button>
                                </Box>
                            </>
                        )}
                        {activeStep === 2 && (
                            <>
                                <Box textAlign="center">
                                    <ErrorIcon sx={{ color: '#ff0c34', fontSize: 180 }} />
                                </Box>

                                <Typography
                                    variant="h3"
                                    sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#ff0c34' }}
                                >
                                    ยืนยันการส่งข้อมูล
                                </Typography>
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button variant="outlined" color="error" sx={{ borderRadius: 100 }} onClick={handleBack}>
                                        ย้อนกลับ
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        sx={{ marginLeft: 3, borderRadius: 100 }}
                                        onClick={handleSaveForm}
                                    >
                                        ยืนยัน
                                    </Button>
                                </Box>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={openCheck}
                    fullWidth={true}
                    maxWidth={'sm'}
                    onClose={handleCloseCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: '#086c3c' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500, color: '#fff' }}>
                            รายละเอียดการนำส่งอุปกรณ์-เครื่องมือการแพทย์
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <p style={{ fontSize: '18px', backgroundColor: '#f2f2f2', padding: 15 }}>ผู้ส่ง:{history.tracking_sender}</p>
                            <p style={{ fontSize: '18px', padding: 15 }}>รหัสชุด: {history.group_id}</p>
                            <p style={{ fontSize: '18px', backgroundColor: '#f2f2f2', padding: 15 }}>
                                วันที่ส่ง: {moment(history.date_at).format('YYYY-MM-DD')}
                            </p>
                            <p style={{ fontSize: '18px', padding: 15 }}>อุปกรณ์ที่ส่ง:</p>
                            <ol>
                                {showItem.map((item, key) => (
                                    <li style={{ fontSize: '18px' }} key={key}>
                                        {item.equipment_name} จำนวน: {item.equipment_quantity}
                                    </li>
                                ))}
                            </ol>
                            <p style={{ fontSize: '18px', backgroundColor: '#f2f2f2', padding: 15 }}>สถานะ: {history.tracking_status}</p>
                            {/* <Stepper activeStep={activeStepTracking} orientation="vertical">
                                {stepsTracking.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel>
                                            <p style={{ fontSize: '16px' }}>{step.label}</p>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper> */}
                            <Stepper activeStep={activeStepTracking} orientation="vertical" style={{ backgroundColor: 'white' }}>
                                {stepsTracking.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel
                                            style={{
                                                color: index === activeStepTracking ? '#086c3c' : 'gray',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {/* {index} , {activeStepTracking} */}
                                            {step.label}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCheck}>ปิด</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
    );
};

export default Tracking;
