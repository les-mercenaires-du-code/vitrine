import loadable from 'react-loadable';
import LoadingHome from './home.loading';

const LoadableHome = loadable({
  loader: () => import(/* webpackChunkName: "HomeTab" */ './home.component'),
  loading: LoadingHome,
  delay: 300, // 0.3 seconds
  timeout: 10000, // 10 seconds
});

export default LoadableHome;
