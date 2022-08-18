// routes
import { CircularProgress } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';
import { Suspense } from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import Center from 'src/components/khadamat/general/Center';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { ChartStyle } from './components/chart';
// import NotistackProvider from './components/NotistackProvider';
import 'react-toastify/dist/ReactToastify.css';
import { ProgressBarStyle } from './components/ProgressBar';
import ScrollToTop from './components/ScrollToTop';
import ThemeSettings from './components/settings';
import useLocales from './hooks/useLocales';

// ----------------------------------------------------------------------

export default function App() {
    const {
        currentLang: { value: lang },
    } = useLocales();
    
    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
            loadingElement={
                <Center my={20}>
                    <CircularProgress size={100} color="info" />
                </Center>
            }
            language={lang}
        >
            <Suspense
                fallback={
                    <Center my={20}>
                        <CircularProgress size={200} color="success" />
                    </Center>
                }
            >
                <MotionLazyContainer>
                    <ThemeProvider>
                        <ThemeSettings>
                            {/* <NotistackProvider> */}
                            <ProgressBarStyle />
                            <ChartStyle />
                            <ScrollToTop />
                            <Router />
                            {/* </NotistackProvider> */}
                            <ToastContainer
                                position="bottom-right"
                                autoClose={3000}
                                rtl={lang === 'ar'}
                                transition={Slide}
                                theme="colored"
                                bodyStyle={{
                                    fontFamily: 'CoconNextArabic-Light',
                                }}
                            />
                        </ThemeSettings>
                    </ThemeProvider>
                </MotionLazyContainer>
            </Suspense>
        </LoadScript>
    );
}
