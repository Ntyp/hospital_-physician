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
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import UnpublishedRoundedIcon from '@mui/icons-material/UnpublishedRounded';
// import DeleteIcon from '@material-ui/icons/Delete';

const DocumentsWaiting = () => {
    const [user, setUser] = useState();
    const [document, setDocument] = useState([]);
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [openApprove, setOpenApprove] = useState(false);
    const [openDisapprove, setOpenDisapprove] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        console.log(JSON.parse(userData));
        setUser(JSON.parse(userData));
        getData(JSON.parse(userData));
    }, []);

    function getData(value) {
        const id = value.hospital_id;
        const getrole = value.user_role;
        console.log('getrole', getrole);
        let role = 0;

        if (getrole === 'director hospital') {
            role = 1;
        } else if (getrole === 'officer') {
            role = 2;
        } else if (getrole === 'assistant') {
            role = 3;
        } else if (getrole === 'director') {
            role = 4;
        }
        axios
            .get(`http://localhost:7000/documents-status/${id}/${role}`)
            .then((response) => {
                console.log(response.data.data);
                const value = response.data.data;
                setRows(
                    value.map((item, index) =>
                        createData(
                            index + 1,
                            item.created_at,
                            item.document_code,
                            item.document_title,
                            item.document_file,
                            item.created_by,
                            item.document_description
                        )
                    )
                );
                // Rest of the code
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const columns = [
        { id: 'order', label: 'ลำดับที่', minWidth: 100 },
        { id: 'date', label: 'วันที่ส่ง', minWidth: 100 },
        { id: 'code', label: 'รหัส', minWidth: 100 },
        { id: 'topic', label: 'หัวข้อ', minWidth: 100 },
        { id: 'document', label: 'เอกสาร', minWidth: 100 },
        { id: 'reporter', label: 'ผู้รายงาน', minWidth: 100 },
        { id: 'detail', label: 'หมายเหตุ', minWidth: 100 },
        {
            id: 'actions',
            label: 'สถานะ',
            minWidth: 100,
            render: (row) => (
                <>
                    <IconButton aria-label="approve" color="success" onClick={() => handleClickOpenApprove(row)}>
                        <CheckCircleRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="disapprove" color="error" onClick={() => handleClickOpenDisapprove(row)}>
                        <UnpublishedRoundedIcon />
                    </IconButton>
                </>
            )
        }
    ];

    function createData(order, date, code, topic, document, reporter, detail) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return { order, date: formattedDate, code, topic, document, reporter, detail };
    }

    const handleClickOpenApprove = (row) => {
        setDocument(row);
        setOpenApprove(true);
    };

    const handleCloseApprove = (row) => {
        setDocument([]);
        setOpenApprove(false);
    };

    const handleClickOpenDisapprove = (row) => {
        setDocument(row);
        setOpenDisapprove(true);
    };

    const handleCloseDisapprove = (row) => {
        setDocument([]);
        setOpenDisapprove(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDisapprove = (event) => {
        event.preventDefault(); // prevent form submission
        const comment = event.target.form.comment.value;
        const id = document.code;
        console.log(id);

        axios
            .post(`http://localhost:7000/disapprove/${id}`, {
                role: user.role_status,
                comment: comment,
                hospital: user.hospital_id
            })
            .then(function (response) {
                const value = response.data;
                if (value.status == 'ok') {
                    setOpenDisapprove(false);
                    console.log('update status success');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleApprove = (event) => {
        event.preventDefault(); // prevent form submission
        const comment = event.target.form.comment.value;
        const id = document.code;

        axios
            .post(`http://localhost:7000/approve/${id}`, {
                role: user.role_status,
                comment: comment,
                hospital: user.hospital_id
            })
            .then(function (response) {
                const value = response.data;
                if (value.status == 'ok') {
                    setOpenApprove(false);
                    console.log('update status success');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div>
            <Card sx={{ minWidth: 275, minHeight: '100vh' }}>
                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                    รออนุมัติ
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
                    {/* <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        sx={{ float: 'left', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                    >
                        Export
                    </Button> */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align="left" style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.order}>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} align="left">
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

                {/* Approve */}
                <Dialog open={openApprove} fullWidth={true} maxWidth={'sm'} onClose={handleCloseApprove}>
                    <DialogTitle>
                        <h2 style={{ fontWeight: 500, color: 'green', textAlign: 'center' }}>อนุมัติเอกสาร</h2>
                    </DialogTitle>
                    <form onSubmit={handleApprove}>
                        <DialogContent>
                            <DialogContentText sx={{ marginBottom: '20px' }}>ข้อเสนอของคุณ</DialogContentText>
                            <TextField
                                margin="dense"
                                id="comment"
                                name="comment"
                                label="กรอกรายละเอียดเพิ่มเติม"
                                type="text"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseApprove}>ยกเลิก</Button>
                            <Button onClick={handleApprove} type="submit">
                                ยืนยัน
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* Disapprove */}
                <Dialog open={openDisapprove} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle>
                        <Typography variant="h3" sx={{ fontWeight: 500, color: 'red', textAlign: 'center' }}>
                            ไม่อนุมัติเอกสาร
                        </Typography>
                    </DialogTitle>
                    <form onSubmit={handleDisapprove}>
                        <DialogContent>
                            <DialogContentText sx={{ marginBottom: '20px' }}>ข้อเสนอของคุณ</DialogContentText>
                            <TextField
                                margin="dense"
                                id="comment"
                                name="comment"
                                label="กรอกรายละเอียดเพิ่มเติม"
                                type="text"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDisapprove}>ยกเลิก</Button>
                            <Button onClick={handleDisapprove} type="submit">
                                ยืนยัน
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Card>
        </div>
    );
};

export default DocumentsWaiting;
