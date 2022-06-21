import React, { Suspense } from "react";
import { CookiesProvider } from "react-cookie";
import AppContextProvider from "./contexts/AppContext";
import { Provider } from 'react-redux';
import Pages from "./pages";
import { store } from "./store";


function App() {
  return (
    <CookiesProvider>
      <Provider store={store}>
        <AppContextProvider>
          <Suspense>
            <Pages />
          </Suspense>
        </AppContextProvider>
      </Provider>
    </CookiesProvider>
  );
}

export default App;