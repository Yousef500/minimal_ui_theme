import {
    KeyboardDoubleArrowLeftRounded,
    KeyboardDoubleArrowRightRounded,
} from '@mui/icons-material';
import {
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    CircularProgress,
    Container,
    Fab,
    Grid,
    Tooltip,
} from '@mui/material';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Center from 'src/components/khadamat/general/Center';
import DetailView from 'src/components/khadamat/general/DetailView';
import cemeteriesService from 'src/config/axios/cemeteriesService';
import decodeShapePath from 'src/config/decodeShapePath';
import i18n from 'src/locales/i18n';
import { setCemeteriesPageNo } from 'src/redux/slices/cemeteriesSlice';

const CemeteryDetails = () => {
    const { id } = useParams();
    const page = useLocation().search.split('page=')[1];
    const [cemetery, setCemetery] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [paths, setPaths] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const decodeAndSetPaths = useCallback(
        (shapePath) => {
            console.log(cemetery);
            setPaths(decodeShapePath(shapePath));
        },
        [cemetery]
    );

    useEffect(() => {
        if (cemetery.Id !== id) {
            (async () => {
                try {
                    dispatch(setCemeteriesPageNo(1));
                    const { data } = await cemeteriesService.searchCemeteries({ id });
                    console.log({ data });
                    const cem = data.PagedList[0];
                    setCemetery(cem);
                    decodeAndSetPaths(cem.shapePath);
                    setLoadingData(false);
                } catch (err) {
                    console.log({ err });
                    toast.error(t('common.error.unknown'));
                    setLoadingData(false);
                }
            })();
        }
    }, [id]);

    const handleGoBack = () => {
        if (page > 1) {
            dispatch(setCemeteriesPageNo(Number(page)));
        }
        navigate('/dead/cemeteries');
    };

    const options = {
        strokeColor: '#55DE7C',
        fillColor: '#55DE7C',
        fillOpacity: 0.1,
    };

    return (
        <Container maxWidth={'xl'}>
            <Card
                sx={{ p: 2, backgroundColor: 'success.lighter', borderRadius: 3, color: 'black' }}
            >
                {loadingData ? (
                    <Center my={20}>
                        <CircularProgress size={100} color="success" />
                    </Center>
                ) : (
                    cemetery && (
                        <>
                            <CardHeader
                                title={i18n.language === 'en' ? cemetery.NameSl : cemetery.NameFl}
                                titleTypographyProps={{
                                    align: 'center',
                                    variant: 'h3',
                                    gutterBottom: true,
                                }}
                                action={
                                    <Tooltip title={t('common.return')}>
                                        <Fab size="small" color="info" onClick={handleGoBack}>
                                            {i18n.language === 'en' ? (
                                                <KeyboardDoubleArrowRightRounded />
                                            ) : (
                                                <KeyboardDoubleArrowLeftRounded />
                                            )}
                                        </Fab>
                                    </Tooltip>
                                }
                            />
                            <CardContent>
                                <Grid container spacing={{ xs: 3, md: 5 }}>
                                    <Grid item xs={12} md={6}>
                                        <DetailView
                                            title={`${t('ekram.cemeteries.address')}:`}
                                            data={cemetery.Address}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <DetailView
                                            title={`${t('common.status')}:`}
                                            data={
                                                <Chip
                                                    label={
                                                        cemetery.IsActive
                                                            ? t('common.active')
                                                            : t('common.inactive')
                                                    }
                                                    color="success"
                                                    disabled={!cemetery.IsActive}
                                                    sx={{ width: 80, fontSize: 20 }}
                                                />
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <DetailView
                                            title={`${t('common.long')}:`}
                                            data={cemetery.LocationLong}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <DetailView
                                            title={`${t('common.lat')}:`}
                                            data={cemetery.LocationLat}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardMedia component="div">
                                <GoogleMap
                                    center={{
                                        lat: paths[0].lat,
                                        lng: paths[0].lng,
                                    }}
                                    zoom={12}
                                    mapContainerStyle={{
                                        height: 500,
                                        width: '100%',
                                        borderRadius: 20,
                                    }}
                                >
                                    {paths && paths?.length ? (
                                        <Polygon options={options} paths={paths} />
                                    ) : (
                                        ''
                                    )}
                                </GoogleMap>
                            </CardMedia>
                        </>
                    )
                )}
            </Card>
        </Container>
    );
};

export default CemeteryDetails;
