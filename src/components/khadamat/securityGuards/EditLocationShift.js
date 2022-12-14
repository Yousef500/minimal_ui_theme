import { CancelOutlined, SaveOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

import shiftsService from 'src/config/axios/shiftsService';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setShifts } from 'src/redux/slices/shiftsSlice';
import ShiftTimeAutoComplete from './ShiftTimeAutoComplete';
import WorkingDaysInput from './WorkingDaysInput';

const EditLocationShift = ({ t, open, onClose, site, shift }) => {
    const [saving, setSaving] = useState(false);
    const {
        control,
        setValue,
        handleSubmit,
        formState: { isDirty },
    } = useForm({
        mode: 'onTouched',
    });

    const dispatch = useDispatch();

    const {
        shifts: { GTsLookupDayId },
    } = useSelector((state) => state.shifts);

    const handleEditLocationShift = async (data) => {
        setSaving(true);
        try {
            await shiftsService.editShift({
                id: shift.SGsGuardSiteWorkShiftId,
                sGsGuardSiteId: site.id,
                gTsLookupDayId: GTsLookupDayId,
                sGsWorkShiftId: data.shiftTime.Key,
            });
            const { data: editedShifts } = await shiftsService.getShiftsByDay(GTsLookupDayId);
            dispatch(setShifts(editedShifts));
            setSaving(false);
            toast.success(t('common.success.edit'));
            onClose();
        } catch (err) {
            console.log({ err });
            setSaving(false);
            toast.error(err.response?.data?.Message || t('common.error.unknown'));
        }
    };

    return (
        <Dialog
            fullWidth
            maxWidth={'lg'}
            open={open}
            onClose={onClose}
            TransitionProps={{ unmountOnExit: true }}
        >
            <DialogTitle>
                <Typography variant="inherit" gutterBottom align="center">
                    {t('securityGuards.shifts.edit', { data: site.name })}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box
                    display={'flex'}
                    component="form"
                    onSubmit={handleSubmit(handleEditLocationShift)}
                >
                    <Grid container spacing={3} alignItems="center" justifyContent="center" my={2}>
                        <Grid item xs={12}>
                            <WorkingDaysInput
                                t={t}
                                control={control}
                                defaultDay={GTsLookupDayId}
                                setValue={setValue}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ShiftTimeAutoComplete
                                t={t}
                                control={control}
                                defaultShift={shift}
                                setValue={setValue}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack
                                direction="row"
                                alignItems={'center'}
                                justifyContent="center"
                                spacing={5}
                            >
                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveOutlined />}
                                    sx={{ fontSize: 18 }}
                                    loading={saving}
                                    loadingPosition="start"
                                    type="submit"
                                    disabled={!isDirty}
                                >
                                    {t('common.save')}
                                </LoadingButton>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelOutlined />}
                                    sx={{ fontSize: 18 }}
                                    onClick={onClose}
                                >
                                    {t('common.cancel')}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditLocationShift;
