import React from "react";
import Hero from "../../components/HeroComp/Hero";
import styles from './login.module.scss';
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Login = (props) => {
    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        const userEmail = e.target[0].value;
        const password = e.target[1].value;

        axios
            .post(`/api/login`, {
                email: userEmail,
                password: password,
            })
            .then((res) => {
                console.log("res from login");
                console.log(res);
                const token = res.data.token;
                const userData = res.data.user;
                Cookies.set("token", token);
                Cookies.set("userId", userData._id);
                props.handleUserData(userData);
                const popupContent = (
                    <>
                        <h3>היי {userData.firstname}, שמחים שחזרת!</h3>
                        <p>מיד תועבר לעמוד הנסיעות שלי.</p>
                    </>
                );
                props.handlePopup(true, popupContent);
                setTimeout(() => {
                    props.handlePopup(false, popupContent);
                    router.push("/my-drives");
                }, 3000);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    props.handlePopup(
                        true,
                        <>
                            <h3>אחד הפרטים שהזנת שגויים</h3>
                        </>
                    );
                    setTimeout(() => {
                        props.handlePopup(
                            false,
                            <>
                                <h3>אחד הפרטים שהזנת שגויים</h3>
                            </>
                        );
                    }, 1000);
                }
            });
    };


    return (
        <div className={styles.main}>
            <Hero title={"התחברות"} />
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className={styles.inputsWrapper}>
                    <div className={styles.dataWrapper}>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="אימייל"
                            required
                            // onChange={(e) => handleFields(e)}
                        />
                    </div>
                    <div className={styles.dataWrapper}>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="סיסמא"
                            required
                            // onChange={(e) => handleFields(e)}
                        />
                    </div>
                </div>
                <button className={styles.submit}>התחברות</button>
            </form>
        </div>
    );
};

export default Login;
