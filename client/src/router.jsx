import React from 'react';
import Header from "./components/layouts/Header"
import Top from "./components/pages/Top"
import SignIn from "./components/pages/SignIn"
import Home from "./components/pages/home/Home"
import ExternalAuth from "./oAuthCallback"
import Users from "./components/pages/users/Users"
import Posts from "./components/pages/posts/Posts"
import PostNew from "./components/pages/posts/new/PostNew"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

const Router = () => {
    return (
        <div>
            <BrowserRouter>
            <Header />
              <Routes>
                <Route path="/" element={<Top />} />
                <Route path="/callback/:provider/" element={<ExternalAuth />} />
                <Route path="/sign_in" element={<SignIn />} />
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