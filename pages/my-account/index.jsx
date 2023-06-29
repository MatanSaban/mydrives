import React, { useEffect, useState } from "react";
import Hero from "../../components/HeroComp/Hero";
import styles from "./myaccount.module.scss";
import axios from "axios";
import GeneralForm from "../../components/FormBuilder/GeneralForm";

const MyAccount = (props) => {
  const [myAccDetails, setMyAccDetails] = useState();

  useEffect(() => {
    const userData = props?.userData;
    setMyAccDetails({
      firstname: userData?.firstname,
      lastname: userData?.lastname,
      email: userData?.email,
    });
  }, [props?.userData]);

  const handleForm = (e) => {
    e.preventDefault();
    const form = e;
    props.handlePopup(
      true,
      <>
        <h3>מאמת את הטופס</h3>
        <p>בודק שהכל בסדר עם הטופס...</p>
      </>
    );
    try {
      axios
        .put(`/api/users/${props?.userData?._id}`, myAccDetails)
        .then((res) => {
          if (res.status === 200) {
            props.handlePopup(
              true,
              <>
                <h3>השינויים נשמרו בהצלחה!</h3>
              </>
            );
            setTimeout(() => {
              props.handlePopup(false);
            }, 1000);
            props?.handleUserData(res.data);
          }
        });
    } catch (error) {}
  };

  const handleFields = (e) => {
    const { name, value } = e.target;
    setMyAccDetails({ ...myAccDetails, [name]: value });
  };

  const formJson = {
    fields: [
      {
        label: "שם פרטי",
        name: "firstname",
        type: "text",
        defaultValue: props?.userData?.firstname,
        value: props?.userData?.firstname,
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "שם משפחה",
        name: "lastname",
        type: "text",
        defaultValue: props?.userData?.lastname,
        // value: props?.userData?.lastname,
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "אימייל",
        name: "email",
        type: "email",
        defaultValue: props?.userData?.email,
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "סיסמא",
        name: "password",
        type: "password",
        autocomplete: "true",
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
    ],
  };

  return (
    <div className={`${styles.main} ${styles.myaccountpage}`}>
      <Hero title="החשבון שלי" />
      <p>ברוכים הבאים לעמוד החשבון שלי</p>
      <p>
        כאן תוכל לנהל ולשנות את פרטי החשבון שלך,
        <br />
        לסדר את הרכבים שלך באתר ועוד..
      </p>
      <div className={styles.myAccountContentWrapper}>
        <div>
          <div className={styles.formWrapper}>
            <h3>פרטי החשבון שלי</h3>
            <GeneralForm
              buttonText={"שמירת שינויים"}
              json={formJson}
              passedData={props?.userData}
              onChangeFunc={handleFields}
              onSubmitFunc={handleForm}
              parentPage={"myaccountpage"}
            />
            {/* <form onSubmit={(e) => handleForm(e)}>
                            <div className={styles.inputWrapper}>
                                <label htmlFor="firstname">שם פרטי</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    placeholder="שם פרטי"
                                    defaultValue={props?.userData?.firstname}
                                    onChange={(e) => handleFields(e)}
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <label htmlFor="lastname">שם משפחה</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    placeholder="שם משפחה"
                                    defaultValue={props?.userData?.lastname}
                                    onChange={(e) => handleFields(e)}
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <label htmlFor="email">אימייל</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="אימייל"
                                    defaultValue={props?.userData?.email}
                                    onChange={(e) => handleFields(e)}
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <label htmlFor="password">סיסמא</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="סיסמא"
                                    onChange={(e) => handleFields(e)}
                                />
                            </div>
                            <div className={styles.buttonWrapper}>
                                <button className={styles.submitButton}>
                                    שמירת שינויים
                                </button>
                            </div>
                        </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
