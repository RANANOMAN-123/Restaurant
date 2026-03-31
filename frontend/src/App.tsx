import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/app-routes';
import { Toaster } from 'react-hot-toast';


const App = () => {
  return (
  
    <BrowserRouter>
    <Toaster position="top-right" />
      <AppRoutes />
      </BrowserRouter>
      
  );
};

export default App;


