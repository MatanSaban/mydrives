import React from 'react'
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import styles from "./table.module.scss";

const print_stops = (stops) => {
    return <>
        <h3>עצירות בנסיעה:</h3>
        <ol>
            <div data={"stops"}>{stops?.map((stop, index) => {
                return (
                    <li key={index}>{stop}</li>
                )
            })}</div>
        </ol>
    </>;
}

const TableRow = (props) => {
    return (
        <div className={styles.driveItem}>
            <span className={styles.driveNumber}>{props?.index}</span>
            <div id={props.item.id} className={`${styles.row} row`}>
                <div className={styles.right}>
                    <div data={"client"} className={styles.data_row}>
                        <strong>לקוח:</strong><span> {props.item.client}</span>
                    </div>
                    <div data={"startTime"} className={styles.data_row}><strong>התחלת נסיעה:</strong><span> {props.item.startTime}</span></div>
                    <div data={"estimatedDrivingTime"} className={styles.data_row}><strong>זמן מוערך:</strong><span> {props.item?.estimatedDrivingTime}</span></div>
                    <div data={"endTime"} className={styles.data_row}><strong>סיום מוגדר:</strong><span> {props.item.endTime}</span></div>
                    <div data={"startPoint"} className={styles.data_row}><strong>נק&apos; התחלה:</strong><span> {props.item?.startPoint}</span></div>
                    {props.item?.stops?.length > 0 &&
                        <div className={`${styles.data_row} ${styles.stops}`}>
                            <strong>מס&apos; עצירות: </strong><span>{props?.item?.stops?.length} עצירות</span>
                            <button onClick={() => props.handlePopup(true, print_stops(props?.item?.stops))}>הצג עצירות</button>
                        </div>
                    }
                    <div data={"endPoint"} className={styles.data_row}><strong>נק&apos; סיום:</strong><span> {props.item?.endPoint}</span></div>
                </div>
                <div className={styles.left}>
                    <div data={"date"} className={styles.data_row}>
                        <strong>תאריך: </strong><span>{props.dateFormatter(props.item.date)}</span>
                    </div>
                    <div data={"fuelPrice"} className={styles.data_row}>
                        <strong>דלק לליטר: </strong><span>{parseFloat(props.item.fuelPrice).toFixed(2)} ₪</span>
                    </div>
                    <div data={"kilometers"} className={styles.data_row}>
                        <strong>קילומטרים: </strong><span>{props.item.kilometers.toFixed(2)} ק&quot;מ
                        </span>
                    </div>
                    <div data={"fuelConsumption"} className={styles.data_row}>
                        <strong>צריכת דלק: </strong><span>{(
                            (props.item.kilometers / 17.6) *
                            props.item.fuelPrice
                        ).toFixed(2)} ₪</span>

                    </div>
                    <div data={"description"} className={styles.data_row}>
                        <strong>תיאור: </strong>
                        <span><button
                            onClick={() =>
                                props.handleDescription(
                                    props.item.client,
                                    props.item.description,
                                    props.item.startPoint,
                                    props.item.stops,
                                    props.item.endPoint
                                )
                            }
                        >
                            הצגת תיאור
                        </button></span>
                    </div>
                    <div className={`${styles.priceAndProfit} ${styles.data_row}`}>
                        <div data={"price"}><strong>מחיר: </strong><span>₪{props.item.price}</span></div>
                        <div data={"profit"} style={{ direction: "ltr" }}>
                            <strong>רווח: </strong><span>
                                ₪
                                {(
                                    props.item.price -
                                    (props.item.kilometers / 17.6) * props.item.fuelPrice
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div data={"action"} className={`${styles.actionButtons}`}>
                <span
                    className={`${styles.action_button} ${styles.edit}`}
                    action="edit"
                    onClick={(e) => props.handleClick(e, props.item)}
                >
                    <AiOutlineEdit />
                    עריכה
                </span>
                <span
                    className={`${styles.action_button} ${styles.duplicate}`} action="duplicate" onClick={(e) => props.handleClick(e)}>
                    <HiOutlineDocumentDuplicate />
                    שכפול
                </span>
                <span
                    className={`${styles.action_button} ${styles.delete}`} action="delete" onClick={(e) => props.handleClick(e)}>
                    <BsTrash />
                    מחיקה
                </span>
            </div>

        </div>
    );
}

export default TableRow
