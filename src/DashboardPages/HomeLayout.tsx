import { Outlet, useNavigation } from 'react-router-dom';
import {AdminLoading, AdminNavbar, AdminFooter } from '../DashboardComponents';

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';


  return (
    <>
    <AdminNavbar />
      {isPageLoading ? <AdminLoading /> : <Outlet />}
      <AdminFooter />
     
    </>
  );
};
export default HomeLayout;
