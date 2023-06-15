import React, { useEffect, useState } from "react";
import Hero from "../../components/HeroComp/Hero";
import styles from "./myaccount.module.scss";
import axios from "axios";
import LicensePlateSearch from "../../components/CarAddCompos/LicensePlateSearch";
import CarBuilder from "../../components/CarAddCompos/CarBuilder";
import Image from "next/image";
import israelFlag from '../../public/media/images/israelFlagForLicensePlate.png';
import { AiOutlineClose } from "react-icons/ai"

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
            axios.put(`/api/users/${props?.userData?._id}`, myAccDetails).then((res) => {
                if (res.status === 200) {
                    props.handlePopup(true, <>
                        <h3>השינויים נשמרו בהצלחה!</h3>
                    </>)
                    setTimeout(() => {
                        props.handlePopup(false)
                    }, 1000);
                }
            })
        } catch (error) {

        }
    };

    const handleFields = (e) => {
        const { name, value } = e.target;
        setMyAccDetails({ ...myAccDetails, [name]: value });
    };

    const searchByVehicleId = (num) => {
        axios
            .get(`/api/licenceplates/${num}`)
            .then(function (response) {
                if (response?.data?.records?.length > 0) {
                    console.log(response.data);
                    setVehicle(response.data);
                    setIsResults(true);
                    return (response.data);
                } else {
                    setIsResults(false);
                    return "לא מצאנו את הרכב שלך";
                }
            })
    }

    const handleSetVehicle = (value) => {
        setVehicle(value);
    };

    const handleSearchByVehicleId = (num) => {
        setVehicleIdNumber(num);
    }

    const addToVehiclesCB = (data) => {
        console.log(data);
        let cars = props?.userData?.cars;
        if (props?.userData?.cars) {
            cars = [...props?.userData?.cars, data];
        } else {
            cars = [data];
        }
        axios.put(`/api/users/${props?.userData?._id}`, {
            cars: cars
        }).then((res) => {
            console.log('res');
            console.log(res);
            if (res.status === 200) {
                props.handlePopup(false);
                props.handleUserData(res.data);
            }
        })
    }

    const removeCar = (licensePlateNum) => {
        let cars = props?.userData?.cars;
        let newCars = cars.filter((car) => {
            return car.records[0].mispar_rechev != licensePlateNum.replace(/-/g, "");
        });
        axios.put(`/api/users/${props?.userData?._id}`, {
            cars: newCars
        }).then((res) => {
            console.log('res');
            console.log(res);
            if (res.status === 200) {
                props.handleUserData(res.data)
                props.handlePopup(false);
            }
        })
    };

    const deleteQ = (licensePlateNum) => {
        props.handlePopup(true, <div className={styles.centered}>
            <h3>ברצונך למחוק את רכב מס רישוי {licensePlateNum}?</h3>
            <button onClick={() => removeCar(licensePlateNum)}>כן</button>
            <button onClick={() => props.handlePopup(false)}>לא</button>
        </div>)
    }

    const generateLicensePlate = (num) => {
        let numString = num.toString();
        let licensePlate = "";

        if (numString.length === 7) {
            licensePlate = numString.replace(/(\d{2})(\d{3})(\d{2})/, "$1-$2-$3");
        } else if (numString.length === 8) {
            licensePlate = numString.replace(/(\d{3})(\d{2})(\d{3})/, "$1-$2-$3");
        } else {
            licensePlate = numString;
        }
        const jsx =
            <div className={styles.licensePlate}>
                <span className={styles.numbers}>{licensePlate}</span>
                <Image src={israelFlag} height={100} width={50} alt="Israel License Plate Flag" />
                <span onClick={() => deleteQ(licensePlate)} className={styles.delete}><AiOutlineClose /></span>
            </div>;
        return jsx;
    }

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
                    <p>כאן מוצגים הרכבים שהוספת למערכת</p>
                    {
                        props?.userData?.cars?.map((car) => {
                            return (
                                <div key={car.records[0].mispar_rechev}>
                                    {generateLicensePlate(car.records[0].mispar_rechev)}
                                </div>
                            )
                        })
                    }
                    <div className={styles.addCar}>
                        <button
                            className={styles.addCarBtn}
                            onClick={() => {
                                setShowVehicleFinder(!showVehicleFinder)
                                setShowVehicleBuilder(false)
                            }
                            }
                        >
                            הוספת רכב לפי מס&apos; רישוי
                        </button>
                        <button
                            className={styles.addCarBtn}
                            onClick={() => {
                                setShowVehicleBuilder(!showVehicleBuilder)
                                setShowVehicleFinder(false)
                            }
                            }
                        >
                            הוספת רכב ידנית
                        </button>
                        {
                            showVehicleFinder && <LicensePlateSearch
                                searchByVehicleId={searchByVehicleId}
                                handleSearchByVehicleId={handleSearchByVehicleId}
                                vehicleIdNumber={vehicleIdNumber}
                                vehicle={vehicle}
                                setVehicle={handleSetVehicle}
                                handlePopup={props.handlePopup}
                                isResults={isResults}
                                addToVehiclesCB={addToVehiclesCB}
                            />
                        }
                        {
                            showVehicleBuilder && <CarBuilder
                                searchByVehicleId={searchByVehicleId}
                                vehicleIdNumber={vehicleIdNumber}
                                vehicle={vehicle}
                                setVehicle={handleSetVehicle}
                                handlePopup={props.handlePopup}
                                addToVehiclesCB={addToVehiclesCB}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
