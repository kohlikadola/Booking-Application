import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {QueryClient,QueryClientProvider} from 'react-query';
import { AppContextProvider } from './contexts/AppContext';
import {SearchContextProvider} from './contexts/SearchContext';
const Query=new QueryClient({
defaultOptions:{
queries:{
retry:0,
},

},
    });
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <QueryClientProvider client={Query}>
  <AppContextProvider>
  <SearchContextProvider>
    <App />
  </SearchContextProvider>
    </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
