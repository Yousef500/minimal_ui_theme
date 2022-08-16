import { ListItemIcon, ListItemText, MenuItem, Typography } from "@mui/material";

const DropdownItem = ({ label, icon, onClick, ...itemProps }) => (
    <MenuItem onClick={onClick} {...itemProps}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
            primary={
                <Typography fontWeight={"bold"} color={"inherit"}>
                    {label}
                </Typography>
            }
        />
    </MenuItem>
);

export default DropdownItem;
