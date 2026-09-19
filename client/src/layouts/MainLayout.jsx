import { Outlet } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';

function MainLayout() {
  return <div className="flex min-h-screen flex-col"><Navbar /><div className="flex-1"><Outlet /></div><Footer /></div>;
}

export default MainLayout;
