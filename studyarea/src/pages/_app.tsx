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
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


import { appWithTranslation } from "next-i18next";
 function App({ Component, pageProps }: AppProps) {
  function AuthListener() {
    const dispatch = useDispatch();
   useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {

      
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/user/create",
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }
      );

      dispatch(
        login({
          id:user.uid,
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

  return () => unsubscribe();
}, [dispatch]);

    return null;
  }
  return (
    <Provider store={store}>
      {" "}
      <AuthListener /> <ToastContainer /> <Navbar />{" "}
      <Component {...pageProps} /> <Footer />{" "}
    </Provider>
  );
}

export default appWithTranslation(App)
