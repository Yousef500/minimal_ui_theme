import { CancelRounded, FilterAltRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";

import locationsService from "src/config/axios/locationsService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setLocations, setLocationsFilters } from "src/redux/slices/locationsSlice";
import InputField from "../general/InputField";

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
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            component="form"
            onSubmit={handleSubmit(handleFilterSubmit)}
        >
            <DialogTitle>
                <Typography align="center" variant="inherit">
                    {t("common.filter")}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <InputField
                            fullWidth
                            label={t("common.name")}
                            {...register("name")}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            fullWidth
                            label={t("common.description")}
                            {...register("description")}
                            type="text"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    loading={searching}
                    variant="contained"
                    color="success"
                    type="submit"
                    startIcon={<FilterAltRounded />}
                    loadingPosition="start"
                    sx={{ fontSize: 18 }}
                >
                    {t("common.filter")}
                </LoadingButton>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelRounded />}
                    sx={{ fontSize: 18 }}
                    onClick={onClose}
                >
                    {t("common.cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LocationsFilter;
