import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { useUpdateAccountBalance } from './hooks';
import TawkMessenger from "./components/TawkMessenger";



import { Landing, HomeLayout, About, Services, Contact, Faq, Dashboard, DepositFunds, WithdrawFunds, ViewPortfolio, BankTransfer, CryptoPage, WithdrawForm, StocksPage, RealEstatePage, DepositFundsForm, Login, Register, UserSettings, DeleteSuccess, ApprovalSuccess, Transactions as UserTransactions, Terms, AIResumeBuilder, AISocialPostGenerator } from './pages';
import { Landing as AdminLanding, HomeLayout as AdminHomeLayout, UserPage, UserView, UserEdit, Transactions, Settings, EditDeposit, EditWithdrawal, EditInvestment, ViewInvestment, ViewDeposit, ViewWithdrawal } from './DashboardPages';
import { store } from './store';
import BondsPage from './pages/BondsPage';
import CryptoInvestPage from './pages/CryptoInvestPage';
import { useEffect } from 'react';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
   
    children: [
      {
        index: true,
        element: <Landing />,
  
      },

    {
        path: 'about',
        element: <About />,
      },
    {
        path: 'services',
        element: <Services />,
      },
    {
        path: 'dashboard',
        element: <Dashboard />,
      },
    {
        path: 'contact',
        element: <Contact />,
      },
    {
        path: 'faqs',
        element: <Faq />,
      },
    {
        path: 'depositFunds',
        element: <DepositFunds />,
      },
    {
        path: 'withdrawFunds',
        element: <WithdrawFunds />,
      },
    {
        path: 'viewPortfolio',
        element: <ViewPortfolio />,
      },
    {
        path: 'bankTransfer',
        element: <BankTransfer />,
      },
    {
        path: 'cryptoPage',
        element: <CryptoPage />,
      },
    {
        path: 'withdrawForm',
        element: <WithdrawForm />,
      },
    {
        path: 'stocksPage',
        element: <StocksPage />,
      },
    {
        path: 'bondsPage',
        element: <BondsPage />,
      },
    {
        path: 'realEstatePage',
        element: <RealEstatePage />,
      },
    {
        path: 'cryptoInvestPage',
        element: <CryptoInvestPage />,
      },
    {
        path: 'terms',
        element: <Terms />,
      },
    {
        path: 'depositFundsForm',
        element: <DepositFundsForm />,
      },
    {
        path: 'login',
        element: <Login />,
      },
    {
        path: 'AIResumeBuilder',
        element: <AIResumeBuilder />,
      },
    {
        path: 'AISocialPostGenerator',
        element: <AISocialPostGenerator />,
      },
    {
        path: 'register',
        element: <Register />,
      },
    {
        path: 'settings',
        element: <UserSettings />,
      },
    {
        path: 'transactions',
        element: <UserTransactions />,
      },
    {
        path: 'delete/:id',
        element: <DeleteSuccess />,
      },
    {
        path: 'approve/:id',
        element: <ApprovalSuccess />,
      },
     
    ],
  },
   {
      path: '/adminDashboard',
      element: <AdminHomeLayout />,
      children: [
        {
          index: true,
          element: <AdminLanding />,
        },
        {
          path: '/adminDashboard/userPage',
          element: <UserPage />,
        },
        {
                path: '/adminDashboard/userView/:id',
                element: <UserView />,
               
              },
        {
                path: '/adminDashboard/editDeposit/:id',
                element: <EditDeposit />,
               
              },
        {
                path: '/adminDashboard/editWithdrawal/:id',
                element: <EditWithdrawal />,
               
              },
        {
                path: '/adminDashboard/editInvestment/:id',
                element: <EditInvestment />,
               
              },
        {
                path: '/adminDashboard/viewInvestment/:id',
                element: <ViewInvestment />,
               
              },
        {
                path: '/adminDashboard/viewDeposit/:id',
                element: <ViewDeposit />,
               
              },
        {
                path: '/adminDashboard/viewWithdrawal/:id',
                element: <ViewWithdrawal/>,
               
              },
        {
                path: '/adminDashboard/userEdit/:id',
                element: <UserEdit />,
               
              },
        {
                path: '/adminDashboard/transactions',
                element: <Transactions />,
               
              },
        {
                path: '/adminDashboard/settings',
                element: <Settings />,
               
              },
      
      ],
    },
]);

const App = () => {
 useUpdateAccountBalance(); // Will run after login anywhere in the site

// useEffect(() => {
//     const tawk = document.createElement("script");
//     tawk.src = "https://embed.tawk.to/YOUR_PROPERTY_ID/1hYOURID"; // Replace with your real script URL
//     tawk.async = true;
//     tawk.charset = "UTF-8";
//     tawk.setAttribute("crossorigin", "*");
//     document.body.appendChild(tawk);
//   }, []);


  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <TawkMessenger /> {/* ✅ Add here so it’s always active */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;