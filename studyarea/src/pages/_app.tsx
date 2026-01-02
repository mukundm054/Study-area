import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../Store/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { auth } from "@/Firebase/firebase";
import { login, logout } from "@/Fetaure/Userslice";
import { User } from "firebase/auth";
import { ToastContainer,toast } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  
  function AuthListener() {
    const dispatch = useDispatch();
    useEffect(() => {
      auth.onAuthStateChanged((user: User | null) => {
        if (user) {
          dispatch(
            login({
              uid: user.uid,
              photo: user.photoURL,
              name: user.displayName,
              email: user.email,
              phoneNumber: user.phoneNumber,
            })
          );
        } else {
          dispatch(logout());
        }
      });
    }, [dispatch]);
    return null;
  }

  return (
    <Provider store={store}>
      <AuthListener />
      <ToastContainer/>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      
    </Provider>
  );
}
