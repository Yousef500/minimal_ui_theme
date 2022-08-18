import { CancelRounded, FilterAltRounded } from '@mui/icons-material';
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

import locationsService from 'src/config/axios/locationsService';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setLocations, setLocationsFilters } from 'src/redux/slices/locationsSlice';
import InputField from '../general/InputField';

const LocationsFilter = ({ t, open, onClose }) => {
    const [searching, setSearching] = useState(false);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { isDirty },
    } = useForm();

    const handleFilterSubmit = async (data) => {
        setSearching(true);
        try {
            dispatch(setLocationsFilters(data));
            const { data: filteredLocations } = await locationsService.searchLocations();
            dispatch(setLocations(filteredLocations));
            setSearching(false);
            onClose();
        } catch (err) {
            console.log({ err });
            setSearching(false);
            onClose();
        }
    };

    return (
        <Dialog fullWidth open={open} onClose={onClose} maxWidth={'lg'}>
            <DialogTitle>
                <Typography align="center" variant="inherit">
                    {t('common.filter')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box
                    display="flex"
                    mt={2}
                    component="form"
                    onSubmit={handleSubmit(handleFilterSubmit)}
                >
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={10}>
                            <InputField
                                fullWidth
                                label={t('common.name')}
                                {...register('name')}
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <InputField
                                fullWidth
                                multiline
                                rows={4}
                                label={t('common.description')}
                                {...register('description')}
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack
                                direction="row"
                                spacing={4}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <LoadingButton
                                    loading={searching}
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    startIcon={<FilterAltRounded />}
                                    loadingPosition="start"
                                    sx={{ fontSize: 18 }}
                                >
                                    {t('common.filter')}
                                </LoadingButton>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CancelRounded />}
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

export default LocationsFilter;
