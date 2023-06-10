import React, { useState } from "react";
import styles from "./table.module.scss";

const TableFooter = (props) => {
    const { data } = props;

    // Calculate the total price, number of drives, and total kilometers of all drives
    const totalProfit = data?.reduce(
        (sum, item) => sum + parseInt(item.price),
        0
    );
    const totalFuelExpense = data?.reduce(
        (sum, item) =>
            sum + ((item.kilometers / 17.6) * parseInt(item.fuelPrice)),
        0
    );

    const numDrives = data?.length;
    const totalKilometers = data?.reduce(
        (sum, item) => sum + parseInt(item.kilometers),
        0
    );

    const driveCounts = {};

    // Calculate the drive count for each client
    data?.forEach((item) => {
        if (driveCounts[item.client]) {
            driveCounts[item.client]++;
        } else {
            driveCounts[item.client] = 1;
        }
    });



    return (
        <div className={styles.footer}>
            <div className={`${styles.footerCell} ${styles.summary}`}>
                {Object.values(driveCounts).length > 0
                    ? Object.values(driveCounts).reduce((a, b) => a + b)
                    : 0}{" "}
                נסיעות
            </div>

            <div className={`${styles.footerCell} ${styles.summary}`}>
                {totalKilometers?.toFixed(2)} קילומטרים
            </div>
            
            <div className={`${styles.footerCell} ${styles.summary}`}>
                דלק: ₪{totalFuelExpense?.toFixed(2)}
            </div>
            <div className={`${styles.footerCell} ${styles.summary}`}>
                הכנסות: ₪{parseInt(totalProfit)?.toFixed(2)}
            </div>
            <div className={`${styles.footerCell} ${styles.summary}`}>
                רווח : ₪{(totalProfit - totalFuelExpense).toFixed(2)}
            </div>
        </div>
    );
};

export default TableFooter;
