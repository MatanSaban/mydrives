import React, { useEffect, useState } from "react";
import styles from './adddriveform.module.scss';
import { v4 as uuidv4 } from "uuid";


const AddDriveForm = (props) => {

    const currentDate = (divided) => {
        const date = new Date();
        const day = date.getDate();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        if (divided) {
            return { day: day, month: parseInt(month), year: year };
        } else {
            return `${day}/${month}/${year}`
        }
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const drive = {
            client: formData.get("client"),
            startTime: formData.get("start_time"),
            endTime: formData.get("end_time"),
            description: formData.get("description"),
            kilometers: parseInt(formData.get("kilometers")),
            price: parseInt(formData.get("price")),
            date: formData.get("date"),
            fuelPrice: formData.get("fuelPrice"),
            id: uuidv4(),
        };
        props.onAddDrive(drive);
    };

    


    const [driveDate, setDriveDate] = useState();

    const handleDriveDate = (e) => {
        const val = e.target.value;
        console.log(val);
        console.log(e);
        e.target.value = val;
        e.target.defaultValue = val;
        setDriveDate(val);
    }

    useEffect(() => {
        const date = new Date();
        const day = date.getDate();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        console.log(`${year}-${month}-${day}`);
        setDriveDate(`${year}-${month}-${day}`);
    },[])


    return (
        <form className={styles.addDriveform} onSubmit={handleSubmit}>
            <label>
                תאריך נסיעה:
                <input
                    type="date"
                    name="date"
                    required
                    defaultValue={driveDate}
                    onChange={(e) => handleDriveDate(e)}
                />
            </label>
            <label>
                לקוח:
                <input type="text" name="client" required />
            </label>
            <label>
                תיאור:
                <input type="text" name="description" />
            </label>
            <label>
                שעת התחלה:
                <input type="time" name="start_time" required />
            </label>
            <label>
                שעת סיום:
                <input type="time" name="end_time" required />
            </label>
            <label>
                קילומטרים:
                <input type="number" name="kilometers" required />
            </label>
            <label>
                מחיר:
                <input type="number" name="price" required />
            </label>
            <label>
                מחיר הדלק לליטר:
                <input type="number" step={0.01} name="fuelPrice" required defaultValue={props?.fuelPrice} onChange={(e) => props.handleFuelPrice(e.target.value) } />
            </label>
            <button type="submit">הוספת נסיעה לטבלה</button>
        </form>
    );
};

export default AddDriveForm;
