import React from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import "./styles/global.scss";
import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import Products from "./pages/products/Products";
import User from "./pages/user/User";
import Product from "./pages/product/Product";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginForm from "./pages/AuthLogin/LoginForm";
import Orders from "./pages/orders/orders"

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = Boolean(localStorage.getItem('sessionToken'));
  console.log('isAuthenticated:', isAuthenticated);
  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    // Перенаправление на страницу авторизации, если пользователь не авторизован
    return <Navigate to="/" />;
  }
  
}

function App() {
  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/", // Указываем корневой путь, чтобы сразу попадать на страницу регистрации
      element: <LoginForm />,
    },
    {
      path: "/home", // Маршрут для главной страницы после авторизации
      element:  (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/home", // Добавляем пустой путь для отображения Home по умолчанию
          element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          ),
        },
        {
          path: "/home/users",
          element: (
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          ),
        },
        {
          path: "/home/products",
          element: (
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          ),
        },
        {
          path: "/home/orders",
          element: (
            <PrivateRoute>
              <Orders/>
            </PrivateRoute>
          ),
        },
        {
          path: "/home/orders/:id",
          element: (
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          ),
        },
        {
          path: "/home/products/:id",
          element: (
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
