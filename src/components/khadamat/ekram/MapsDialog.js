import { Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const MapsDialog = ({
    open,
    onClose,
    markerCoords = null,
    title,
    center = null,
    paths = null,
    polyOptions = null,
}) => {
    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    //     language: "ar",
    // });

    const { t } = useTranslation();
    const theme = useTheme();

    const xsOnly = useMediaQuery(theme.breakpoints.only("xs"));
    const smOnly = useMediaQuery(theme.breakpoints.only("sm"));
    const mdOnly = useMediaQuery(theme.breakpoints.only("md"));
    const lgOnly = useMediaQuery(theme.breakpoints.only("lg"));
    const xlUp = useMediaQuery(theme.breakpoints.up("xl"));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={"xl"}
            sx={{
                width: { xs: xsOnly, sm: smOnly, md: mdOnly, lg: lgOnly, xl: xlUp },
            }}
        >
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                {center ? (
                    <GoogleMap
                        zoom={10}
                        center={center}
                        mapContainerStyle={{
                            borderRadius: 15,
                            height: 600,
                            width: xsOnly
                                ? 325
                                : smOnly
                                ? 490
                                : mdOnly
                                ? 671
                                : lgOnly
                                ? 920
                                : xlUp
                                ? 1150
                                : 1200,
                        }}
                    >
                        {markerCoords ? <Marker position={markerCoords} /> : ""}
                        {paths ? <Polygon paths={paths} options={polyOptions} /> : ""}
                    </GoogleMap>
                ) : (
                    ""
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MapsDialog;
