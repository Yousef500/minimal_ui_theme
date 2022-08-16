import { encode } from "@googlemaps/polyline-codec";
import { CancelRounded, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import InputField from "src/components/khadamat/general/InputField";
// 
import cemeteriesService from "src/config/axios/cemeteriesService";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const cardStyle = {
    background: `
    linear-gradient(
        45deg,
        hsl(105deg 12% 94%) 0%,
        hsl(106deg 20% 94%) 12%,
        hsl(108deg 28% 94%) 18%,
        hsl(109deg 37% 94%) 22%,
        hsl(110deg 46% 94%) 26%,
        hsl(112deg 55% 94%) 29%,
        hsl(113deg 64% 95%) 33%,
        hsl(123deg 66% 95%) 36%,
        hsl(131deg 70% 95%) 39%,
        hsl(138deg 73% 95%) 42%,
        hsl(144deg 76% 96%) 44%,
        hsl(149deg 78% 96%) 47%,
        hsl(154deg 80% 96%) 50%,
        hsl(150deg 67% 96%) 53%,
        hsl(145deg 56% 96%) 56%,
        hsl(140deg 46% 95%) 58%,
        hsl(134deg 38% 95%) 61%,
        hsl(128deg 30% 95%) 64%,
        hsl(120deg 24% 94%) 67%,
        hsl(119deg 30% 94%) 71%,
        hsl(117deg 36% 95%) 74%,
        hsl(116deg 43% 95%) 78%,
        hsl(115deg 51% 95%) 82%,
        hsl(114deg 58% 95%) 88%,
        hsl(112deg 67% 95%) 100%
      )`,
    borderRadius: 5,
    py: 2,
    mb: 5,
};

const AddCemetery = () => {
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapError, setMapError] = useState("");
    const polygonRef = useRef(null);
    const listenersRef = useRef([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onTouched",
    });

    const center = useMemo(() => ({ lat: 24.713552, lng: 46.675297 }), []);

    const handleMapClick = ({ latLng }) => {
        if (paths.length < 4) {
            setPaths([...paths, { lat: latLng.lat(), lng: latLng.lng() }]);
        }
        if (paths.length === 3) {
            setMapError("");
        }
    };

    const options = {
        draggable: true,
        editable: true,
        strokeColor: "#55DE7C",
        fillColor: "#55DE7C",
        fillOpacity: 0.1,
    };

    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const newPaths = polygonRef.current
                .getPath()
                .getArray()
                .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

            setPaths(newPaths);
        }
    }, [setPaths]);

    const onUnmount = useCallback(() => {
        listenersRef.current.forEach((lis) => lis.remove());
        polygonRef.current = null;
    }, []);

    const onLoad = useCallback(
        (polygon) => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit)
            );
        },
        [onEdit]
    );

    const handleGoBack = () => {
        navigate("/dead/cemeteries");
    };

    const handleAddCemetery = async (data) => {
        if (paths.length >= 4) {
            setLoading(true);
            try {
                const { data: addRes } = await cemeteriesService.addCemetery({
                    nameFl: data.NameFl,
                    nameSl: data.NameSl,
                    address: data.Address,
                    locationLong: paths[0].lng,
                    locationLat: paths[0].lat,
                    shapePath: encode(paths, 5),
                });

                console.log({ addRes });
                setLoading(false);
                toast.success(t("common.success.add"));
                handleGoBack();
            } catch (err) {
                console.log({ err });
                toast.error(err.response?.data?.Message ?? t("common.error.unknown"));
                setLoading(false);
            }
        } else {
            setMapError(t("ekram.cemeteries.locationErr"));
        }
    };

    return (
        <Container>
            <Card sx={cardStyle} component="form" onSubmit={handleSubmit(handleAddCemetery)}>
                <CardHeader
                    title={t("ekram.cemeteries.add")}
                    titleTypographyProps={{
                        gutterBottom: true,
                        variant: "h1",
                        align: "center",
                    }}
                />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                label={t("common.arName")}
                                type="text"
                                {...register("NameFl", {
                                    required: true,
                                })}
                                error={!!errors.NameFl}
                                helperText={errors.NameFl?.message}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                label={t("common.enName")}
                                type="text"
                                {...register("NameSl", {
                                    required: true,
                                })}
                                error={!!errors.NameSl}
                                helperText={errors.NameSl?.message}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                label={t("ekram.cemeteries.address")}
                                type="text"
                                {...register("Address", {
                                    required: true,
                                })}
                                error={!!errors.Address}
                                helperText={errors.Address?.message}
                            />
                        </Grid>

                        {/* <Grid item xs={4} sm={3} md={2} lg={1.5}>
                            <FormControlLabel
                                label={
                                    <Typography sx={{ display: "inline" }} variant="h5">
                                        فعال
                                    </Typography>
                                }
                                control={<Checkbox />}
                            />
                        </Grid> */}
                    </Grid>
                </CardContent>
                <CardMedia component="div">
                    <Typography variant="h5" align="center" gutterBottom>
                        {t("ekram.cemeteries.location")}
                    </Typography>

                    <GoogleMap
                        mapContainerStyle={{
                            width: "100%",
                            height: 450,
                            borderRadius: 20,
                        }}
                        zoom={10}
                        center={center}
                        onClick={handleMapClick}
                    >
                        {paths.length ? (
                            <Polygon
                                paths={paths}
                                options={options}
                                onLoad={onLoad}
                                onMouseUp={onEdit}
                                onDragEnd={onEdit}
                                onUnmount={onUnmount}
                                onRightClick={() => setPaths([])}
                            />
                        ) : (
                            ""
                        )}
                    </GoogleMap>
                </CardMedia>
                {mapError ? (
                    <Typography color="error" align="center">
                        {mapError}
                    </Typography>
                ) : (
                    ""
                )}
                <CardActions>
                    <Stack
                        direction="row"
                        spacing={5}
                        justifyContent="space-between"
                        width={"100%"}
                        my={2}
                    >
                        <LoadingButton
                            fullWidth
                            variant="contained"
                            color="success"
                            startIcon={<Save />}
                            sx={{ fontSize: 20 }}
                            type="submit"
                            loading={loading}
                            disabled={!isValid || paths?.length < 4}
                        >
                            {t("common.save")}
                        </LoadingButton>

                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            startIcon={<CancelRounded />}
                            sx={{ fontSize: 20 }}
                            onClick={handleGoBack}
                        >
                            {t("common.cancel")}
                        </Button>
                    </Stack>
                </CardActions>
            </Card>
        </Container>
    );
};

export default AddCemetery;
