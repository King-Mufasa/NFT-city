import { configureStore } from "@reduxjs/toolkit";
import utilitySlice from "./slice/utilitySlice";

export const store = configureStore({
  reducer:{
    util:utilitySlice
  }
})