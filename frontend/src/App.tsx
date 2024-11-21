import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './route/AppRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
