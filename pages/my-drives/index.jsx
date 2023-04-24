import React, { useEffect, useState } from 'react'
import Hero from '../../components/HeroComp/Hero';
import styles from './mydrives.module.scss';
import MyDay from '../../components/MyDrivesComps/MyDay/MyDay';
import MyWeek from '../../components/MyDrivesComps/MyWeek/MyWeek';
import MyMonth from '../../components/MyDrivesComps/MyMonth/MyMonth';
import MyAllMonths from '../../components/MyDrivesComps/MyAllMonths/MyAllMonths';

const MyDrives = (props) => {

    const [tab, setTab] = useState(null);
    const [fuelPrice, setFuelPrice] = useState();

    useEffect(() => {
        setTab(
            <MyDay
                handleFuelPrice={handleFuelPrice}
                fuelPrice={fuelPrice}
                handleUserData={props.handleUserData}
                userData={props.userData}
                handlePopup={props.handlePopup}
            />
        );
    }, [fuelPrice,props.userData]);

    function getHebrewDate(format) {
        const date = new Date();
        const weekdays = [
            "ראשון",
            "שני",
            "שלישי",
            "רביעי",
            "חמישי",
            "שישי",
            "שבת",
        ];
        if (format === "day") {
            return weekdays[date.getDay()];
        } else {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${day}/${month}/${year}`;
        }
    }
    const today = getHebrewDate();
    const dayName = getHebrewDate("day"); // returns "יום חמישי"

    

    const handleFuelPrice = (price) => {
        return setFuelPrice(price);
    };

    return (
        <div className={styles.myDrivesWrapper}>
            <Hero title={"הנסיעות שלי"} />
            <div className={styles.tableWrapper}>
                <h3>
                    היום יום {dayName}, בתאריך : {today}
                </h3>
                {tab}
            </div>
        </div>
    );
}

export default MyDrives
