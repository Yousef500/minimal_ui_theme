import { CancelRounded, SaveRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import InputField from "src/components/khadamat/general/InputField";

import locationsService from "src/config/axios/locationsService";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddLocation = () => {
    const [saving, setSaving] = useState(false);
    const [markerCoords, setMarkerCoords] = useState(null);
    const [mapError, setMapError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
    } = useForm({
        mode: "onTouched",
    });

    const desLength = watch("description")?.length;
    const remainingLetters = 130 - desLength >= 0 ? 130 - desLength : 0;

    const handleGoBack = () => {
        navigate("/securityGuards/locations");
    };

    const handleAddLocation = async (formData) => {
        if (markerCoords && isDirty) {
            setSaving(true);
            try {
                console.log({
                    ...formData,
                    locationLat: markerCoords.lat,
                    locationLong: markerCoords.lng,
                });
                const { data: addRes } = await locationsService.addLocation({
                    ...formData,
                    locationLat: markerCoords.lat,
                    locationLong: markerCoords.lng,
                });
                console.log(addRes);
                setSaving(false);
                handleGoBack();
                toast.success(t("common.success.add"));
            } catch (err) {
                console.log({ err });
                toast.error(t("common.error.unknown"));
                setSaving(false);
            }
        } else {
            setMapError(t("securityGuards.locations.noLocationErr"));
        }
    };

    const mapCenter = useMemo(() => ({ lat: 24.7136, lng: 46.6753 }), []);

    const handleMapClick = (e) => {
        setMarkerCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        if (mapError) setMapError("");
    };

    return (
        <Container maxWidth={'xl'}>
            <Card component="form" onSubmit={handleSubmit(handleAddLocation)}>
                <CardHeader
                    title={t("securityGuards.locations.add")}
                    titleTypographyProps={{ variant: "h3", align: "center", gutterBottom: true }}
                />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                required
                                {...register("nameFl", { required: true })}
                                type={"text"}
                                label={t("common.arName")}
                                error={!!errors.nameFl}
                                helperText={errors.nameFl?.message}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                required
                                {...register("nameSl", { required: true })}
                                type={"text"}
                                label={t("common.enName")}
                                error={!!errors.nameSl}
                                helperText={errors.nameSl?.message}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                required
                                multiline
                                rows={4}
                                variant="filled"
                                {...register("description", {
                                    maxLength: 130,
                                    required: true,
                                })}
                                type={"text"}
                                label={t("common.description")}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                            <Typography align="right" color={"GrayText"} variant={"subtitle2"}>
                                {remainingLetters} {t("securityGuards.locations.remainingLen")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <GoogleMap
                                center={mapCenter}
                                zoom={9}
                                mapContainerStyle={{
                                    height: 500,
                                    width: "fit",
                                    borderRadius: 15,
                                }}
                                onClick={handleMapClick}
                            >
                                {markerCoords ? (
                                    <Marker
                                        draggable
                                        position={markerCoords}
                                        onDragEnd={handleMapClick}
                                    />
                                ) : (
                                    ""
                                )}
                            </GoogleMap>
                        </Grid>

                        <Grid item xs={12}>
                            {mapError ? (
                                <Typography variant="subtitle1" align="center" color={"error"}>
                                    {mapError}
                                </Typography>
                            ) : (
                                ""
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <LoadingButton
                        fullWidth
                        loading={saving}
                        variant="contained"
                        color="success"
                        sx={{ fontSize: 20 }}
                        startIcon={<SaveRounded />}
                        loadingPosition="start"
                        type="submit"
                        disabled={!isDirty}
                    >
                        {t("common.save")}
                    </LoadingButton>

                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        sx={{ fontSize: 20 }}
                        startIcon={<CancelRounded />}
                        onClick={handleGoBack}
                    >
                        {t("common.cancel")}
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};

export default AddLocation;
