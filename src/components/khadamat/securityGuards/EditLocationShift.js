import { CancelOutlined, SaveOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import MDButton from "components/MDButton";
import shiftsService from "config/axios/shiftsService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setShifts } from "redux/slices/shiftsSlice";
import ShiftTimeAutoComplete from "./ShiftTimeAutoComplete";
import WorkingDaysInput from "./WorkingDaysInput";

const EditLocationShift = ({ t, open, onClose, site, shift }) => {
    const [saving, setSaving] = useState(false);
    const {
        control,
        setValue,
        handleSubmit,
        formState: { isDirty },
    } = useForm({
        mode: "onTouched",
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
            toast.success(t("common.success.edit"));
            onClose();
        } catch (err) {
            console.log({ err });
            setSaving(false);
            toast.error(err.response?.data?.Message || t("common.error.unknown"));
        }
    };

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            TransitionProps={{ unmountOnExit: true }}
            component="form"
            onSubmit={handleSubmit(handleEditLocationShift)}
        >
            <DialogTitle>
                <Typography variant="inherit" gutterBottom align="center">
                    {t("securityGuards.shifts.edit", { data: site.name })}
                </Typography>
            </DialogTitle>
            <DialogContent>
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
                </Grid>
            </DialogContent>
            <DialogActions>
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
                    {t("common.save")}
                </LoadingButton>

                <MDButton
                    variant="outlined"
                    color="error"
                    startIcon={<CancelOutlined />}
                    sx={{ fontSize: 18 }}
                    onClick={onClose}
                >
                    {t("common.cancel")}
                </MDButton>
            </DialogActions>
        </Dialog>
    );
};

export default EditLocationShift;
