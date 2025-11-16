import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/Header";
import Body from "./components/Body";
import Home from "./pages/Home";
import NewApp from "./pages/NewApp";
import Apps from "./pages/Apps";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Router = () => {

    return (
        <BrowserRouter>
            <Header />
            <Body>
                <ToastContainer />
                <Routes>
                    <Route index element={ <Home /> } />
                    <Route path="/newapp" element={ <NewApp /> } /> 
                    <Route path="/apps" element={ <Apps /> } />
                </Routes>
            </Body>
        </BrowserRouter>
    );
}

export default Router;