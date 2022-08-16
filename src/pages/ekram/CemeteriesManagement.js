import { AddRounded, SearchOffRounded } from '@mui/icons-material';
import { CircularProgress, Container, Grid, Pagination, Stack, Typography } from '@mui/material';
import CemeteryCard from 'src/components/khadamat/ekram/CemeteryCard';
import Center from 'src/components/khadamat/general/Center';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCemeteries, setCemeteriesPageNo, setCemeteriesLoading } from 'src/redux/slices/cemeteriesSlice';
import cemeteriesService from 'src/config/axios/cemeteriesService';
import Button from 'src/theme/overrides/Button';

const CemeteriesManagement = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { cemeteries, cemeteriesLoading, page, pageCount } = useSelector((state) => state.cemeteries);

  useEffect(() => {
    (async () => {
      try {
        const { data: cemeteriesRes } = await cemeteriesService.searchCemeteries();
        console.log({ cemeteriesRes });
        dispatch(setCemeteries(cemeteriesRes));
      } catch (err) {
        console.log({ err });
        toast.error(t('common.error.unknown'));
      }
    })();
  }, []);

  const handlePageChange = async (e, newPage) => {
    if (newPage !== page) {
      try {
        dispatch(setCemeteriesPageNo(newPage));
        const { data: pagedCemeteries } = await cemeteriesService.searchCemeteries();
        dispatch(setCemeteries(pagedCemeteries));
      } catch (err) {
        console.log({ err });
        dispatch(setCemeteriesLoading(false));
        toast.error(t('common.error.unknown'));
      }
    }
  };

  return (
    <Container>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography gutterBottom variant="h1">
              {t('ekram.cemeteries.title')}
            </Typography>
            <Button
              startIcon={<AddRounded />}
              variant="contained"
              color="success"
              size="large"
              sx={{ fontSize: 25 }}
              component={Link}
              to={`/dead/cemeteries/add?page=${page}`}
            >
              {t('ekram.cemeteries.add')}
            </Button>
          </Stack>
        </Grid>
        {cemeteriesLoading ? (
          <Grid item xs={12}>
            <Center my={20}>
              <CircularProgress size={200} color="success" />
            </Center>
          </Grid>
        ) : cemeteries?.length ? (
          cemeteries.map((cemetery) => (
            <Grid key={cemetery.Id} item xs={12} sm={6} md={6} lg={4}>
              <CemeteryCard cemetery={cemetery} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Center>
              <Stack direction="row" spacing={3}>
                <SearchOffRounded />
                <Typography variant="h4">{t('common.notFound')} </Typography>
              </Stack>
            </Center>
          </Grid>
        )}
        <Grid item xs={12} mt={3} mb={5}>
          <Center>
            <Pagination
              page={page}
              onChange={handlePageChange}
              count={pageCount}
              color="info"
              shape="rounded"
              size="large"
              showFirstButton
              showLastButton
            />
          </Center>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CemeteriesManagement;
