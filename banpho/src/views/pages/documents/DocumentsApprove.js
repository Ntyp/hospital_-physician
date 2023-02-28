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
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
// import DeleteIcon from '@material-ui/icons/Delete';

const DocumentsApprove = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);

    const columns = [
        { id: 'order', label: 'ลำดับที่', minWidth: 100 },
        { id: 'date', label: 'วันที่ส่ง', minWidth: 100 },
        { id: 'topic', label: 'หัวข้อ', minWidth: 100 },
        { id: 'reporter', label: 'ผู้รายงาน', minWidth: 100 },
        { id: 'detail', label: 'หมายเหตุ', minWidth: 100 },
        { id: 'status', label: 'สถานะ', minWidth: 100 },
        {
            id: 'check',
            label: 'ตรวจสอบ',
            minWidth: 50,
            render: (row) => (
                <IconButton aria-label="delete" onClick={() => handleDelete(row)}>
                    <VisibilityRoundedIcon />
                </IconButton>
            )
        }
    ];

    function handleDelete(row) {
        // Handle delete action for the row
    }

    function createData(order, date, topic, reporter, detail, status) {
        return { order, date, topic, reporter, detail, status };
    }

    const rows = [
        createData('1', '2023-08-13', 'การเบิกเงิน', 'นายโชคดี มีชัย เจ้าหน้าที่รพ.สต.', 'เบิกเงินซื้อพัดลมครับ', 'อนุมัติแล้ว'),
        createData('2', '2023-08-13', 'การเบิกเงิน', 'นายโชคดี มีชัย เจ้าหน้าที่รพ.สต.', 'เบิกเงินซื้อพัดลมครับ', 'อนุมัติแล้ว'),
        createData('3', '2023-08-13', 'การเบิกเงิน', 'นายโชคดี มีชัย เจ้าหน้าที่รพ.สต.', 'เบิกเงินซื้อพัดลมครับ', 'อนุมัติแล้ว'),
        createData('4', '2023-08-13', 'การเบิกเงิน', 'นายโชคดี มีชัย เจ้าหน้าที่รพ.สต.', 'เบิกเงินซื้อพัดลมครับ', 'อนุมัติแล้ว')
    ];

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
                    <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        sx={{ float: 'left', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                    >
                        Export
                    </Button>
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
