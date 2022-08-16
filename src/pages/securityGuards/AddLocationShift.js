import { CancelOutlined, SaveOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Card, CardActions, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../theme/overrides/Button";
import LocationInput from "../../components/khadamat/securityGuards/LocationInput";
import ShiftsInput from "../../components/khadamat/securityGuards/ShiftsInput";
import WorkingDaysInput from "../../components/khadamat/securityGuards/WorkingDaysInput";
// import MDButton from "../../components/MDButton";
import shiftsService from "../../config/axios/shiftsService";

const AddLocationShift = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        handleSubmit,
        formState: { isValid },
        control,
    } = useForm({
        mode: "onTouched",
    });

    const handleGoBack = () => {
        navigate("/securityGuards/shifts");
    };

    const handleAddLocationShift = async (data) => {
        setLoading(true);

        try {
            const addRes = await shiftsService.addShift({
                sGsGuardSiteId: data.location.Key,
                gTsLookupDayDTOs: [
                    {
                        gTsLookupDayId: data.day.id,
                        sGsWorkShiftIds: data.shifts.map((shift) => shift.Key),
                    },
                ],
            });

            console.log(addRes);
            setLoading(false);
            handleGoBack();
            toast.success(t("common.success.add"));
        } catch (err) {
            console.log({ err });
            toast.error(err.response?.data?.Message || t("common.error.unknown"));
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card component="form" onSubmit={handleSubmit(handleAddLocationShift)}>
                <CardHeader
                    title={t("securityGuards.shifts.add")}
                    titleTypographyProps={{ align: "center", variant: "h3", gutterBottom: true }}
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <LocationInput t={t} control={control} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <WorkingDaysInput t={t} control={control} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ShiftsInput t={t} control={control} />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <LoadingButton
                        fullWidth
                        variant="contained"
                        color="success"
                        loading={loading}
                        startIcon={<SaveOutlined />}
                        sx={{ fontSize: 18 }}
                        loadingPosition={"start"}
                        disabled={!isValid}
                        type="submit"
                    >
                        {t("common.save")}
                    </LoadingButton>

                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<CancelOutlined />}
                        sx={{ fontSize: 18 }}
                        onClick={handleGoBack}
                    >
                        {t("common.cancel")}
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};

export default AddLocationShift;
