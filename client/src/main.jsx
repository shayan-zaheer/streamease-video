import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {Provider} from "react-redux";
import store from './store/index.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PopularMovies from './components/PopularMovies.jsx';
import Favorites from './components/Favorites.jsx';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <PopularMovies />
            },
            {
                path: "/favorites",
                element: <Favorites />
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
