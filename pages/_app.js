import styles from "../styles/globals.scss";
import Footer from "../components/FooterComp/Footer";
import Header from "../components/HeaderComp/Header";
import Popup from "../components/Popup/Popup";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import useMediaQuery from "../components/Hooks/useMediaQuery";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"]; // define the libraries needed


function MyApp({ Component, pageProps }) {
    
    const router = useRouter();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPopup, setShowPopup] = useState(<Popup show={false} />);
    const [popupContent, setPopupContent] = useState("");
    const [userData, setUserData] = useState();
    const isDesktopDevice = useMediaQuery("(min-width: 1280px)");
    const isLaptopDevice = useMediaQuery(
        "(min-width: 1024px) and (max-width: 1279px)"
    );
    const isTabletDevice = useMediaQuery(
        "(min-width: 768px) and (max-width: 1023px)"
        );
    const isMobileDevice = useMediaQuery("(max-width: 767px)");


    useEffect(() => {
        const token = Cookies.get("token");
        const userId = Cookies.get("userId");
        if (token && !isLoggedIn) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            setIsLoggedIn(true);
            axios
                .get(`/api/users/${userId}`)
                .then((response) => {
                    setUserData(response.data.user);
                    setIsLoggedIn(true);
                })
                .catch((error) => {
                });
        }
    }, [userData]);



    const handlePopup = (bool, content) => {
        setShowPopup(
            <Popup content={bool ? content : null} handlePopup={handlePopup} show={bool} />
        );
    };
    

    const handleUserData = (data) => {
        return setUserData(data);
    }

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('userId');
        const popupContent = (
            <div>
                <h3>{userData.firstname} נתגעגע אלייך :(</h3>
                <p>התנתקת מהאתר בהצלחה ומיד תועבר לעמוד הבית.</p>
            </div>
        );
        handlePopup(true, popupContent);
        setTimeout(() => {
            handlePopup(false, popupContent);
            setUserData(null);
            setIsLoggedIn(false);
            router.push('/');
        }, 2000);
    }

    const forbiddenPages = ['/my-account', '/my-drives']

    useEffect(() => {
        forbiddenPages.forEach((slug) => {
            if (!isLoggedIn) {
                if (slug === router.asPath) {
                    handlePopup(
                        true,
                        "כדי לצפות בעמוד זה, עליך להיות רשום ומחובר לאתר"
                    );
                    setTimeout(() => {
                        handlePopup(
                            false,
                            "כדי לצפות בעמוד זה, עליך להיות רשום ומחובר לאתר"
                        );
                        router.push("/");
                    }, 1500);
                }
            }
        })
    },[router])
useEffect(() => {
    const intervalId = setInterval(() => {
        const closeButton = document.querySelector('.gm-ui-hover-effect');

        if (closeButton) {
            closeButton.style.boxShadow = 'none !important';
            clearInterval(intervalId);
        }
    }, 100);

    return () => clearInterval(intervalId); // cleanup on unmount
}, []);

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyDgjKrFe0QRKr2bDKhKsxjEiphntKAs1hk"
            libraries={libraries}
        >
            {showPopup}
            <Header
                handlePopup={handlePopup}
                userData={userData}
                isLoggedIn={isLoggedIn}
                logout={logout}
                isMobileDevice={isMobileDevice}
                isTabletDevice={isTabletDevice}
                isLaptopDevice={isLaptopDevice}
                isDesktopDevice={isDesktopDevice}
            />
            <Component
                handlePopup={handlePopup}
                {...pageProps}
                handleUserData={handleUserData}
                userData={userData}
                isLoggedIn={isLoggedIn}
                logout={logout}
                isMobileDevice={isMobileDevice}
                isTabletDevice={isTabletDevice}
                isLaptopDevice={isLaptopDevice}
                isDesktopDevice={isDesktopDevice}
            />
            <Footer />

        </LoadScript>
    );
}

export default MyApp;
 