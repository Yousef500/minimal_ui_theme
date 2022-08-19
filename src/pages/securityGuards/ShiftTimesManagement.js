import { MoreTimeRounded } from '@mui/icons-material';
import { Button, Card, CardHeader, Container, Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shiftTimesService from 'src/config/axios/shiftTimesService';
import useLocales from 'src/hooks/useLocales';
import { setShiftTimes } from 'src/redux/slices/shiftTimesSlice';

const ShiftTimesManagement = () => {
    const {
        translate: t,
        currentLang: { value: lang },
    } = useLocales();
    const dispatch = useDispatch();

    const { page, shiftTimes } = useSelector((state) => state.shiftTimes);

    useEffect(() => {
        (async () => {
            try {
                const { data: sTimes } = await shiftTimesService.searchShiftTimes();
                console.log(sTimes);
                dispatch(setShiftTimes(sTimes));
            } catch (err) {
                console.log({ err });
                dispatch(setShiftTimes([]));
            }
        })();
    }, []);

    return (
        <Container>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h2" gutterBottom>
                            {t('securityGuards.shiftTimes.title')}
                        </Typography>
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            sx={{ fontSize: 20 }}
                            startIcon={<MoreTimeRounded />}
                        >
                            {t('securityGuards.shiftTimes.add')}
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    {shiftTimes.length &&
                        shiftTimes.map((shift) => (
                            <Card key={shift.Id}>
                                <CardHeader title={shift.ShiftTitle} />
                            </Card>
                        ))}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ShiftTimesManagement;
