import styled from "@emotion/styled";
import { CheckRounded, DeleteRounded, EditRounded, MoreVert } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
    Card,
    CardHeader,
    Chip,
    Dialog,
    DialogActions,
    DialogTitle,
    Fade,
    IconButton,
    Menu,
    Stack,
    Typography,
} from "@mui/material";

import nationalitiesService from "src/config/axios/nationalitiesService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import i18n from "src/locales/i18n";
import { toast } from "react-toastify";
import { setNationalities } from "src/redux/slices/nationalitiesSlice";
import DropdownItem from "../general/DropdownItem";

const NatDropdown = styled(Menu)(() => ({
    "& .MuiPaper-root": {
        backgroundImage: `
        linear-gradient(
            45deg,
  hsl(179deg 37% 39%) 0%,
  hsl(181deg 39% 39%) 5%,
  hsl(182deg 41% 39%) 10%,
  hsl(184deg 43% 39%) 14%,
  hsl(185deg 44% 38%) 19%,
  hsl(186deg 46% 38%) 24%,
  hsl(187deg 47% 38%) 29%,
  hsl(188deg 49% 38%) 33%,
  hsl(189deg 50% 38%) 38%,
  hsl(190deg 51% 38%) 43%,
  hsl(191deg 51% 38%) 48%,
  hsl(192deg 52% 39%) 52%,
  hsl(193deg 52% 39%) 57%,
  hsl(194deg 52% 39%) 62%,
  hsl(195deg 51% 39%) 67%,
  hsl(196deg 51% 40%) 71%,
  hsl(197deg 50% 40%) 76%,
  hsl(199deg 49% 40%) 81%,
  hsl(200deg 48% 41%) 86%,
  hsl(201deg 46% 41%) 90%,
  hsl(202deg 45% 42%) 95%,
  hsl(204deg 44% 42%) 100%
          )
          `,
    },
    "& .MuiMenuItem-root": {
        "& .MuiListItemIcon-root": {
            color: "#E4FAF1",
        },
        "& .MuiListItemText-root": {
            color: "#E4FAF1",
        },

        "&:hover": {
            backgroundColor: "#E4FAF1",
            "& .MuiListItemIcon-root": {
                color: "black",
            },
            "& .MuiListItemText-root": {
                color: "black",
            },
        },
    },
}));

const NatCard = ({ nat }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const menuOpen = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { page } = useSelector((state) => state.nationalities);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenDeleteDialog = () => {
        handleMenuClose();
        setDeleteDialogOpen(true);
    };

    const handleDeleteNat = async () => {
        setDeleting(true);
        try {
            const { data: deleteRes } = await nationalitiesService.deleteNat(nat.Id);
            const { data: updatedNats } = await nationalitiesService.searchNats();
            dispatch(setNationalities(updatedNats));
            toast.success(t("common.success.delete"));
            setDeleteDialogOpen(false);
            setDeleting(false);
        } catch (err) {
            console.log({ err });
            toast.error(t("common.error.unknown"));
            setDeleting(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader
                    title={i18n.language === "ar" ? nat.NameFl : nat.NameSl}
                    titleTypographyProps={{ gutterBottom: true }}
                    subheader={
                        <Chip
                            color={nat.IsActive ? "info" : "default"}
                            variant={"filled"}
                            sx={{ fontSize: 18 }}
                            label={nat.IsActive ? t("common.active") : t("common.inactive")}
                        />
                    }
                    action={
                        <IconButton size="large" onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <MoreVert />
                        </IconButton>
                    }
                />
            </Card>
            <NatDropdown
                anchorEl={anchorEl}
                open={menuOpen}
                TransitionComponent={Fade}
                onClose={handleMenuClose}
                disableScrollLock
            >
                <DropdownItem
                    label={t("common.edit")}
                    icon={<EditRounded />}
                    onClick={handleMenuClose}
                    component={Link}
                    to={`/users/nationalities/edit/${nat.Id}?page=${page}`}
                />
                <DropdownItem
                    label={t("common.delete")}
                    icon={<DeleteRounded />}
                    onClick={handleOpenDeleteDialog}
                />
            </NatDropdown>
            {deleteDialogOpen ? (
                <Dialog
                    fullWidth
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>
                        <Typography align="center" variant="inherit">
                            {t("accounts.nationalities.deleteConfirm", {
                                data: i18n.language === "ar" ? nat.NameFl : nat.NameSl,
                            })}
                        </Typography>
                    </DialogTitle>
                    <DialogActions>
                        <Stack direction="row" spacing={5} justifyContent="center" width="100%">
                            <LoadingButton
                                variant="contained"
                                color="error"
                                loading={deleting}
                                startIcon={<DeleteRounded />}
                                loadingPosition="start"
                                sx={{ fontSize: 18, borderRadius: 0 }}
                                onClick={handleDeleteNat}
                            >
                                {t("common.yes")}
                            </LoadingButton>

                            <Button
                                variant="contained"
                                color="info"
                                startIcon={<CheckRounded />}
                                sx={{ fontSize: 18, borderRadius: 0 }}
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                {t("common.no")}
                            </Button>
                        </Stack>
                    </DialogActions>
                </Dialog>
            ) : (
                ""
            )}
        </>
    );
};

export default NatCard;
