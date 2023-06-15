import React, { useEffect, useState } from 'react';
import styles from "../../pages/my-account/myaccount.module.scss";
import { israeliDate } from '../../functions/functions';

const LicensePlateSearch = (props) => {

    const [loader, setLoader] = useState(false);

    const addToVehicles = (data) => {
        props.addToVehiclesCB(data);
    }

    useEffect(() => {
        if (props.vehicle) {
            setLoader(false);
            props.handlePopup(true,
                props.vehicle && (
                    <div>
                        <h3>
                            הרכב שנמצא תחת מספר &quot;
                            {props.vehicle.records[0].mispar_rechev}&quot;
                        </h3>
                        {props.vehicle.records[0].tozeret_nm && <p className={styles.brandName}>
                            <strong>מותג :</strong>{" "}
                            <span>{props.vehicle.records[0].tozeret_nm}</span>
                        </p>}
                        {props.vehicle.records[0].kinuy_mishari && <p className={styles.carName}>
                            <strong>שם רכב :</strong>{" "}
                            <span>{props.vehicle.records[0].kinuy_mishari}</span>
                        </p>}
                        {props.vehicle.records[0].degem_nm && <p className={styles.carName}>
                            <strong>מספר דגם :</strong>{" "}
                            <span>{props.vehicle.records[0].degem_nm}</span>
                        </p>}
                        {props.vehicle.records[0].ramat_gimur && <p className={styles.carName}>
                            <strong>דגם :</strong>{" "}
                            <span>{props.vehicle.records[0].ramat_gimur}</span>
                        </p>}
                        {props.vehicle.records[0].shnat_yitzur && <p className={styles.year}>
                            <strong>שנת ייצור :</strong>{" "}
                            <span>{props.vehicle.records[0].shnat_yitzur}</span>
                        </p>}
                        {props.vehicle.records[0].tzeva_rechev && <p className={styles.color}>
                            <strong>צבע :</strong>{" "}
                            <span>{props.vehicle.records[0].tzeva_rechev}</span>
                        </p>}
                        {props.vehicle.records[0].moed_aliya_lakvish && <p className={styles.roadStarted}>
                            <strong>עלייה לכביש :</strong>{" "}
                            <span>
                                {israeliDate(
                                    props.vehicle.records[0].moed_aliya_lakvish
                                )}
                            </span>
                        </p>}
                        {props.vehicle.records[0].kvutzat_sug_rechev
                            && <p className={styles.color}>
                                <strong>סוג רכב :</strong>{" "}
                                <span>{props.vehicle.records[0].kvutzat_sug_rechev
                                }</span>
                            </p>}
                        {props.vehicle.records[0].nefach_manoa && <p className={styles.color}>
                            <strong>נפח מנוע :</strong>{" "}
                            <span>{props.vehicle.records[0].nefach_manoa}</span>
                        </p>}
                        {props.vehicle.records[0].tokef_dt && <p className={styles.carLicence}>
                            <strong>תוקף רישיון רכב :</strong>{" "}
                            <span>
                                {israeliDate(props.vehicle.records[0].tokef_dt)}
                            </span>
                        </p>}
                        <div className={styles.carFindOptions}>
                            <div className={styles.column}>
                                <strong>זה הרכב שלך?</strong>
                                <button className={styles.success} onClick={() => { addToVehicles(props.vehicle) }}>הוסף לרכבים שלי</button>
                            </div>
                            <div className={styles.column}>
                                <strong>
                                    לא הרכב שלך?
                                </strong>
                                <button>הזן את פרטי הרכב בעצמך</button>
                            </div>
                        </div>
                    </div>
                )
            )
        }
        props.setVehicle(null);
    }, [props.vehicle]);

    useEffect(() => {
        if (props.isResults === false) {
            setLoader("לא נמצאו תוצאות");
        }
    }, [props.isResults])

    return (
        <div>
            <h3>חיפוש לפי מספר רישוי</h3>
            <p>
                יש להזין את מספר הרישוי של רכבך וללחוץ על חיפוש, ואנו ננסה למצוא
                אותו
            </p>
            <input
                type="number"
                name="vehicleId"
                id="vehicleId"
                onChange={(e) => props.handleSearchByVehicleId(e.target.value)}
            />
            <button onClick={() => {
                setLoader("מחפשים את הרכב שלך");
                props.searchByVehicleId(props.vehicleIdNumber);
            }}>חיפוש</button>
            {
                loader
            }
        </div>
    );
}

export default LicensePlateSearch
