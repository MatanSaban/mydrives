import React, { useEffect, useState, useRef, createRef } from "react";
import styles from "./table.module.scss";
import { Autocomplete } from "@react-google-maps/api";

const EditRow = (props) => {
    const [item, setItem] = useState(props.itemData);
    const [startPoint, setStartPoint] = useState(props.itemData.startPoint);
    const [endPoint, setEndPoint] = useState(props.itemData.endPoint);
    const [kilometers, setKilometers] = useState(props.itemData.kilometers);
    const [estDriveTime, setEstDriveTime] = useState(
        props.itemData.estimatedDrivingTime
    );
    const [stops, setStops] = useState(props.itemData.stops);
    const [stopLocations, setStopLocations] = useState([]);

    const startAutocompleteRef = useRef(null);
    const stopAutocompleteRefs = useRef([]);
    const endAutocompleteRef = useRef(null);


    useEffect(() => {
        stopAutocompleteRefs.current = Array(stops.length)
            .fill()
            .map((_, i) => stopAutocompleteRefs.current[i] || createRef());
    }, [stops.length]);

    const handleFields = (e) => {
        const { name, value } = e.target;
        setItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
        // Handle specific field changes
        if (name === "startPoint") {
            setStartPoint(value);
        } else if (name === "endPoint") {
            setEndPoint(value);
        } else if (name.startsWith("stop_")) {
            const index = parseInt(name.split("_")[1]) - 1;
            const updatedStops = [...stops];
            updatedStops[index] = value;
            setStops(updatedStops);
        }
    };

    const calculateDistance = async () => {
        if (!startPoint || !endPoint) {
            setKilometers(0);
            setEstDriveTime(0);
            return 0;
        }

        const waypoints = [...stopLocations];
        const numWaypoints = waypoints.length;

        if (numWaypoints === 0) {
            // No stops added, calculate distance between start point and end point only
            const service = new window.google.maps.DistanceMatrixService();
            return new Promise((resolve, reject) => {
                service.getDistanceMatrix(
                    {
                        origins: [startPoint],
                        destinations: [endPoint],
                        travelMode: window.google.maps.TravelMode.DRIVING,
                        language: "he",
                    },
                    (response, status) => {
                        if (
                            status ===
                                window.google.maps.DistanceMatrixStatus.OK &&
                            response?.rows[0]?.elements[0]?.distance &&
                            response?.rows[0]?.elements[0]?.duration
                        ) {
                            const distanceInMeters =
                                response.rows[0].elements[0].distance.value;
                            const distanceInKilometers =
                                distanceInMeters / 1000;
                            setKilometers(distanceInKilometers);
                            const durationText =
                                response.rows[0].elements[0].duration.text;
                            setEstDriveTime(durationText);
                            resolve(distanceInKilometers);
                        } else {
                            console.error(`Error was: ${status}`);
                            setKilometers(0);
                            setEstDriveTime(0);
                            reject(0);
                        }
                    }
                );
            });
        } else {
            // Calculate distance with stops included
            const service = new window.google.maps.DistanceMatrixService();
            const totalWaypoints = [startPoint, ...waypoints, endPoint];
            let totalDistance = 0;
            let totalDuration = 0;

            const calculateSegmentDistance = (origin, destination) => {
                return new Promise((resolve, reject) => {
                    service.getDistanceMatrix(
                        {
                            origins: [origin],
                            destinations: [destination],
                            travelMode: window.google.maps.TravelMode.DRIVING,
                            language: "he",
                        },
                        (response, status) => {
                            if (
                                status ===
                                    window.google.maps.DistanceMatrixStatus
                                        .OK &&
                                response?.rows[0]?.elements[0]?.distance &&
                                response?.rows[0]?.elements[0]?.duration
                            ) {
                                const distanceInMeters =
                                    response.rows[0].elements[0].distance.value;
                                const distanceInKilometers =
                                    distanceInMeters / 1000;
                                totalDistance += distanceInKilometers;

                                // Calculate the duration in minutes based on the 'value' field
                                const durationInMinutes =
                                    response.rows[0].elements[0].duration
                                        .value / 60;

                                // Add the duration in minutes to the total duration
                                totalDuration += durationInMinutes;

                                resolve();
                            } else {
                                console.error(`Error was: ${status}`);
                                reject();
                            }
                        }
                    );
                });
            };

            const promises = [];
            for (let i = 0; i < totalWaypoints.length - 1; i++) {
                promises.push(
                    calculateSegmentDistance(
                        totalWaypoints[i],
                        totalWaypoints[i + 1]
                    )
                );
            }

            try {
                await Promise.all(promises);
                setKilometers(totalDistance);
                const hours = Math.floor(totalDuration / 60);
                const minutes = Math.round(totalDuration % 60);
                setEstDriveTime(
                    `${convertToHebrew(hours, "hours")} ${convertToHebrew(
                        minutes,
                        "minutes"
                    )}`
                );

                return totalDistance;
            } catch (error) {
                console.error(error);
                setKilometers(0);
                setEstDriveTime(0);
                return 0;
            }
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const drive = {
            ...item,
            kilometers: kilometers.toFixed(2),
            estimatedDrivingTime: estDriveTime,
        };
        props.handleEditSave(drive, e);
    };

    const handlePlaceChanged = (fieldName) => {
        const autocomplete =
            fieldName === "startPoint"
                ? startAutocompleteRef.current
                : endAutocompleteRef.current;
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place) {
                const address = place.formatted_address;
                if (fieldName === "startPoint") {
                    setStartPoint(address);
                } else if (fieldName === "endPoint") {
                    setEndPoint(address);
                }
            }
        }
    };

    useEffect(() => {
        const calculateDistanceAndSetValues = async () => {
            if (
                startPoint &&
                endPoint &&
                stopLocations.length === stops.length
            ) {
                const distance = await calculateDistance();
                setKilometers(distance);
            }
        };

        calculateDistanceAndSetValues();
    }, [startPoint, endPoint, stopLocations, stops]);

    useEffect(() => {
        setStartPoint(props.itemData.startPoint);
        setEndPoint(props.itemData.endPoint);
        setKilometers(props.itemData.kilometers);
        setEstDriveTime(props.itemData.estimatedDrivingTime);
        setStops(props.itemData.stops);
    }, [props.itemData]);

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
                    <label htmlFor="client">לקוח</label>
                    <input
                        type="text"
                        name="client"
                        id="client"
                        required
                        defaultValue={props.itemData.client}
                        onChange={(e) => handleFields(e)}
                    />
                    <label htmlFor="startTime">שעת התחלה</label>
                    <input
                        type="time"
                        name="startTime"
                        id="startTime"
                        required
                        defaultValue={props.itemData.startTime}
                        onChange={(e) => handleFields(e)}
                    />
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
                <div className={`${styles.cell} ${styles.column}`}>
                    <label htmlFor="startPoint">נקודת התחלה</label>
                    <Autocomplete
                        onLoad={(autocomplete) =>
                            (startAutocompleteRef.current = autocomplete)
                        }
                        onPlaceChanged={() => handlePlaceChanged("startPoint")}
                    >
                        <input
                            type="text"
                            name="startPoint"
                            id="startPoint"
                            required
                            value={startPoint}
                            onChange={handleFields}
                        />
                    </Autocomplete>
                    {stops?.map((stop, index) => {
                        return (
                            <div key={index}>
                                <label htmlFor={`stop_${index + 1}`}>
                                    עצירה {index + 1}
                                </label>
                                <Autocomplete
                                    onLoad={(autocomplete) =>
                                        (stopAutocompleteRefs.current[index] =
                                            autocomplete)
                                    }
                                    onPlaceChanged={() =>
                                        handlePlaceChanged(`stop_${index + 1}`)
                                    }
                                >
                                    <input
                                        type="text"
                                        name={`stop_${index + 1}`}
                                        id={`stop_${index + 1}`}
                                        index={index}
                                        required
                                        value={stop}
                                        onChange={handleFields}
                                    />
                                </Autocomplete>
                            </div>
                        );
                    })}
                    <label htmlFor="endPoint">נקודת סיום</label>
                    <Autocomplete
                        onLoad={(autocomplete) =>
                            (endAutocompleteRef.current = autocomplete)
                        }
                        onPlaceChanged={() => handlePlaceChanged("endPoint")}
                    >
                        <input
                            type="text"
                            name="endPoint"
                            id="endPoint"
                            required
                            value={endPoint}
                            onChange={handleFields}
                        />
                    </Autocomplete>
                </div>
                <div
                    className={`${styles.cell} ${styles.column}`}
                    style={{ width: "100%" }}
                >
                    <label htmlFor="fuelPrice">מחיר ליטר</label>
                    <input
                        type="number"
                        name="fuelPrice"
                        id="fuelPrice"
                        required
                        defaultValue={props.itemData.fuelPrice}
                        onChange={(e) => handleFields(e)}
                    />
                    <label htmlFor="kilometers">קילומטרים</label>
                    <input
                        type="number"
                        name="kilometers"
                        id="kilometers"
                        required
                        value={kilometers}
                        onChange={handleFields}
                    />
                    <label htmlFor="estimatedDrivingTime">
                        זמן נסיעה מוערך
                    </label>
                    <input
                        type="text"
                        name="estimatedDrivingTime"
                        id="estimatedDrivingTime"
                        required
                        value={estDriveTime}
                        onChange={handleFields}
                    />

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
