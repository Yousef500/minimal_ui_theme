// routes
import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import { LoadScript } from '@react-google-maps/api';
import Center from 'src/components/khadamat/general/Center';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { ChartStyle } from './components/chart';
// import NotistackProvider from './components/NotistackProvider';
import { ProgressBarStyle } from './components/ProgressBar';
import ThemeSettings from './components/settings';
import ScrollToTop from './components/ScrollToTop';
import i18n from './locales/i18n';

// ----------------------------------------------------------------------

export default function App() {
  return (
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
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
              loadingElement={
                <Center my={20}>
                  <CircularProgress size={100} color="info" />
                </Center>
              }
              language={i18n.language}
            >
              <Router />
            </LoadScript>
            {/* </NotistackProvider> */}
          </ThemeSettings>
        </ThemeProvider>
      </MotionLazyContainer>
    </Suspense>
  );
}
