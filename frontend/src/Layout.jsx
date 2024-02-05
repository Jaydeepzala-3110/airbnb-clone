import React from "react";
import Header from "./Header";
import LoginPage from "./pages/LoginPage";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="p-4 px-8 flex flex-col min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}
