import styled from "@emotion/styled";
import { Card } from "@mui/material";

const BorderedCard = styled(Card)(() => ({
    borderWidth: 3,
    borderColor: "white",
    boxSizing: "border-box",
    borderRadius: 0,
    cursor: "pointer",
    "&:hover": {
        borderColor: "#0686B2",
    },
    transition: "border-color 0.2s linear",
}));

export default BorderedCard;
