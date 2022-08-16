import styled from "@emotion/styled";
import { ListAltOutlined, LocationOn, MoreVert } from "@mui/icons-material";
import { Fade, IconButton, Menu } from "@mui/material";
import decodeShapePath from "src/config/decodeShapePath";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DropdownItem from "../general/DropdownItem";
import MapsDialog from "./MapsDialog";

const CemeteryPopOver = styled(Menu)(() => ({
    "& .MuiPopover-paper": {
        backgroundImage: `linear-gradient(
            45deg,
  hsl(99deg 55% 47%) 0%,
  hsl(99deg 55% 47%) 5%,
  hsl(99deg 54% 47%) 10%,
  hsl(99deg 54% 47%) 14%,
  hsl(99deg 54% 48%) 19%,
  hsl(99deg 54% 48%) 24%,
  hsl(99deg 54% 48%) 29%,
  hsl(99deg 54% 48%) 33%,
  hsl(99deg 54% 49%) 38%,
  hsl(99deg 54% 49%) 43%,
  hsl(99deg 54% 49%) 48%,
  hsl(99deg 54% 49%) 52%,
  hsl(99deg 54% 49%) 57%,
  hsl(99deg 53% 50%) 62%,
  hsl(99deg 53% 50%) 67%,
  hsl(99deg 54% 50%) 71%,
  hsl(99deg 54% 50%) 76%,
  hsl(99deg 55% 51%) 81%,
  hsl(99deg 55% 51%) 86%,
  hsl(99deg 55% 51%) 90%,
  hsl(99deg 56% 51%) 95%,
  hsl(99deg 56% 52%) 100%
          )`,
    },

    "& .MuiMenuItem-root": {
        color: "#E3F9E3",
        "&:hover": {
            color: "black",
            background: "#CDF3CE",
        },
    },
}));

const CemeteryDropdown = ({ shapePath, id }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    const [paths, setPaths] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { page } = useSelector((state) => state.cemeteries);

    const options = {
        strokeColor: "#55DE7C",
        fillColor: "#55DE7C",
        fillOpacity: 0.1,
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMapDialogOpen = () => {
        handleMenuClose();
        setPaths(decodeShapePath(shapePath));
        setMapDialogOpen(true);
    };

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
            </IconButton>
            <CemeteryPopOver
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                TransitionComponent={Fade}
            >
                <DropdownItem
                    onClick={handleMapDialogOpen}
                    label={t("ekram.cemeteries.location")}
                    icon={<LocationOn />}
                />

                <DropdownItem
                    onClick={() => {
                        handleMenuClose();
                        navigate(`/dead/cemeteries/${id}?page=${page}`);
                    }}
                    label={t("common.details")}
                    icon={<ListAltOutlined />}
                />
            </CemeteryPopOver>
            {mapDialogOpen ? (
                <MapsDialog
                    open={mapDialogOpen}
                    onClose={() => setMapDialogOpen(false)}
                    center={{ lat: paths[0].lat, lng: paths[0].lng }}
                    title={t("ekram.cemeteries.location")}
                    paths={paths}
                    polyOptions={options}
                />
            ) : (
                ""
            )}
        </>
    );
};

export default CemeteryDropdown;
