import React, { useEffect, useState } from 'react'
import LicensePlateSearch from '../../components/CarAddCompos/LicensePlateSearch';
import CarBuilder from '../../components/CarAddCompos/CarBuilder';
import axios from 'axios';
import styles from "./mycars.module.scss";
import Image from "next/image";
import israelFlag from '../../public/media/images/israelFlagForLicensePlate.png';
import { AiOutlineClose } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { israeliDate } from "../../functions/functions";
import Hero from '../../components/HeroComp/Hero';
import GeneralForm from '../../components/FormBuilder/GeneralForm';



const MyCars = (props) => {

    const [vehicleIdNumber, setVehicleIdNumber] = useState("");
    const [vehicle, setVehicle] = useState();
    const [showVehicleFinder, setShowVehicleFinder] = useState(false);
    const [showVehicleBuilder, setShowVehicleBuilder] = useState(false);
    const [isResults, setIsResults] = useState();
    const [userCars, setUserCars] = useState(props?.userData?.cars);
    const [formJson, setFormJson] = useState({
        "fields": [
            {
                "label": "מספר רכב",
                "name": "mispar_rechev",
                "type": "number",
                "maxLength": 8,
                "minLength": 7,
                "required": true,
                "defaultValue": "car?.records[0]?.mispar_rechev",
                "placeholder": "XXX-XX-XXX או XX-XXX-XX",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "יצרן",
                "name": "tozeret_nm",
                "type": "text",
                "defaultValue": "car?.records[0]?.tozeret_nm",
                "placeholder": "מאזדה יפן",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "שם רכב",
                "name": "kinuy_mishari",
                "type": "text",
                "defaultValue": "car?.records[0]?.kinuy_mishari",
                "placeholder": "מאזדה 3",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "מזהה דגם",
                "name": "degem_nm",
                "type": "text",
                "defaultValue": "car?.records[0]?.degem_nm",
                "placeholder": "מזהה דגם",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "רמת גימור",
                "name": "ramat_gimur",
                "type": "text",
                "defaultValue": "car?.records[0]?.ramat_gimur",
                "placeholder": "SPIRIT",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "שנת ייצור",
                "name": "shnat_yitzur",
                "type": "number",
                "defaultValue": "car?.records[0]?.shnat_yitzur",
                "placeholder": "2023",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "צבע רכב",
                "name": "tzeva_rechev",
                "type": "text",
                "defaultValue": "car?.records[0]?.tzeva_rechev",
                "placeholder": "כסף מטאלי",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "מועד עלייה לכביש",
                "name": "moed_aliya_lakvish",
                "type": "text",
                "defaultValue": "car?.records[0]?.moed_aliya_lakvish",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "תוקף רישיון רכב",
                "name": "tokef_dt",
                "type": "date",
                "defaultValue": "car?.records[0]?.tokef_dt",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "סוג רכב",
                "name": "kvutzat_sug_rechev",
                "type": "text",
                "defaultValue": "car?.records[0]?.kvutzat_sug_rechev",
                "placeholder": "אוטובוס / מיניבוס / טיולית..",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "נפח מנוע",
                "name": "nefach_manoa",
                "type": "text",
                "defaultValue": "car?.records[0]?.nefach_manoa",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            },
            {
                "label": "ל' דלק ל-1 ק\"מ (משולב)",
                "name": "tzrichat_delek",
                "type": "number",
                "placeholder": "11",
                "defaultValue": "car?.records[0]?.tzrichat_delek",
                "attributes": {
                    "onChange": "handleCarInputs"
                }
            }
        ]
    }
    );

    useEffect(() => {
        setUserCars(props?.userData?.cars);
    }, [props?.userData]);

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


    const editCar = (car) => {
        props.handlePopup(
            true,
            <div className={styles.editLicenseWrapper}>
                <GeneralForm buttonText={"שמירה"} json={formJson} onChangeFunc={handleCarInputs} onSubmitFunc={handleCarSave} passedData={car} />
            </div>
        );
    }



    const handleCarSave = (e) => {
        props.handlePopup(true, <h3>שומר את השינויים...</h3>);
        e.preventDefault();
        axios
            .put(`/api/users/${props?.userData?._id}`, {
                cars: props?.userData?.cars
            })
            .then((res) => {
                if (res.status === 200) {
                    props.handleUserData(res.data);
                    props.handlePopup(
                        true,
                        <h3>העדכונים נשמרו, חלון זה ייסגר מיד</h3>
                    );
                    setTimeout(() => {
                        props.handlePopup(
                            false,
                            <h3>העדכונים נשמרו, חלון זה ייסגר מיד</h3>
                        );
                    }, 1000);
                } else {
                    props.handlePopup(
                        true,
                        <h3>העדכונים לא נשמרו, נא לרענן את הדף ולנסות שוב.</h3>
                    );
                    setTimeout(() => {
                        props.handlePopup(
                            false,
                            <h3>
                                העדכונים לא נשמרו, נא לרענן את הדף ולנסות שוב.
                            </h3>
                        );
                    }, 1500);
                }
            });
    }

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
                    setUserCars(res?.data?.cars);
                    props.handleUserData(res.data);
                    props.handlePopup(false);
                }
            });
    };

    const searchByVehicleId = (num) => {
        axios.get(`/api/licenceplates/${num}`).then((res) => {
            if (res.status === 200) {
                if (res.data == "no results") {
                    setIsResults("לא מצאנו את הרכב שלך");
                    return "לא מצאנו את הרכב שלך";
                }
                if (res?.data?.records?.length > 0) {
                    console.log(res.data);
                    setVehicle(res.data);
                    setIsResults(true);
                    return res.data;
                } else {
                    setIsResults(false);
                    return "לא מצאנו את הרכב שלך";
                }
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
        let cars = props?.userData?.cars;
        if (props?.userData?.cars?.length > 0) {
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


    const handleCarInputs = (e, carItem) => {
        console.log('carItem');
        console.log(carItem);
        const { name, value } = e.target;
        let exist = false;
        let newCars = userCars;

        newCars.forEach((car) => {
            if (car.records[0].mispar_rechev === carItem.records[0].mispar_rechev) {
                car.records[0][name] = value;
                exist = true;
            }
        });
        if (!exist) {
            console.log("not exist blat");
        }

        setUserCars(newCars);
        const newUserData = props?.userData;
        newUserData.cars = newCars;
        props.handleUserData(newUserData);
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

                <button onClick={() => editCar(car)}>עריכת הרכב</button>
            </div>
        );
    };


    return (
        <div className={styles.myCars}>
            <Hero title="הרכבים שלי" />

            {props?.userData?.cars?.length <= 0 && (
                <h5>טרם הוספת רכבים</h5>
            )}
            {props?.userData?.cars?.map((car) => {
                return (
                    <div key={car?.records[0]?.mispar_rechev}>
                        {generateLicensePlate(
                            car?.records[0]?.mispar_rechev,
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
                        // setShowVehicleBuilder(!showVehicleBuilder);
                        setUserCars([...userCars, {}]);
                        editCar(null);
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
    )
}

export default MyCars
