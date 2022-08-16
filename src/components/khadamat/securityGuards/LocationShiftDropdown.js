import {
    Delete, Edit,
    MoreHorizRounded
} from "@mui/icons-material";
import {
    Fade, IconButton,
    Menu
} from "@mui/material";
import shiftsService from "src/config/axios/shiftsService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setShifts } from "src/redux/slices/shiftsSlice";
import DeleteDialog from "../general/DeleteDialog";
import DropdownItem from "../general/DropdownItem";
import EditLocationShift from "./EditLocationShift";

const LocationShiftDropdown = ({ shift, site }) => {
    const [deleting, setDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        shifts: { SGsGuardSiteWorkShiftId, GTsLookupDayId },
    } = useSelector((state) => state.shifts);

    const handleDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteDialogOpen = () => {
        setAnchorEl(null);
        setDeleteDialogOpen(true);
    };

    const handleEditDialogOpen = () => {
        setAnchorEl(null);
        setEditDialogOpen(true);
    };

    const handleDeleteShift = async () => {
        setDeleting(true);
        try {
            const { data } = await shiftsService.deleteShift(SGsGuardSiteWorkShiftId);
            const { data: newShifts } = await shiftsService.getShiftsByDay(GTsLookupDayId);
            dispatch(setShifts(newShifts));
            setDeleting(false);
            handleDialogClose();
            toast.success(t("common.success.delete"));
        } catch (err) {
            console.log({ err });
            setDeleting(false);
            toast.error(t("common.error.unknown"));
        }
    };

    return (
        <>
            <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size={"large"}
                color={"inherit"}
            >
                <MoreHorizRounded fontSize={"inherit"} />
            </IconButton>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                TransitionProps={{ unmountOnExit: true }}
                TransitionComponent={Fade}
                disableScrollLock
            >
                <DropdownItem
                    label={t("common.edit")}
                    icon={<Edit />}
                    onClick={handleEditDialogOpen}
                />
                <DropdownItem
                    label={t("common.delete")}
                    icon={<Delete />}
                    onClick={handleDeleteDialogOpen}
                />
            </Menu>

            {deleteDialogOpen ? (
                <DeleteDialog
                    t={t}
                    open={deleteDialogOpen}
                    onClose={handleDialogClose}
                    title={t("securityGuards.shifts.deleteConfirm", {
                        shift: shift.ShiftTitle,
                        location: site.name,
                    })}
                    handleDelete={handleDeleteShift}
                    deleting={deleting}
                />
            ) : (
                ""
            )}

            {editDialogOpen ? (
                <EditLocationShift
                    t={t}
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    site={site}
                    shift={shift}
                />
            ) : (
                ""
            )}
        </>
    );
};

export default LocationShiftDropdown;
