import React, { useState } from "react";
import styles from "./table.module.scss";

const EditRow = (props) => {

    const [item, setItem] = useState(props.itemData);

    const handleFields = (e) => {
        const {name, value} = e.target;
            setItem((prevItem) => {
                return {
                    ...prevItem,
                    [name]: value,
                };
            });
    }

    const handleSave = (e) => {
        e.preventDefault();
        props.handleEditSave(item, e);
    }

    return (
        <div id={props.itemData.id} className={`${styles.row} row`}>
            <form onSubmit={(e) => handleSave(e)}>
                <div className={`${styles.cell} ${styles.column}`}>
                    <label htmlFor="date">תאריך</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        defaultValue={props.itemData.date}
                        onChange={(e) => handleFields(e)}
                    />
                </div>
                <div className={`${styles.cell} ${styles.column}`}>
                    <label htmlFor="client">לקוח</label>
                    <input
                        type="text"
                        name="client"
                        id="client"
                        required
                        defaultValue={props.itemData.client}
                        onChange={(e) => handleFields(e)}
                    />
                </div>
                <div className={`${styles.cell} ${styles.column}`}>
                    <div>
                        <label htmlFor="startTime">שעת התחלה</label>
                        <input
                            type="time"
                            name="startTime"
                            id="startTime"
                            required
                            defaultValue={props.itemData.startTime}
                            onChange={(e) => handleFields(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime">שעת סיום</label>
                        <input
                            type="time"
                            name="endTime"
                            id="endTime"
                            required
                            defaultValue={props.itemData.endTime}
                            onChange={(e) => handleFields(e)}
                        />
                    </div>
                </div>
                <div
                    className={`${styles.cell} ${styles.column}`}
                    style={{ width: "100%" }}
                >
                    <label htmlFor="description">תיאור הנסיעה</label>
                    <textarea
                        name="description"
                        id="description"
                        cols="30"
                        rows="3"
                        defaultValue={props.itemData.description}
                        onChange={(e) => handleFields(e)}
                        style={{ width: "100px" }}
                    ></textarea>
                </div>
                <div className={`${styles.cell} ${styles.column}`}>
                    <div>
                        <label htmlFor="fuelPrice">מחיר ליטר</label>
                        <input
                            type="number"
                            name="fuelPrice"
                            id="fuelPrice"
                            required
                            defaultValue={props.itemData.fuelPrice}
                            onChange={(e) => handleFields(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="kilometers">קילומטרים</label>
                        <input
                            type="number"
                            name="kilometers"
                            id="kilometers"
                            required
                            defaultValue={props.itemData.kilometers}
                            onChange={(e) => handleFields(e)}
                        />
                    </div>
                </div>
                <div className={`${styles.cell} ${styles.column}`}>
                    <label htmlFor="price">מחיר נסיעה</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        defaultValue={props.itemData.price}
                        onChange={(e) => handleFields(e)}
                    />
                </div>
                <div className={styles.cell}>
                    <button>שמירה</button>
                </div>
            </form>
        </div>
    );
};

export default EditRow;
