import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/Header";
import Body from "./components/Body";
import Home from "./pages/Home";
import NewApp from "./pages/NewApp";

const Router = () => {
    return (
        <BrowserRouter>
            <Header />
            <Body>
                <Routes>
                    <Route index element={ <Home /> } />
                    <Route path="/newapp" element={ <NewApp /> } /> 
                </Routes>
            </Body>
        </BrowserRouter>
    );
}

export default Router;