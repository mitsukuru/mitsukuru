import React from 'react';
import Header from "./components/layouts/Header"
import Top from "./components/pages/Top"
import SignIn from "./components/pages/sessions/sign_in/SignIn"
import AuthLoading from "./components/pages/auth/AuthLoading"
import Onboarding from "./components/pages/onboarding/Onboarding"
import Home from "./components/pages/home/Home"
import Users from "./components/pages/users/Users"
import Posts from "./components/pages/posts/Posts"
import PostNew from "./components/pages/posts/new/PostNew"
import PostShow from "./components/pages/posts/show/PostShow"
import ProtectedRoute from "./components/common/ProtectedRoute"

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

const Router = () => {
    return (
        <div>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute requireAuth={false}>
                    <Header />
                    <Top />
                  </ProtectedRoute>
                } />
                <Route path="/sign_in" element={
                  <ProtectedRoute requireAuth={false}>
                    <Header />
                    <SignIn />
                  </ProtectedRoute>
                } />
                <Route path="/auth/loading" element={<AuthLoading />} />
                <Route path="/onboarding" element={
                  <ProtectedRoute requireAuth={false}>
                    <Onboarding />
                  </ProtectedRoute>
                } />
                <Route path="/home" element={
                  <ProtectedRoute requireAuth={true}>
                    <Header />
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute requireAuth={true}>
                    <Header />
                    <Users />
                  </ProtectedRoute>
                } />
                <Route path="/users/:id/posts" element={
                  <ProtectedRoute requireAuth={true}>
                    <Header />
                    <Posts />
                  </ProtectedRoute>
                }/>
                <Route path="/posts/new" element={
                  <ProtectedRoute requireAuth={true}>
                    <Header />
                    <PostNew />
                  </ProtectedRoute>
                }></Route>
                <Route path="/post/:id" element={
                  <ProtectedRoute requireAuth={true}>
                    <Header />
                    <PostShow />
                  </ProtectedRoute>
                }></Route>
              </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Router