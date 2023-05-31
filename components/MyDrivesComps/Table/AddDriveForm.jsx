import React, { useEffect, useState } from "react";
import styles from "./adddriveform.module.scss";
import { v4 as uuidv4 } from "uuid";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const AddDriveForm = (props) => {
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [kilometers, setKilometers] = useState(0);

    const handleStartPointChange = (e) => {
        setStartPoint(e.target.value);
    };

    const handleEndPointChange = (e) => {
        setEndPoint(e.target.value);
    };

    const handleStartPointSelect = async (place) => {
        console.log('place');
        console.log(place);
        setStartPoint(place.formatted_address);

        // calculate distance if both startPoint and endPoint are selected
        if (endPoint) {
            const distance = await calculateDistance(startPoint, endPoint);
            setKilometers(distance);
        }
    };

    const handleEndPointSelect = async (place) => {
        setEndPoint(place.formatted_address);

        // calculate distance if both startPoint and endPoint are selected
        if (startPoint) {
            const distance = await calculateDistance(startPoint, endPoint);
            setKilometers(distance);
        }
    };


    // And update the calculateDistance function like this:
    const calculateDistance = async () => {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [startPoint],
                destinations: [endPoint],
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                console.log(response); // Add this line to log the entire response object
                if (
                    status === google.maps.DistanceMatrixStatus.OK &&
                    response.rows[0] &&
                    response.rows[0].elements[0] &&
                    response.rows[0].elements[0].distance
                ) {
                    const distanceInMeters =
                        response.rows[0].elements[0].distance.value;
                    const distanceInKilometers = distanceInMeters / 1000;
                    setKilometers(distanceInKilometers);
                } else {
                    console.error(`Error was: ${status}`);
                    setKilometers(0);
                }

            }
        );
    };


    const currentDate = (divided) => {
        const date = new Date();
        const day = date.getDate();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        if (divided) {
            return { day: day, month: parseInt(month), year: year };
        } else {
            return `${day}/${month}/${year}`;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const drive = {
            client: event.target.client.value,
            startTime: event.target.start_time.value,
            endTime: event.target.end_time.value,
            description: event.target.description.value,
            kilometers: kilometers,
            price: parseInt(event.target.price.value),
            date: event.target.date.value,
            fuelPrice: event.target.fuelPrice.value,
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
    };

    useEffect(() => {
        const date = new Date();
        const day = date.getDate();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        console.log(`${year}-${month}-${day}`);
        setDriveDate(`${year}-${month}-${day}`);
    }, []);

    useEffect(() => {
        if (startPoint && endPoint) {
            calculateDistance();
        }
    }, [startPoint, endPoint]);


    useEffect(() => {
        if (startPoint && endPoint) {
            calculateDistance();
        }
    }, [startPoint, endPoint]);


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
                <div className={styles.oneInRow}>
                    <label>
                        תיאור:
                        <textarea
                            name="description"
                            id="description"
                            rows="4"
                        ></textarea>
                    </label>
                </div>
                <label>
                    שעת התחלה:
                    <input type="time" name="start_time" required />
                </label>
                <label>
                    שעת סיום:
                    <input type="time" name="end_time" required />
                </label>
                <label>
                    נקודת יציאה:
                    <Autocomplete
                        onPlaceSelected={handleStartPointSelect}
                        onLoad={(autocomplete) =>
                            autocomplete.setFields([
                                "place_id",
                                "formatted_address",
                            ])
                        }
                    >
                        <input
                            type="text"
                            value={startPoint}
                            onChange={handleStartPointChange}
                            onBlur={handleStartPointChange}
                        />
                    </Autocomplete>
                </label>
                <label>
                    נקודת יעד:
                    <Autocomplete
                        onPlaceSelected={handleEndPointSelect}
                        onLoad={(autocomplete) =>
                            autocomplete.setFields([
                                "place_id",
                                "formatted_address",
                            ])
                        }
                    >
                        <input
                            type="text"
                            value={endPoint}
                            onChange={handleEndPointChange}
                            onBlur={handleEndPointChange}
                        />
                    </Autocomplete>
                </label>
                <label>
                    קילומטרים:
                    <input
                        type="number"
                        name="kilometers"
                        required
                        value={kilometers}
                        readOnly
                    />
                </label>
                <label>
                    מחיר:
                    <input type="number" name="price" required />
                </label>
                <label>
                    מחיר הדלק לליטר:
                    <input
                        type="number"
                        step={0.01}
                        name="fuelPrice"
                        required
                        defaultValue={props?.fuelPrice}
                        onChange={(e) => props.handleFuelPrice(e.target.value)}
                    />
                </label>
                <button type="submit">הוספת נסיעה לטבלה</button>
            </form>
    );
};

export default AddDriveForm;


