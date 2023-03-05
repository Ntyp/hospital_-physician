import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import {
    TextField,
    Card,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    IconButton,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

const Documents = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [user, setUser] = useState([]);
    const [history, setHistory] = useState([]);
    const [openCheck, setOpenCheck] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        setUser(JSON.parse(userData));
        console.log(JSON.parse(userData));
        getData(JSON.parse(userData));
    }, []);

    function getData(value) {
        const id = value.hospital_id;
        axios
            .get(`http://localhost:7000/documents/${id}`)
            .then((response) => {
                console.log(response.data.data);
                let value = response.data.data;
                setRows(
                    value.map((item, index) =>
                        createData(
                            index + 1,
                            item.created_at,
                            item.document_title,
                            item.document_detail,
                            item.document_file,
                            item.created_by,
                            item.document_description,
                            item.document_status
                        )
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Define steps for the stepper
    const steps = ['ขั้นตอนที่ 1', 'ขั้นตอนที่ 2'];

    const handleDeleteEquipment = (row) => {
        // setHistory(row);
        console.log('row =>', row);
    };

    // const columns = [
    //     { id: 'order', label: 'ลำดับที่', minWidth: 100 },
    //     { id: 'date', label: 'วันที่ส่ง', minWidth: 100 },
    //     { id: 'topic', label: 'หัวข้อ', minWidth: 100 },
    //     { id: 'detail', label: 'รายละเอียด', minWidth: 100 },
    //     { id: 'documents', label: 'เอกสาร', minWidth: 100 },
    //     { id: 'reporter', label: 'ผู้รายงาน', minWidth: 100 },
    //     { id: 'description', label: 'ข้อเสนอแนะ', minWidth: 100 },
    //     { id: 'status', label: 'สถานะ', minWidth: 100 },
    //     {
    //         id: 'mange',
    //         label: 'การจัดการ',
    //         minWidth: 50,
    //         render: (row) => (
    //             <>
    //                 <IconButton aria-label="check" onClick={() => handleCheck(row)}>
    //                     <VisibilityRoundedIcon />
    //                 </IconButton>
    //                 <IconButton aria-label="delete" color="error" size="small" onClick={() => handleDeleteEquipment(row)}>
    //                     <DeleteIcon />
    //                 </IconButton>
    //             </>
    //         )
    //     }
    // ];

    const columns = [
        { id: 'order', label: 'ลำดับที่', minWidth: 100 },
        { id: 'date', label: 'วันที่ส่ง', minWidth: 100 },
        { id: 'topic', label: 'หัวข้อ', minWidth: 100 },
        { id: 'detail', label: 'รายละเอียด', minWidth: 100 },
        { id: 'documents', label: 'เอกสาร', minWidth: 100 },
        { id: 'reporter', label: 'ผู้รายงาน', minWidth: 100 },
        { id: 'description', label: 'ข้อเสนอแนะ', minWidth: 100 },
        {
            id: 'status',
            label: 'สถานะ',
            minWidth: 100,
            render: (row) => {
                switch (row.status) {
                    case 0:
                        return 'กำลังดำเนินการ';
                    case 1:
                        return 'อนุมัติ';
                    case 2:
                        return 'ไม่อนุมัติ';
                    default:
                        return '';
                }
            }
        },
        {
            id: 'mange',
            label: 'การจัดการ',
            minWidth: 50,
            render: (row) => (
                <>
                    <IconButton aria-label="check" onClick={() => handleCheck(row)}>
                        <VisibilityRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="error" size="small" onClick={() => handleDeleteEquipment(row)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ];

    function createData(order, date, topic, detail, documents, reporter, description, status) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return { order, date: formattedDate, topic, detail, documents, reporter, description, status };
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // prevent form submission
        const name = event.target.elements.name.value;
        const detail = event.target.elements.detail.value;
        const file = selectedFile.name;
        // ถ้ามีชื่ออุปกรณ์และจำนวนส่งมา
        if (name && file) {
            const newValue = { name, detail, file };
            setValue([...value, newValue]);
            axios
                .post('http://localhost:7000/document', {
                    topic: name,
                    detail: detail,
                    file: file,
                    name: user.user_firstname + ' ' + user.user_lastname,
                    user_id: user.user_id
                })
                .then(function (response) {
                    const value = response.data;
                    if (value.status == 'ok') {
                        //
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        event.target.elements.name.value = '';
        event.target.elements.detail.value = '';
        setSelectedFile(null);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleEdit = (row) => {
        // Implement the edit logic
    };

    const handleDelete = (row) => {
        console.log('row');
        // axios
        //     .post('http://localhost:7000/document', {
        //         topic: name,
        //     })
        //     .then(function (response) {
        //         const value = response.data;
        //         if (value.status == 'ok') {
        //             //
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedFile(null);
        setValue([]);
        setOpen(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleNext = (event) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = (event) => {
        setSelectedFile(null);
        setValue([]);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSaveForm = () => {
        console.log('save');
        console.log(value);
        setOpen(false);
        setActiveStep(0);
        setValue([]);
    };

    const handleCheck = (row) => {
        setHistory(row);
        console.log('row =>', row);
        setOpenCheck(true);
    };

    const handleCloseCheck = () => {
        setOpenCheck(false);
    };

    return (
        <div>
            <Card sx={{ minWidth: 275, minHeight: 625 }}>
                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                    การนำส่งเอกสาร
                </Typography>
                <Button
                    variant="contained"
                    sx={{ float: 'right', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                    onClick={handleClickOpen}
                >
                    เพิ่มรายงาน
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
                    <Button variant="contained" sx={{ float: 'left', marginBottom: '20px' }}>
                        Export
                    </Button>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
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

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        <Typography variant="h3" sx={{ fontWeight: 500 }}>
                            แบบฟอร์มอุปกรณ์การแพทย์
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === 0 && (
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    label="ชื่อหัวข้อ"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    margin="dense"
                                    id="detail"
                                    name="detail"
                                    label="รายละเอียด"
                                    multiline
                                    rows={4}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                />
                                <p>
                                    อัพโหลดไฟล์:
                                    {selectedFile ? <span> {selectedFile.name}</span> : <span>No file selected</span>}
                                    {selectedFile ? (
                                        ''
                                    ) : (
                                        <Button variant="contained" component="label" sx={{ marginLeft: '20px' }}>
                                            แนบไฟล์
                                            <input type="file" id="file" name="file" hidden onChange={handleFileChange} />
                                        </Button>
                                    )}
                                </p>
                                {/* <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button type="submit">เพิ่มรายการ</Button>
                                </Box> */}
                                {equipment.length > 0 ? (
                                    <>
                                        <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                            รายการทั้งหมด
                                        </Typography>
                                        <ol>
                                            {equipment.map((item, key) => (
                                                <li key={key}>
                                                    {item.name} จำนวน: {item.detail} file: {item.file}
                                                    {/* <button onClick={() => handleDeleteEquipment(key)}>ลบ</button> */}
                                                    <IconButton onClick={() => handleDeleteEquipment(key)} color="error" size="small">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </li>
                                            ))}
                                        </ol>
                                    </>
                                ) : (
                                    ''
                                )}
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button onClick={handleClose}>ย้อนกลับ</Button>
                                    <Button type="submit">ต่อไป</Button>
                                </Box>
                            </form>
                        )}
                        {activeStep === 1 && (
                            <>
                                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                                    รายการทั้งหมด
                                </Typography>
                                {value.map((item, key) => (
                                    <div key={key}>
                                        <p>ชื่อหัวข้อ: {item.name}</p>
                                        <p>รายละเอียด: {item.detail}</p>
                                        <p>อัพโหลดไฟล์: {item.file}</p>
                                    </div>
                                ))}
                                <DialogActions>
                                    <Button onClick={handleBack}>ย้อนกลับ</Button>
                                    <Button onClick={handleSaveForm}>ยืนยัน</Button>
                                </DialogActions>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={openCheck}
                    onClose={handleCloseCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps
                            are running.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCheck}>Disagree</Button>
                        <Button onClick={handleCloseCheck}>Agree</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
    );
};

export default Documents;
