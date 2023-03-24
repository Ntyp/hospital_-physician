import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import fileDownload from 'js-file-download';
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
    StepLabel,
    StepContent,
    Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { FileDownload } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';

const Documents = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [user, setUser] = useState([]);
    const [history, setHistory] = useState([]);
    const [openCheck, setOpenCheck] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [track, setTrack] = useState(null);
    const [data, getFile] = useState({ name: '', path: '' });
    const [checkFile, setCheckFile] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [filePath, setFilePath] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [editCode, setEditCode] = useState('');
    const [statusDoc, setStatusDoc] = useState('');

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
                            item.document_code,
                            item.document_title,
                            item.document_detail,
                            // item.document_file,
                            item.document_file_path,
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
    const [activeStepDoc, setActiveStepDoc] = useState(0);

    const stepsDocuments = [
        {
            label: 'ผู้อำนวยการโรงพยาบาล',
            description: ''
        },
        {
            label: 'เจ้าหน้าที่สาธารณสุขอำเภอบ้านโพธิ์',
            description: ''
        },
        {
            label: 'ผู้ช่วยสาธารณสุขอำเภอบ้านโพธิ์',
            description: ``
        },
        {
            label: 'สาธารณสุขอำเภอบ้านโพธิ์',
            description: ``
        }
    ];

    const handleNextDoc = () => {
        setActiveStepDoc((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBacktDoc = () => {
        setActiveStepDoc((prevActiveStep) => prevActiveStep - 1);
    };

    const handleResetDoc = () => {
        setActiveStepDoc(0);
    };

    // เปิด Dialog การลบ
    const handleDeleteDocument = (row) => {
        // setHistory(row);
        setOpenDelete(true);
        console.log('row =>', row);
        setDeleteId(row.code);
    };
    // ยืนยันการลบ
    const handleDelete = () => {
        let id = deleteId;
        axios
            .delete(`http://localhost:7000/document/${id}`)
            .then((response) => {
                setDeleteId(null);
                setOpenDelete(false);
                getData(user);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // ปิด Dialog การลบ
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setDeleteId(null);
    };
    const handleDownloadFile = (event) => {
        event.preventDefault();
        console.log('event =>', event);
    };
    const columns = [
        { id: 'order', label: 'ลำดับที่', minWidth: 100 },
        { id: 'date', label: 'วันที่ส่ง', minWidth: 100 },
        { id: 'code', label: 'รหัส', minWidth: 100 },
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
                        return 'รอการแก้ไข';
                    case 1:
                        return 'รอการตรวจสอบ(ผู้อำนวยการโรงพยาบาล)';
                    case 2:
                        return 'รอการตรวจสอบ(เจ้าหน้าที่สาธารณสุข)';
                    case 3:
                        return 'รอการตรวจสอบ(ผู้ช่วยสาธารณสุข)';
                    case 4:
                        return 'รอการตรวจสอบ(สาธารณสุขอำเภอบ้านโพธิ์)';
                    case 5:
                        return 'เสร็จสิ้น';
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
                    {/* แก้ไขเมื่อstatus = 0, ลบเมื่อstatus = 1 */}
                    <IconButton aria-label="check" onClick={() => handleCheck(row)}>
                        <VisibilityRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => handleOpenEdit(row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="error" size="small" onClick={() => handleDeleteDocument(row)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ];

    function createData(order, date, code, topic, detail, documents, reporter, description, status) {
        const formattedDate = `${moment(date).format('YYYY-MM-DD')}`;
        const downloadLink = documents ? (
            <a href="" onClick={handleDownloadFile}>
                เอกสาร
            </a>
        ) : (
            ''
        );
        return { order, date: formattedDate, code, topic, detail, documents: downloadLink, reporter, description, status };
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // prevent form submission
        const name = event.target.elements.name.value;
        const detail = event.target.elements.detail.value;
        const file = fileName;
        // ถ้ามีชื่ออุปกรณ์และจำนวนส่งมา
        if (name && file) {
            const newValue = { name, detail, file };
            setValue([...value, newValue]);
        }
        event.target.elements.name.value = '';
        event.target.elements.detail.value = '';
        // setFile(null);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // Edit
    const handleOpenEdit = (row) => {
        console.log('row', row);
        let code = row.code;
        setEditCode(code);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setEditCode(null);
    };
    const handleSubmitEdit = (event) => {
        event.preventDefault(); // prevent form submission
        const code = editCode;
        const name = event.target.elements.name.value;
        const detail = event.target.elements.detail.value;
        const file = fileName;
        // ถ้ามีชื่ออุปกรณ์และจำนวนส่งมา
        if (name && file) {
            const newValue = { code, name, detail, file };
            setValue([...value, newValue]);
        }
        event.target.elements.name.value = '';
        event.target.elements.detail.value = '';
        // setFile(null);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleEdit = (row) => {
        // Implement the edit logic
    };

    const handleSaveFormEdit = () => {
        let id = editCode; // เลข Track ที่นำมา Update
        axios
            .put(`http://localhost:7000/document/${id}`, {
                title: value[0].name,
                detail: value[0].detail,
                file: fileName,
                filePath: filePath,
                name: user.user_firstname + ' ' + user.user_lastname,
                hospital: user.hospital_id,
                user_id: user.user_id
            })
            .then(function (response) {
                const value = response.data;
                getData(user);
            })
            .catch(function (error) {
                console.log(error);
            });
        setOpenEdit(false);
        setEditCode(null);
        setActiveStep(0);
        setValue([]);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setFile(null);
        setFileName(null);
        setFilePath(null);
        setValue([]);
        setOpen(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };

    const uploadFile = async (e) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        try {
            const res = await axios.post('http://localhost:7000/upload', formData);
            console.log(res);
            setFileName(res.data.name);
            setFilePath(res.data.path);
            setCheckFile(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleNext = (event) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = (event) => {
        setFile(null);
        setFileName(null);
        setValue([]);
        setOpen(false);
    };

    const handleSaveForm = () => {
        let track = `DOC-${user.hospital_id}${moment().format('YYYYMMDDHHmmss')}`;
        axios
            .post('http://localhost:7000/document', {
                code: track,
                title: value[0].name,
                detail: value[0].detail,
                file: fileName,
                filePath: filePath,
                name: user.user_firstname + ' ' + user.user_lastname,
                hospital: user.hospital_id,
                user_id: user.user_id
            })
            .then(function (response) {
                const value = response.data;
                getData(user);
            })
            .catch(function (error) {
                console.log(error);
            });
        setOpen(false);
        setActiveStep(0);
        setValue([]);
    };

    const handleCheck = (row) => {
        setHistory(row);
        console.log('row =>', row);
        let status = row.status;
        setActiveStepDoc(status - 1);
        setStatusDoc(status);
        // setActiveStepDoc;
        // console.log(status);
        // console.log('activeStepDoc =>', activeStepDoc);
        // setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setOpenCheck(true);
    };

    const handleCloseCheck = () => {
        setOpenCheck(false);
        setStatusDoc(null);
    };

    const checkStep = () => {
        // setActiveStepDoc((prevActiveStep) => prevActiveStep + 1);
        //
    };

    // Confirm delete
    const handleOpenDelete = () => {};

    const checkStepDocument = (value) => {
        let step = value;
        // setActiveStepDoc((prevActiveStep) => prevActiveStep + 1);
    };

    return (
        <div>
            <Card sx={{ minWidth: 275, minHeight: '100vh' }}>
                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                    การนำส่งเอกสาร
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleClickOpen}
                    sx={{ float: 'right', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                    color="success"
                    startIcon={<AddCircleIcon />}
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
                <Dialog maxWidth={'sm'} fullWidth={true} open={open} onClose={handleClose}>
                    <DialogTitle sx={{ backgroundColor: '#086c3c' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500, color: '#fff' }}>
                            แบบฟอร์มการส่งเอกสาร
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {activeStep === 0 && (
                            <form onSubmit={handleSubmit}>
                                <Typography sx={{ marginTop: 5, fontSize: '16px' }}>ชื่อหัวข้อ</Typography>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    placeholder="ระบุหัวข้อของเอกสาร"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                />
                                <Typography sx={{ marginTop: 3, fontSize: '16px', display: 'inline-block' }}>
                                    รายละเอียด{' '}
                                    <Typography sx={{ color: '#ff0c34', fontSize: '16px', display: 'inline-block' }}>(*ถ้ามี)</Typography>
                                </Typography>

                                <TextField
                                    margin="dense"
                                    id="detail"
                                    name="detail"
                                    placeholder="ระบุรายละเอียด"
                                    multiline
                                    rows={4}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginTop: 2 }}
                                />
                                <p>
                                    แนบไฟล์เอกสาร:
                                    {file ? <span> {file.name}</span> : <span> No file selected</span>}
                                    {file ? (
                                        ''
                                    ) : (
                                        <Button variant="contained" component="label" sx={{ marginLeft: '20px' }}>
                                            เลือกไฟล์เอกสาร
                                            <input type="file" id="file" name="file" hidden onChange={handleFileChange} />
                                        </Button>
                                    )}
                                    {file ? (
                                        <Button variant="contained" component="label" sx={{ marginLeft: '20px' }} onClick={uploadFile}>
                                            อัพโหลดไฟล์เอกสาร
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                </p>
                                {equipment.length > 0 ? (
                                    <>
                                        <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                            รายการทั้งหมด
                                        </Typography>
                                        <ol>
                                            {equipment.map((item, key) => (
                                                <li key={key}>
                                                    {item.name} จำนวน: {item.detail} file: {item.file}
                                                    <IconButton onClick={() => handleDeleteDocument(key)} color="error" size="small">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </li>
                                            ))}
                                        </ol>
                                    </>
                                ) : (
                                    ''
                                )}
                                {checkFile ? (
                                    <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                        <Button variant="outlined" color="error" onClick={handleClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button variant="outlined" color="success" sx={{ marginLeft: 3 }} type="submit">
                                            ต่อไป
                                        </Button>
                                    </Box>
                                ) : (
                                    ''
                                )}
                            </form>
                        )}
                        {activeStep === 1 && (
                            <>
                                {value.map((item, key) => (
                                    <div key={key}>
                                        <Grid container>
                                            <Grid xs={3}>
                                                <Typography sx={{ fontWeight: 700, marginTop: '20px', fontSize: '16px' }}>
                                                    ชื่อหัวข้อ
                                                </Typography>
                                            </Grid>
                                            <Grid xs={9}>
                                                <Typography sx={{ marginTop: '20px', fontSize: '16px' }}>{item.name}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid xs={3}>
                                                <Typography
                                                    sx={{ marginTop: 3, fontSize: '16px', display: 'inline-block', fontWeight: 700 }}
                                                >
                                                    รายละเอียด{' '}
                                                    <Typography
                                                        sx={{
                                                            color: '#ff0c34',
                                                            fontSize: '16px',
                                                            display: 'inline-block',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        (*ถ้ามี)
                                                    </Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid xs={9}>
                                                <Typography sx={{ marginTop: '20px', fontSize: '16px' }}>{item.detail}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid xs={3}>
                                                <Typography sx={{ fontWeight: 700, fontSize: '16px', marginTop: '20px' }}>
                                                    แนบไฟล์เอกสาร
                                                </Typography>
                                            </Grid>
                                            <Grid xs={9}>
                                                <Typography sx={{ marginTop: '20px', fontSize: '16px', textDecoration: 'underline' }}>
                                                    {item.file}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                ))}
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button variant="outlined" color="error" onClick={handleClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button variant="outlined" color="success" sx={{ marginLeft: 3 }} onClick={handleNext}>
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
                                    ยืนยันการส่งข้อมูลเอกสาร
                                </Typography>
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button variant="outlined" color="error" onClick={handleClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button variant="outlined" color="success" sx={{ marginLeft: 3 }} onClick={handleSaveForm}>
                                        ยืนยัน
                                    </Button>
                                </Box>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
                <Dialog
                    fullWidth={true}
                    maxWidth={'sm'}
                    open={openCheck}
                    onClose={handleCloseCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: '#086c3c' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500, color: '#fff' }}>
                            รายละเอียดเอกสาร
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>เลขที่เอกสาร</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>{history.code}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ marginTop: 2 }}>
                                <Grid item xs={3}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>ผู้ส่ง</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>{history.reporter}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ marginTop: 2 }}>
                                <Grid item xs={3}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>วันที่ส่ง</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>{history.date}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ marginTop: 2 }}>
                                <Grid item xs={3}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>ไฟล์เอกสาร</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>{history.documents}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ marginTop: 2 }}>
                                <Grid item xs={3}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>รายละเอียด</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}></Typography>
                                </Grid>
                            </Grid>
                            {/* {history?.status == 0(<Typography sx={{ fontSize: '18px', fontWeight: '700' }}>แก้ไขเอกสาร</Typography>)} */}
                            <Grid container sx={{ marginTop: 2 }}>
                                <Grid item xs={3}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>สถานะการอนุมัติ</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Stepper activeStep={activeStepDoc} orientation="vertical" sx={{ marginTop: 3 }}>
                                        {stepsDocuments.map((step, index) => (
                                            <Step
                                                key={step.label}
                                                sx={{
                                                    '& .MuiStepLabel-root .Mui-completed': {
                                                        color: 'success.main' // circle color (COMPLETED)
                                                    },
                                                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                                                        color: 'grey.500' // Just text label (COMPLETED)
                                                    },
                                                    '& .MuiStepLabel-root .Mui-active': {
                                                        color: 'success.main' // circle color (ACTIVE)
                                                    },
                                                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                                                        color: 'common.white' // Just text label (ACTIVE)
                                                    },
                                                    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                                        fill: 'white' // circle's number (ACTIVE)
                                                    }
                                                }}
                                            >
                                                <StepLabel>
                                                    <p style={{ fontSize: '16px' }}>{step.label}</p>
                                                    {/* {step.label} */}
                                                    {/* {index == 0 ? 'อนุมัติ' : ''}
                                                    {index == 1 ? 'อนุมัติ' : ''}
                                                    {index == 2 ? 'อนุมัติ' : ''}
                                                    {index == 3 ? 'อนุมัติ' : ''} */}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Grid>
                            </Grid>
                        </DialogContentText>
                        {/* {activeStepDoc > 0 && (
                            <Grid container sx={{ marginTop: 3 }}>
                                <Grid xs={3}>
                                    <Typography>ประวัติการอนุมัติ</Typography>
                                </Grid>
                                <Grid xs={9}>
                                    {activeStepDoc > 1 && (
                                        <>
                                            <Typography>ผู้อำนวยการโรงพยาบาล</Typography>
                                            <Typography>ผ่านการอนุมัติ นายก ขขขข [20-03-2023 เวลา 15:20] </Typography>
                                        </>
                                    )}

                                    {activeStepDoc > 2 && (
                                        <>
                                            <Typography>เจ้าหน้าที่สาธารณสุขอำเภอบ้านโพธิ์</Typography>
                                            <Typography>ผ่านการอนุมัติ นายก ขขขข [20-03-2023 เวลา 15:20] </Typography>
                                        </>
                                    )}

                                    {activeStepDoc > 3 && (
                                        <>
                                            <Typography>ผู้ช่วยสาธารณสุขอำเภอบ้านโพธิ์</Typography>
                                            <Typography>ผ่านการอนุมัติ นายก ขขขข [20-03-2023 เวลา 15:20] </Typography>
                                        </>
                                    )}

                                    {activeStepDoc >= 4 && (
                                        <>
                                            <Typography>สาธารณสุขอำเภอบ้านโพธิ์</Typography>
                                            <Typography>ผ่านการอนุมัติ นายก ขขขข [20-03-2023 เวลา 15:20] </Typography>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        )} */}

                        <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                            <Button variant="outlined" color="error" onClick={handleCloseCheck}>
                                ออก
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
                {/* ลบ */}
                <Dialog open={openDelete} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle>
                        <Typography variant="h3" sx={{ fontWeight: 500, color: 'red', textAlign: 'center' }}>
                            แน่ใจที่ต้องการจะลบเอกสารหรือไม่
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box textAlign="center">
                            <ErrorIcon sx={{ color: '#ff0c34', fontSize: 180 }} />
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#ff0c34' }}
                        >
                            ยืนยันการลบเอกสาร
                        </Typography>
                        <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                            <Button variant="outlined" color="error" sx={{ borderRadius: 100 }} onClick={handleCloseDelete}>
                                ย้อนกลับ
                            </Button>
                            <Button variant="outlined" color="success" sx={{ marginLeft: 3, borderRadius: 100 }} onClick={handleDelete}>
                                ยืนยัน
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>

                <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle sx={{ backgroundColor: '#086c3c' }}>
                        <Typography variant="h3" sx={{ fontWeight: 500, color: '#fff' }}>
                            แบบฟอร์มการแก้ไขเอกสาร
                        </Typography>
                    </DialogTitle>
                    {/* <DialogContent>
                        <Typography
                            variant="h3"
                            sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#ff0c34' }}
                        >
                            ยืนยันการลบเอกสาร
                        </Typography>
                        <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                            <Button variant="outlined" color="error" sx={{ borderRadius: 100 }} onClick={handleCloseEdit}>
                                ย้อนกลับ
                            </Button>
                            <Button variant="outlined" color="success" sx={{ marginLeft: 3, borderRadius: 100 }} onClick={handleEdit}>
                                ยืนยัน
                            </Button>
                        </Box>
                    </DialogContent> */}
                    <DialogContent>
                        {activeStep === 0 && (
                            <form onSubmit={handleSubmit}>
                                {/* editCode */}
                                <Typography sx={{ marginTop: 3, fontSize: '16px' }}>รหัสเอกสาร:{editCode}</Typography>
                                <Typography sx={{ marginTop: 3, fontSize: '16px' }}>ชื่อหัวข้อ</Typography>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    placeholder="ระบุหัวข้อของเอกสาร"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                />
                                <Typography sx={{ marginTop: 3, fontSize: '16px', display: 'inline-block' }}>
                                    รายละเอียด{' '}
                                    <Typography sx={{ color: '#ff0c34', fontSize: '16px', display: 'inline-block' }}>(*ถ้ามี)</Typography>
                                </Typography>

                                <TextField
                                    margin="dense"
                                    id="detail"
                                    name="detail"
                                    placeholder="ระบุรายละเอียด"
                                    multiline
                                    rows={4}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginTop: 2 }}
                                />
                                <p>
                                    แนบไฟล์เอกสาร:
                                    {file ? <span> {file.name}</span> : <span> No file selected</span>}
                                    {file ? (
                                        ''
                                    ) : (
                                        <Button variant="contained" component="label" sx={{ marginLeft: '20px' }}>
                                            เลือกไฟล์เอกสาร
                                            <input type="file" id="file" name="file" hidden onChange={handleFileChange} />
                                        </Button>
                                    )}
                                    {file ? (
                                        <Button variant="contained" component="label" sx={{ marginLeft: '20px' }} onClick={uploadFile}>
                                            อัพโหลดไฟล์เอกสาร
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                </p>
                                {checkFile ? (
                                    <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                        <Button variant="outlined" color="error" onClick={handleClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button variant="outlined" color="success" sx={{ marginLeft: 3 }} type="submit">
                                            ต่อไป
                                        </Button>
                                    </Box>
                                ) : (
                                    ''
                                )}
                            </form>
                        )}
                        {activeStep === 1 && (
                            <>
                                {value.map((item, key) => (
                                    <div key={key}>
                                        <Grid container>
                                            <Grid xs={3}>
                                                <Typography sx={{ fontWeight: 700, marginTop: '20px', fontSize: '16px' }}>
                                                    รหัสเอกสาร
                                                </Typography>
                                            </Grid>
                                            <Grid xs={9}>
                                                <Typography sx={{ marginTop: '20px', fontSize: '16px' }}>{editCode}</Typography>
                                            </Grid>
                                            <Grid xs={3}>
                                                <Typography sx={{ fontWeight: 700, marginTop: '20px', fontSize: '16px' }}>
                                                    ชื่อหัวข้อ
                                                </Typography>
                                            </Grid>
                                            <Grid xs={9}>
                                                <Typography sx={{ marginTop: '20px', fontSize: '16px' }}>{item.name}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid xs={3}>
                                                <Typography
                                                    sx={{ marginTop: 3, fontSize: '16px', display: 'inline-block', fontWeight: 700 }}
                                                >
                                                    รายละเอียด{' '}
                                                    <Typography
                                                        sx={{
                                                            color: '#ff0c34',
                                                            fontSize: '16px',
                                                            display: 'inline-block',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        (*ถ้ามี)
                                                    </Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid xs={9}>
                                                <Typography sx={{ marginTop: '20px', fontSize: '16px' }}>{item.detail}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid xs={3}>
                                                <Typography sx={{ fontWeight: 700, fontSize: '16px', marginTop: '20px' }}>
                                                    แนบไฟล์เอกสาร
                                                </Typography>
                                            </Grid>
                                            <Grid xs={9}>
                                                <Typography sx={{ marginTop: '20px', fontSize: '16px', textDecoration: 'underline' }}>
                                                    {item.file}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                ))}
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button variant="outlined" color="error" onClick={handleClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button variant="outlined" color="success" sx={{ marginLeft: 3 }} onClick={handleNext}>
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
                                    ยืนยันการส่งข้อมูลแก้ไขเอกสาร
                                </Typography>
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button variant="outlined" color="error" onClick={handleClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button variant="outlined" color="success" sx={{ marginLeft: 3 }} onClick={handleSaveFormEdit}>
                                        ยืนยัน
                                    </Button>
                                </Box>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
};

export default Documents;
