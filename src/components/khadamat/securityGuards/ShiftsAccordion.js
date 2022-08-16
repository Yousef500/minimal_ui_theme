import { ExpandMoreRounded, LocationOnOutlined, ScheduleRounded } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardHeader,
    Stack,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import LocationShiftDropdown from "./LocationShiftDropdown";

const ShiftsAccordion = ({ site, t }) => {
    const formatTime = (timeString) => {
        let hours = 0;
        let ampm = "am";

        if (+timeString.split(":")[0] >= 12) {
            hours = +timeString.split(":")[0] - 12;
            ampm = "pm";
        } else {
            hours = +timeString.split(":")[0];
            ampm = "am";
        }

        return `${hours}:${timeString.split(":")[1]} ${ampm}`;
    };

    return (
        <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnOutlined />
                    <Typography variant="h4" gutterBottom>
                        {site.SGsGuardSiteName}
                    </Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Stack direction="column" spacing={2}>
                    {site.WorkShiftsList?.map((ws) => (
                        <Card key={ws.Id} sx={{ backgroundColor: "#0D91CA", color: "#E8F8FF" }}>
                            <CardHeader
                                avatar={<ScheduleRounded />}
                                titleTypographyProps={{
                                    variant: "h5",
                                    color: "inherit",
                                }}
                                title={ws.ShiftTitle}
                                subheaderTypographyProps={{
                                    align: "left",
                                    color: "inherit",
                                }}
                                subheader={t("securityGuards.shifts.shiftTime", {
                                    from: dayjs(`2019-01-25 ${ws.ShiftTimeFrom}`).format("hh:mm a"),
                                    to: dayjs(`2019-01-25 ${ws.ShiftTimeTo}`).format("hh:mm a"),
                                })}
                                action={
                                    <LocationShiftDropdown
                                        shift={ws}
                                        site={{
                                            name: site.SGsGuardSiteName,
                                            id: site.SGsGuardSiteId,
                                        }}
                                    />
                                }
                            />
                        </Card>
                    ))}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
};

export default ShiftsAccordion;
