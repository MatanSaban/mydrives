import React, { useEffect, useState } from "react";
import styles from "./adddriveform.module.scss";
import { v4 as uuidv4 } from "uuid";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import MapPopup from "./MapPopup";

const AddDriveForm = (props) => {
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [kilometers, setKilometers] = useState(0);
    const [estDriveTime, setEstDriveTime] = useState("");
    const [mapVisible, setMapVisible] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [stops, setStops] = useState([]);
    const [stopLocations, setStopLocations] = useState([]);

    const handleStartFocus = () => {
        setFocusedInput("start");
    };

    const handleEndFocus = () => {
        setFocusedInput("end");
    };

    const handleMapSelect = (location) => {
        const address = `${location.name}`;

        if (focusedInput === "start") {
            setStartPoint(address);
        } else if (focusedInput === "end") {
            setEndPoint(address);
        }
    };

    const handleInputFocus = (bool, e) => {
        e.preventDefault();
        setMapVisible(bool);
    };

    const handleStartPointChange = (e) => {
        const value = e.target.value;
        setStartPoint(value);

        // Reset the stops and stopLocations when startPoint changes
        setStops([]);
        setStopLocations([]);
    };

    const handleEndPointChange = (e) => {
        const value = e.target.value;
        setEndPoint(value);

        // Reset the stops and stopLocations when endPoint changes
        setStops([]);
        setStopLocations([]);
    };

    const handleStartPointSelect = async (place) => {
        console.log("place");
        console.log(place);
        setStartPoint(place.formatted_address);

        // calculate distance if both startPoint and endPoint are selected
        if (endPoint && stops.length > 0) {
            const distance = await calculateDistance();
            setKilometers(distance);
        }
    };

    const handleEndPointSelect = async (place) => {
        console.log("place");
        console.log(place);
        setEndPoint(place.formatted_address);

        // calculate distance if both startPoint and endPoint are selected
        if (startPoint && stops.length > 0) {
            const distance = await calculateDistance();
            setKilometers(distance);
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
    const convertToHebrew = (value, unit) => {
        const unitsMap = {
            hours: "שעות",
            minutes: "דקות",
        };

        let hebrewValue = "";
        if (value > 0) {
            hebrewValue = `${value} ${unitsMap[unit]}`;
            if (unit === "minutes") {
                hebrewValue = `${hebrewValue}`;
            }
        }

        return hebrewValue;
    };

    const currentDate = (divided) => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
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
            stops: stopLocations,
            id: uuidv4(),
        };
        props.onAddDrive(drive);
    };

    const [driveDate, setDriveDate] = useState();

    const handleDriveDate = (e) => {
        console.log("handleDriveDate");
        console.log(e);
        const val = e.target.value;
        e.target.value = val;
        e.target.defaultValue = val;
        setDriveDate(val);
    };

    useEffect(() => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        setDriveDate(`${year}-${month}-${day}`);
    }, []);

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
    }, [startPoint, endPoint, stopLocations, stops]); // Include 'stops' in the dependency array

    const handleAddStop = () => {
        setStops([...stops, ""]); // Add an empty string to the stops state
        setStopLocations([...stopLocations, ""]); // Add an empty string to the stopLocations state

        // Calculate distance if both startPoint, endPoint, and stops are selected
        if (startPoint && endPoint && stopLocations.length > 0) {
            calculateDistance().then((distance) => {
                setKilometers(distance);
            });
        }
    };

    const handleRemoveStop = (index) => {
        const updatedStops = [...stops];
        updatedStops.splice(index, 1);

        const updatedStopLocations = [...stopLocations];
        updatedStopLocations.splice(index, 1);

        setStops(updatedStops);
        setStopLocations(updatedStopLocations);

        // Calculate distance if both startPoint, endPoint, and stops are selected
        if (startPoint && endPoint && updatedStopLocations.length > 0) {
            calculateDistance().then((distance) => {
                setKilometers(distance);
            });
        }
    };

    const handleStopChange = (e, index) => {
        const value = e.target.value;
        const updatedStopLocations = [...stopLocations];
        updatedStopLocations[index] = value;
        setStopLocations(updatedStopLocations);
    };

    const handleStopSelect = async (place, index) => {
        const address = place.formatted_address;
        const updatedStopLocations = [...stopLocations];
        updatedStopLocations[index] = address;
        setStopLocations(updatedStopLocations);

        // Calculate distance if both startPoint, endPoint, and stops are selected
        if (startPoint && endPoint && updatedStopLocations.length > 0) {
            const distance = await calculateDistance();
            setKilometers(distance);
        }
    };

    return (
        <>
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
                    <input type="text" name="client" required placeholder="שם הלקוח" />
                </label>
                <div className={styles.oneInRow}>
                    <label>
                        תיאור:
                        <textarea
                            name="description"ייר
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
                <div className={styles.pointLabelsWrapper}>
                    <div className={styles.pointLabels}>
                        <label className={styles.mapLabel}>
                            נקודת איסוף:
                            <Autocomplete
                                onPlaceSelected={handleStartPointSelect}
                                onLoad={(autocomplete) =>
                                    autocomplete.setFields([
                                        "place_id",
                                        "formatted_address",
                                    ])
                                }
                            >
                                <div className={styles.mapInputWrapper}>
                                    <input
                                        type="text"
                                        value={startPoint}
                                        onChange={handleStartPointChange}
                                        onBlur={handleStartPointChange}
                                        onFocus={() => {
                                            handleStartFocus();
                                        }}
                                        placeholder="הזנת נק' איסוף"
                                    />
                                    <button
                                        className={styles.smallButton}
                                        onClick={(e) => {
                                            handleInputFocus(true, e),
                                                handleStartFocus();
                                        }}
                                    >
                                        בחר במפה
                                    </button>
                                </div>
                            </Autocomplete>
                        </label>
                        {stopLocations.length > 0 && (
                            <label className={styles.mapLabel}>
                                נקודות עצירה:
                                {stopLocations.map((location, index) => (
                                    <div
                                        key={index}
                                        className={styles.stopInputWrapper}
                                    >
                                        <Autocomplete
                                            onPlaceSelected={(place) =>
                                                handleStopSelect(place, index)
                                            }
                                            onLoad={(autocomplete) =>
                                                autocomplete.setFields([
                                                    "place_id",
                                                    "formatted_address",
                                                ])
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.mapInputWrapper
                                                }
                                            >
                                                <input
                                                    type="text"
                                                    value={location}
                                                    onChange={(e) =>
                                                        handleStopChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    onBlur={(e) =>
                                                        handleStopChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    placeholder="הזנת נקודת עצירה"
                                                />
                                                <button
                                                    className={
                                                        styles.smallButton
                                                    }
                                                    onClick={() =>
                                                        handleRemoveStop(index)
                                                    }
                                                    type="button"
                                                >
                                                    הסר
                                                </button>
                                            </div>
                                        </Autocomplete>
                                    </div>
                                ))}
                            </label>
                        )}
                        <button
                            className={`${styles.smallButton} ${styles.centerButton}`}
                            type="button"
                            onClick={() => handleAddStop()}
                        >
                            הוסף נקודת עצירה
                        </button>

                        <label className={styles.mapLabel}>
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
                                <div className={styles.mapInputWrapper}>
                                    <input
                                        type="text"
                                        value={endPoint}
                                        onChange={handleEndPointChange}
                                        onBlur={handleEndPointChange}
                                        onFocus={() => {
                                            handleEndFocus();
                                        }}
                                        placeholder="הזנת נק' יעד"
                                    />
                                    <button
                                        className={styles.smallButton}
                                        onClick={(e) => {
                                            handleInputFocus(true, e),
                                                handleEndFocus();
                                        }}
                                    >
                                        בחר במפה
                                    </button>
                                </div>
                            </Autocomplete>
                        </label>
                    </div>
                </div>
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
                    זמן נסיעה מוערך:
                    <input
                        type="text"
                        name="estimatedDrivingTime"
                        required
                        defaultValue={estDriveTime}
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
            {mapVisible &&
                props.handlePopup(
                    true,
                    <MapPopup
                        handleInputFocus={handleInputFocus}
                        onSelect={handleMapSelect}
                        handlePopup={props.handlePopup}
                        handleStartPointSelect={handleStartPointSelect}
                        startPoint={startPoint}
                        handleStartPointChange={handleStartPointChange}
                        handleStartFocus={handleStartFocus}
                        locations={locations} // Add this line to pass the locations prop
                    />
                )}
        </>
    );
};
const locations = [
    // Location data...
];
export default AddDriveForm;
