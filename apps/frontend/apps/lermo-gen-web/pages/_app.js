import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/en_US';
import '../styles/globals.css';

import createStore from '../src/redux/store';

const store = createStore();

const themeDefault = {
  token: {
    heightTopbar: 64,
    heightFooter: 54,

    widthSideBar: 248,

    colorPrimary: '#1845C6',
    colorInfo: '#1845C6',
  },
  components: {
    Button: {
      borderRadius: 4,
    },
  },
};

const theme = {
  colors: {
    primary: {
      main: '#1845C6',
      light: '#036C38',
      dark: '#024825',
    },
    secondary: {
      main: '#1E8764',
      light: '#27A87D',
      dark: '#1A6D51',
    },
  },
  transitions: {
    default: '.2s',
    slow: '.5s',
    fast: '.1s',
  },
  medias: {
    lg: '1199px',
    md: '991px',
    sm: '767px',
  },
};


const DefaultLayout = ({ children }) => children;

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout;

  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider
        locale={locale}
        theme={{
          ...themeDefault,
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default MyApp;
