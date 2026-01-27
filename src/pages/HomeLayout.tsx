import { Outlet, useNavigation } from 'react-router-dom';
import {Loading, Navbar, Footer, TopHeader } from '../components';

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';


  return (
    <>
      <TopHeader email="test@gmail.com" phone="34555" address="24 hilton street" />
    <Navbar />
      {isPageLoading ? <Loading /> : <Outlet />}
      <Footer />
     
    </>
  );
};
export default HomeLayout;
