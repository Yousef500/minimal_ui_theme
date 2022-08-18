import { LocationOnRounded } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Link, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import LocationsDropdown from './LocationsDropdown';

const LocationCard = ({ lang, t, location }) => {
    return (
        <Card
            sx={{
                height: 250,
                backgroundColor: 'warning.lighter',
                color: 'black',
            }}
        >
            <CardHeader
                avatar={<LocationOnRounded />}
                titleTypographyProps={{
                    gutterBottom: true,
                    variant: 'h5',
                    align: 'center',
                }}
                title={
                    <Link
                        component={RouterLink}
                        to={`/securityGuards/locations/${location.Id}`}
                        underline="hover"
                        color="warning.darker"
                    >
                        {lang === 'ar' ? location.NameFl : location.NameSl}
                    </Link>
                }
                action={<LocationsDropdown t={t} location={location} />}
            />
            <CardContent>
                <Typography variant={'subtitle1'}>{location.Description}</Typography>
            </CardContent>
        </Card>
    );
};

export default LocationCard;
