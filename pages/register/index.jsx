import React, { useState } from "react";
import Hero from "../../components/HeroComp/Hero";
import styles from "./registerForm.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";


const Register = (props) => {

	const [user, setUser] = useState();
    

	const router = useRouter();

	const handleFields = (e) => {
		const {value, name} = e.target;
		return setUser({...user, [name]: value});
	}
	const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/users`, user);
            const data = await res.data.user;
            const token = await res.data.token;
            Cookies.set("token", token);
            Cookies.set("userId", data._id);
            props.handleUserData(data);
            props.handlePopup( 
                true,
                <>
                    <div>
                        <h3>שמחים שהצטרפת אלינו {data.firstname}!</h3>
                        <p>
                            מיד תועבר לעמוד הנסיעות שלך
                            <br />
                            שם תוסיף את הנסיעות היומיות שלך, <br />
                            תעקוב אחרי הוצאות, הכנסות, רווח ולקוחות.
                        </p>
                    </div>
                </>
            );
            setTimeout(() => {
                props.handlePopup(false, "");
                router.push("/my-drives");
            }, 5000);
        } catch (error) {
            if (error.response.status === 409) {
                props.handlePopup(
                    true,
                    <>
                        <div>
                            <h3>ההרשמה נכשלה</h3>
                            <p>כתובת המייל שהזנת כבר קיימת במערכת</p>
                        </div>
                    </>
                );
                setTimeout(() => {
                    props.handlePopup(false, "");
                }, 5000);
            } else {
                console.log(error);
            }
        }
    };


    return (
        <div className={styles.main}>
            <Hero title={"הרשמה"} />
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className={styles.inputsWrapper}>
                    <div className={styles.dataWrapper}>
                        {/* <label htmlFor="firstname">שם פרטי</label> */}
                        <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            placeholder="שם פרטי"
							required
                            onChange={(e) => handleFields(e)}
                        />
                    </div>
                    <div className={styles.dataWrapper}>
                        {/* <label htmlFor="lastname">שם משפחה</label> */}
                        <input
                            type="text"
                            name="lastname"
                            id="lastname"
                            placeholder="שם משפחה"
							required
                            onChange={(e) => handleFields(e)}
                        />
                    </div>
                    <div className={styles.dataWrapper}>
                        {/* <label htmlFor="email">אימייל</label> */}
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="אימייל"
							required
                            onChange={(e) => handleFields(e)}
                        />
                    </div>
                    <div className={styles.dataWrapper}>
                        {/* <label htmlFor="password">סיסמא</label> */}
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="סיסמא"
							required
                            onChange={(e) => handleFields(e)}
                        />
                    </div>
                </div>
                <button className={styles.submit}>הרשמה</button>
            </form>
        </div>
    );
};

export default Register;
