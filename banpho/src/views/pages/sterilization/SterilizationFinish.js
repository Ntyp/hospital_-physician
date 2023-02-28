import React, { useState, useEffect } from 'react';
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
    Grid
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CheckIcon from '@mui/icons-material/Check';

const WaitingSterilization = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleCheck = (row) => {
        setOpen(true);
        // setHistory(row);
        // console.log('row =>', row);
        // setOpenCheck(true);
    };

    const handleDeleteEquipment = (row) => {
        // setHistory(row);
        console.log('row =>', row);
        // setOpenCheck(true);
    };

    const columns = [
        { id: 'order', label: 'ลำดับที่', minWidth: 100 },
        { id: 'hospital', label: 'โรงพยาบาลที่ส่ง', minWidth: 150 },
        { id: 'date', label: 'วันที่ส่ง', minWidth: 100 },
        { id: 'track', label: 'รหัสสินค้า', minWidth: 100 },
        { id: 'detail', label: 'หมายเหตุ', minWidth: 100 },
        { id: 'status', label: 'สถานะ', minWidth: 100 }
        // {
        //     id: 'mange',
        //     label: 'ยืนยันการรับอุปกรณ์',
        //     minWidth: 50,
        //     render: (row) => (
        //         <>
        //             <Button
        //                 variant="contained"
        //                 color="primary"
        //                 endIcon={<CheckIcon />}
        //                 sx={{ color: '#fff' }}
        //                 onClick={() => handleCheck(row)}
        //             >
        //                 <span>เสร็จสิ้นการฆ่าเชื้อ</span>
        //             </Button>
        //             {/* <IconButton aria-label="delete" color="success" size="small" onClick={() => handleCheck(row)}>
        //                 <CheckCircleRoundedIcon />
        //             </IconButton> */}
        //         </>
        //     )
        // }
    ];

    function createData(order, hospital, date, track, detail, status) {
        return { order, hospital, date, track, detail, status };
    }

    const rows = [
        createData('1', 'โรงพยาบาลส่งเสริมสุขภาพตำบลบางซ่อน', '2023-08-13', 'BPTH50141', '', 'เสร็จสิ้น'),
        createData('2', 'โรงพยาบาลส่งเสริมสุขภาพตำบลลาดขวาง', '2023-08-13', 'BPTH50142', '', 'เสร็จสิ้น'),
        createData('3', 'โรงพยาบาลส่งเสริมสุขภาพตำบลเกาะไร่', '2023-08-13', 'BPTH50143', '', 'เสร็จสิ้น'),
        createData('4', 'โรงพยาบาลส่งเสริมสุขภาพตำบลสนามจันทร์', '2023-08-13', 'BPTH50144', '', 'เสร็จสิ้น'),
        createData('5', 'โรงพยาบาลส่งเสริมสุขภาพตำบลบางกรูด', '2023-08-13', 'BPTH50145', '', 'เสร็จสิ้น')
    ];

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
        // Implement the delete logic
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedFile(null);
        setOpen(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = (event) => {};
    return (
        <div>
            <Card sx={{ minWidth: 275, minHeight: 625 }}>
                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                    ฆ่าเชื้อเสร็จสิ้น
                </Typography>
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
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ErrorIcon sx={{ fontSize: '100px', marginTop: '20px' }} color="error" />
                        <h3>ฆ่าเชื้ออุปกรณ์เสร็จสิ้น</h3>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={handleClose}>ย้อนกลับ</Button>
                        <Button onClick={handleClose}>ตกลง</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
    );
};

export default WaitingSterilization;
