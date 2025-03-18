import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, TableSortLabel
} from '@mui/material';
import { getTestResultsByTopic } from "../api/api";
import { useParams } from "react-router-dom";

const InstructorTestResults = () => {
    const { topicId } = useParams();
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('fullName');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTestResultsByTopic(topicId);
                setTestResults(response.data);
            } catch (err) {
                setError('Ошибка при загрузке результатов тестов');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [topicId]);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedResults = [...testResults].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
    });

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Результаты тестов
            </Typography>
            <Paper sx={{ overflow: 'hidden', mt: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'fullName'}
                                        direction={orderBy === 'fullName' ? order : 'asc'}
                                        onClick={() => handleSort('fullName')}
                                    >
                                        <b>Студент</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'title'}
                                        direction={orderBy === 'title' ? order : 'asc'}
                                        onClick={() => handleSort('title')}
                                    >
                                        <b>Тест</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'score'}
                                        direction={orderBy === 'score' ? order : 'asc'}
                                        onClick={() => handleSort('score')}
                                    >
                                        <b>Оценка</b>
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedResults.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell>{result.user.fullName}</TableCell>
                                    <TableCell>{result.test.title}</TableCell>
                                    <TableCell>{result.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default InstructorTestResults;