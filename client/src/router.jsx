import React, { useState } from 'react'; // useStateをインポート
import Header from "./components/layouts/Header"
import Top from "./components/pages/Top"
import SignIn from "./components/pages/sessions/sign_in/SignIn"
import Home from "./components/pages/home/Home"
import Users from "./components/pages/users/Users"
import Posts from "./components/pages/posts/Posts"
import PostNew from "./components/pages/posts/new/PostNew"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

const Router = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        <div>
            <BrowserRouter>
            <Header isLoggedIn={isLoggedIn} /> {/* isLoggedInをHeaderに渡す */}
              <Routes>
                <Route path="/" element={<Top />} />
                <Route path="/sign_in" element={<SignIn isLoggedIn={isLoggedIn} />} />
                <Route path="/home" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id/posts" element={<Posts />}/>
                <Route path="/posts/new" element={<PostNew />}></Route>
              </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Router