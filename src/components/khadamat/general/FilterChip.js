import { Chip } from "@mui/material";

const FilterChip = ({ filter, name, label, onDelete }) => {
    return filter || filter === false ? (
        <Chip sx={{ fontSize: 20, mb: 1 }} label={label} onDelete={() => onDelete(name)} />
    ) : (
        ""
    );
};

export default FilterChip;
