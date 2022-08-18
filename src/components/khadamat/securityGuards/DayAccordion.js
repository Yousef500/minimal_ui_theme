import { ExpandMoreRounded, ScheduleRounded } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardHeader,
    Stack,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';

const DayAccordion = ({ t, day }) => {
    return (
        <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Typography variant="h6">{day.GTsLookupDayName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack direction="column" spacing={2} justifyContent="center">
                    {day.SGsWorkShiftDTOs.map((dayShift) => (
                        <Card
                            key={dayShift.Id}
                            sx={{
                                backgroundColor: 'primary.lighter',
                            }}
                        >
                            <CardHeader
                                sx={{ p: 2 }}
                                avatar={<ScheduleRounded />}
                                titleTypographyProps={{
                                    variant: 'h6',
                                    color: 'black',
                                    gutterBottom: true,
                                }}
                                subheaderTypographyProps={{
                                    color: 'black',
                                    gutterBottom: true,
                                }}
                                title={dayShift.ShiftTitle}
                                subheader={t('securityGuards.shifts.shiftTime', {
                                    from: dayjs(`2019-01-25 ${dayShift.ShiftTimeFrom}`).format(
                                        'hh:mm a'
                                    ),
                                    to: dayjs(`2019-01-25 ${dayShift.ShiftTimeTo}`).format(
                                        'hh:mm a'
                                    ),
                                })}
                            />
                        </Card>
                    ))}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
};

export default DayAccordion;
