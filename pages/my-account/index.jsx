import React, { useEffect, useState } from "react";
import Hero from "../../components/HeroComp/Hero";
import styles from "./myaccount.module.scss";
import axios from "axios";
import LicensePlateSearch from "../../components/CarAddCompos/LicensePlateSearch";
import CarBuilder from "../../components/CarAddCompos/CarBuilder";
import Image from "next/image";
import israelFlag from "../../public/media/images/israelFlagForLicensePlate.png";
import { AiOutlineClose } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { israeliDate } from "../../functions/functions";

const MyAccount = (props) => {
    const [myAccDetails, setMyAccDetails] = useState();
    const [vehicleIdNumber, setVehicleIdNumber] = useState("");
    const [vehicle, setVehicle] = useState();
    const [showVehicleFinder, setShowVehicleFinder] = useState(false);
    const [showVehicleBuilder, setShowVehicleBuilder] = useState(false);
    const [isResults, setIsResults] = useState();

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
                    }
                });
        } catch (error) {}
    };

    const handleFields = (e) => {
        const { name, value } = e.target;
        setMyAccDetails({ ...myAccDetails, [name]: value });
    };

    const searchByVehicleId = (num) => {
        axios.get(`/api/licenceplates/${num}`).then(function (response) {
            if (response?.data?.records?.length > 0) {
                console.log(response.data);
                setVehicle(response.data);
                setIsResults(true);
                return response.data;
            } else {
                setIsResults(false);
                return "לא מצאנו את הרכב שלך";
            }
        });
    };

    const handleSetVehicle = (value) => {
        setVehicle(value);
    };

    const handleSearchByVehicleId = (num) => {
        setVehicleIdNumber(num);
    };

    const addToVehiclesCB = (data) => {
        console.log(data);
        let cars = props?.userData?.cars;
        if (props?.userData?.cars) {
            cars = [...props?.userData?.cars, data];
        } else {
            cars = [data];
        }
        axios
            .put(`/api/users/${props?.userData?._id}`, {
                cars: cars,
            })
            .then((res) => {
                console.log("res");
                console.log(res);
                if (res.status === 200) {
                    props.handlePopup(false);
                    props.handleUserData(res.data);
                }
            });
    };

    const removeCar = (licensePlateNum) => {
        let cars = props?.userData?.cars;
        let newCars = cars.filter((car) => {
            return (
                car.records[0].mispar_rechev !=
                licensePlateNum.replace(/-/g, "")
            );
        });
        axios
            .put(`/api/users/${props?.userData?._id}`, {
                cars: newCars,
            })
            .then((res) => {
                console.log("res");
                console.log(res);
                if (res.status === 200) {
                    props.handleUserData(res.data);
                    props.handlePopup(false);
                }
            });
    };

    const deleteQ = (licensePlateNum) => {
        props.handlePopup(
            true,
            <div className={styles.centered}>
                <h3>ברצונך למחוק את רכב מס רישוי {licensePlateNum}?</h3>
                <button onClick={() => removeCar(licensePlateNum)}>כן</button>
                <button onClick={() => props.handlePopup(false)}>לא</button>
            </div>
        );
    };

    const handleLicensePlate = (car) => {
        props.handlePopup(
            true,
            <div>
                <h3>פרטי הרכב</h3>

                {car.records[0].mispar_rechev && (
                    <p className={styles.brandName}>
                        <strong>מספר רכב :</strong>{" "}
                        <span>{car.records[0].mispar_rechev}</span>
                    </p>
                )}
                {car.records[0].tozeret_nm && (
                    <p className={styles.brandName}>
                        <strong>מותג :</strong>{" "}
                        <span>{car.records[0].tozeret_nm}</span>
                    </p>
                )}
                {car.records[0].kinuy_mishari && (
                    <p className={styles.carName}>
                        <strong>שם רכב :</strong>{" "}
                        <span>{car.records[0].kinuy_mishari}</span>
                    </p>
                )}
                {car.records[0].degem_nm && (
                    <p className={styles.carName}>
                        <strong>מספר דגם :</strong>{" "}
                        <span>{car.records[0].degem_nm}</span>
                    </p>
                )}
                {car.records[0].ramat_gimur && (
                    <p className={styles.carName}>
                        <strong>דגם :</strong>{" "}
                        <span>{car.records[0].ramat_gimur}</span>
                    </p>
                )}
                {car.records[0].shnat_yitzur && (
                    <p className={styles.year}>
                        <strong>שנת ייצור :</strong>{" "}
                        <span>{car.records[0].shnat_yitzur}</span>
                    </p>
                )}
                {car.records[0].tzeva_rechev && (
                    <p className={styles.color}>
                        <strong>צבע :</strong>{" "}
                        <span>{car.records[0].tzeva_rechev}</span>
                    </p>
                )}
                {car.records[0].moed_aliya_lakvish && (
                    <p className={styles.roadStarted}>
                        <strong>עלייה לכביש :</strong>{" "}
                        <span>
                            {israeliDate(car.records[0].moed_aliya_lakvish)}
                        </span>
                    </p>
                )}
                {car.records[0].kvutzat_sug_rechev && (
                    <p className={styles.color}>
                        <strong>סוג רכב :</strong>{" "}
                        <span>{car.records[0].kvutzat_sug_rechev}</span>
                    </p>
                )}
                {car.records[0].nefach_manoa && (
                    <p className={styles.color}>
                        <strong>נפח מנוע :</strong>{" "}
                        <span>{car.records[0].nefach_manoa}</span>
                    </p>
                )}
                {car.records[0].tokef_dt && (
                    <p className={styles.carLicence}>
                        <strong>תוקף רישיון רכב :</strong>{" "}
                        <span>{israeliDate(car.records[0].tokef_dt)}</span>
                    </p>
                )}
                {console.log(car)}

                <button>עריכת הרכב</button>
            </div>
        );
    };

    const editCar = (car) => {
        props.handlePopup(
            true,
            <div className={styles.editLicenseWrapper}>
                <h3>עריכת רכב</h3>
                <div className={styles.editLicenseFields}>
                    <p>מספר רכב</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.mispar_rechev}
                    />
                    <p>ארץ ייצור</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.tozeret_nm}
                    />
                    <p>שם רכב</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.kinuy_mishari}
                    />
                    <p>דגם</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.degem_nm}
                    />
                    <p>רמת גימור</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.ramat_gimur}
                    />
                    <p>שנת ייצור</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.shnat_yitzur}
                    />
                    <p>צבע רכב</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.tzeva_rechev}
                    />
                    <p>מועד עלייה לכביש</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.moed_aliya_lakvish}
                    />
                    <p>סוג רכב</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.kvutzat_sug_rechev}
                    />
                    <p>נפח מנוע</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.nefach_manoa}
                    />
                    <p>תוקף רישיון רכב</p>
                    <input
                        type="text"
                        defaultValue={car?.records[0]?.tokef_dt}
                    />
                </div>
                <button>שמירה</button>
            </div>
        );
    }

    const generateLicensePlate = (num, car) => {
        let numString = num.toString();
        let licensePlate = "";

        if (numString.length === 7) {
            licensePlate = numString.replace(
                /(\d{2})(\d{3})(\d{2})/,
                "$1-$2-$3"
            );
        } else if (numString.length === 8) {
            licensePlate = numString.replace(
                /(\d{3})(\d{2})(\d{3})/,
                "$1-$2-$3"
            );
        } else {
            licensePlate = numString;
        }
        const jsx = (
            <div className={styles.licensePlateWrapper}>
                <div
                    className={styles.licensePlate}
                    onClick={() => handleLicensePlate(car)}
                >
                    <span className={styles.numbers}>{licensePlate}</span>
                    <div className={styles.imageWrapper}>
                        <Image
                            style={{ position: "inherit" }}
                            className={`${styles.israelFlag}`}
                            src={israelFlag}
                            height={100}
                            width={50}
                            alt="Israel License Plate Flag"
                        />
                    </div>
                </div>
                <span
                    className={`${styles.edit} ${styles.icons}`}
                    onClick={() => editCar(car)}
                >
                    <CiEdit />
                </span>
                <span
                    className={`${styles.delete} ${styles.icons}`}
                    onClick={() => deleteQ(licensePlate)}
                >
                    <AiOutlineClose />
                </span>
            </div>
        );
        return jsx;
    };

    // useEffect(() => {
    //     if (vehicleIdNumber) {
    //         searchByVehicleId(vehicleIdNumber);
    //     }

    // }, [vehicle, vehicleIdNumber])

    return (
        <div className={styles.main}>
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
                        <form onSubmit={(e) => handleForm(e)}>
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
                        </form>
                    </div>
                </div>
                <div className={styles.myCars}>
                    <h3>הרכבים שלי</h3>
                    {props?.userData?.cars?.length <= 0 && (
                        <h5>טרם הוספת רכבים</h5>
                    )}
                    {props?.userData?.cars?.map((car) => {
                        return (
                            <div key={car.records[0].mispar_rechev}>
                                {generateLicensePlate(
                                    car.records[0].mispar_rechev,
                                    car
                                )}
                            </div>
                        );
                    })}
                    <div className={styles.addCar}>
                        <button
                            className={styles.addCarBtn}
                            onClick={() => {
                                setShowVehicleFinder(!showVehicleFinder);
                                setShowVehicleBuilder(false);
                            }}
                        >
                            הוספת רכב לפי מס&apos; רישוי
                        </button>
                        <button
                            className={styles.addCarBtn}
                            onClick={() => {
                                setShowVehicleBuilder(!showVehicleBuilder);
                                setShowVehicleFinder(false);
                            }}
                        >
                            הוספת רכב ידנית
                        </button>
                        {showVehicleFinder && (
                            <LicensePlateSearch
                                searchByVehicleId={searchByVehicleId}
                                handleSearchByVehicleId={
                                    handleSearchByVehicleId
                                }
                                vehicleIdNumber={vehicleIdNumber}
                                vehicle={vehicle}
                                setVehicle={handleSetVehicle}
                                handlePopup={props.handlePopup}
                                isResults={isResults}
                                addToVehiclesCB={addToVehiclesCB}
                            />
                        )}
                        {showVehicleBuilder && (
                            <CarBuilder
                                searchByVehicleId={searchByVehicleId}
                                vehicleIdNumber={vehicleIdNumber}
                                vehicle={vehicle}
                                setVehicle={handleSetVehicle}
                                handlePopup={props.handlePopup}
                                addToVehiclesCB={addToVehiclesCB}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
