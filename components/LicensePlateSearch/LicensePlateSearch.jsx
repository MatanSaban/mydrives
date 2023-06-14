import React, { useEffect } from 'react';
import styles from "../../pages/my-account/myaccount.module.scss";


const LicensePlateSearch = (props) => {
    const israeliDate = (dateStr) => {
        let parts = dateStr?.split("-");
        let newDate;
        if (parts) {
            if (parts[2]) {
                newDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            } else if (!parts[2]) {
                newDate = `${parts[1]}/${parts[0]}`;
            } else if (!parts[0]) {
                newDate = `${parts[2]}/${parts[1]}`;
            }    
        }
        return newDate;
    };

    // useEffect(() => {
    //     if (props.vehicle) {
    //         props.handlePopup(
    //             true,
                
    //         );
    //     }
    // }, [props.vehicle]);

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
                onBlur={(e) => props.searchByVehicleId(e.target.value)}
            />
            <button onClick={() => props.setVehicle(null)}>חיפוש</button>
            {props.vehicle && (
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
                    {props.vehicle.records[0].tokef_dt && <p className={styles.carLicence}>
                        <strong>תוקף רישיון רכב :</strong>{" "}
                        <span>
                            {israeliDate(props.vehicle.records[0].tokef_dt)}
                        </span>
                    </p>}
                    <strong>
                        לא הרכב שלך?
                    </strong>
                    <button>הזן את פרטי הרכב בעצמך</button>
                </div>
            )}
        </div>
    );
}

export default LicensePlateSearch
