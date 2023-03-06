import React, { useState, useEffect } from 'react';
import moment from 'moment/moment';
import axios from 'axios';
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

const DocumentsApprove = () => {
    const [user, setUser] = useState();
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        console.log(JSON.parse(userData));
        setUser(JSON.parse(userData));
        getData(JSON.parse(userData));
    }, []);

    function getData(value) {
        const id = value.hospital_id;
        const role = value.role_status;
        axios
            .get(`http://localhost:7000/documents-approve/${id}/${role}`)
            .then((response) => {
                const value = response.data.data;
                setRows(
                    value.map((item, index) =>
                        createData(index + 1, item.created_at, item.document_title, item.created_by, item.approval_comments)
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const columns = [
        { id: 'order', label: 'ลำดับที่', minWidth: 100 },
        { id: 'date', label: 'วันที่ส่ง', minWidth: 100 },
        { id: 'topic', label: 'หัวข้อ', minWidth: 100 },
        { id: 'reporter', label: 'ผู้รายงาน', minWidth: 100 },
        { id: 'detail', label: 'หมายเหตุ', minWidth: 100 }
    ];

    function createData(order, date, topic, reporter, detail) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return { order, date: formattedDate, topic, reporter, detail };
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    function handleEdit(row) {
        // Implement the edit functionality here
    }

    function handleDelete(row) {
        // Implement the delete functionality here
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {};
    return (
        <div>
            <Card sx={{ minWidth: 275, minHeight: '100vh' }}>
                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                    อนุมัติแล้ว
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
            </Card>
        </div>
    );
};

export default DocumentsApprove;
