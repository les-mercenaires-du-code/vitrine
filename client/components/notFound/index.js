import loadable from 'react-loadable';
import LoadingNotFound from './notFound.loading';

const LoadablenotFound = loadable({
  loader: () => import('./notFound.component' /* webpackChunkName: "notFoundTab" */),
  loading: LoadingNotFound,
  delay: 300, // 0.3 seconds
  timeout: 10000, // 10 seconds
});

export default LoadablenotFound;
