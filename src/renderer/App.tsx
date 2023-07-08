import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Navigtion from './pages/Navigation';
import store from './store/store';
import { register } from './store/storeRegistry';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsRunning, setIsRunning } from './features/nodeSlice';
import { useDispatch } from 'react-redux';

// putting the store in registry so that we can use it outside of react components
register(store);

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNodeRunning = useSelector(selectIsRunning);
  const dispatch = useDispatch();

  // navigate every time isNodeRunning changes
  useEffect(() => {
    if (isNodeRunning) {
      navigate('/navigation/logs');
    } else {
      navigate('/');
    }
  }, [isNodeRunning]);

  useEffect(() => {
    (async () => {
      const childProcessInMemory =
        await window.electron.ipcRenderer.madara.childProcessInMemory();
      if (childProcessInMemory) {
        dispatch(setIsRunning(true));
      } else {
        dispatch(setIsRunning(false));
      }
    })();
  }, []);

  return (
    <Routes location={location}>
      <Route path="/" element={<Landing />} />
      <Route path="/navigation/*" element={<Navigtion />} />
    </Routes>
  );
}
