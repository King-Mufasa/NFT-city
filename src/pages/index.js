import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { withCookies } from "react-cookie";
import HomePage from "./home";
import LoginPage from "./login";
import CommingSoonPage from "./comming";
import MarketPlacePage from "./marketplace";
import LeaderBoardPage from "./leaderboard";
import RewardsPage from "./reward";
import AdminPage from "./admin";
import ManagePage from "./admin/manage";
import CitySettingPage from "./admin/setting";
import MyLandsPage from "./mylands";

const Pages = (props) => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comming" element={<CommingSoonPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/marketplace" element={<MarketPlacePage />} />
          <Route path="/mylands" element={<MyLandsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/vote" element={<CommingSoonPage />} />
          <Route path="/leaderboard" element={<LeaderBoardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/city-setting" element={<CitySettingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default withCookies(Pages);