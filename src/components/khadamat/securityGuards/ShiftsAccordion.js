import { ExpandMoreRounded, LocationOnOutlined, ScheduleRounded } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardHeader,
    Fade,
    Grow,
    Slide,
    Stack,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import LocationShiftDropdown from './LocationShiftDropdown';

const ShiftsAccordion = ({ site, t }) => {
    return (
        <Accordion
            TransitionProps={{ unmountOnExit: true }}
            sx={{ backgroundColor: 'cornsilk', color: 'black' }}
        >
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
                        <Card
                            key={ws.Id}
                            sx={{ backgroundColor: '#0D91CA', color: '#E8F8FF', pt: 0 }}
                        >
                            <CardHeader
                                sx={{ p: 2 }}
                                avatar={<ScheduleRounded />}
                                titleTypographyProps={{
                                    variant: 'h5',
                                    color: 'inherit',
                                    gutterBottom: true,
                                }}
                                title={ws.ShiftTitle}
                                subheaderTypographyProps={{
                                    color: 'inherit',
                                    gutterBottom: true,
                                }}
                                subheader={t('securityGuards.shifts.shiftTime', {
                                    from: dayjs(`2019-01-25 ${ws.ShiftTimeFrom}`).format('hh:mm a'),
                                    to: dayjs(`2019-01-25 ${ws.ShiftTimeTo}`).format('hh:mm a'),
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
