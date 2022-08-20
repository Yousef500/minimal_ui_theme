import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import Slider from 'react-slick';
import { CarouselArrows, CarouselDots } from 'src/components/carousel';
import useLocales from 'src/hooks/useLocales';

const list = [
    'https://images.unsplash.com/photo-1660866838794-5d9cdf4a6081?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1660924905094-309bb8a095a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    'https://images.unsplash.com/photo-1660987872716-78dc24f90cb1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1660984382431-2c2a59120e98?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    'https://images.unsplash.com/photo-1660918930586-24c70684e9f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    'https://images.unsplash.com/photo-1660850889008-e26c9fd0772c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
];

const Dashboard = () => {
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? list.length - 1 : 0);
    const {
        translate: t,
        currentLang: { value: lang },
    } = useLocales();
    const carouselRef = useRef(null);

    const settings = {
        speed: 800,
        dots: true,
        arrows: false,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        beforeChange: (current, next) => setCurrentIndex(next),
        ...CarouselDots({
            zIndex: 9,
            bottom: -50,
            left: 24,
            position: 'absolute',
        }),
    };

    const handlePrevious = () => {
        carouselRef.current?.slickPrev();
    };

    const handleNext = () => {
        carouselRef.current?.slickNext();
    };

    return (
        <Container maxWidth="xl">
            <Grid container rowSpacing={5} columnSpacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography align="center" variant="h1" gutterBottom color={'primary'}>
                        {t('title')}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" align={'justify'}>
                        {t('introduction')}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Slider ref={carouselRef} {...settings} variableWidth={true}>
                        {list.map((i) => (
                            <img key={i} src={i} alt="testImage" height={500} width={'20px'} />
                        ))}
                        {/* <CarouselArrows
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        spacing={0}
                        sx={{
                          top: 16,
                          right: 16,
                          position: 'absolute',
                          '& .arrow': {
                            p: 0,
                            width: 32,
                            height: 32,
                            opacity: 0.48,
                            color: 'common.white',
                            '&:hover': { color: 'common.white', opacity: 1 },
                          },
                        }}
                      /> */}
                    </Slider>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
