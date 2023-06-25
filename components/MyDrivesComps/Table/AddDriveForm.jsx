import React, { useEffect, useState } from "react";
import styles from "./adddriveform.module.scss";
import { v4 as uuidv4 } from "uuid";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import MapPopup from "./MapPopup";

const AddDriveForm = (props) => {
    const [startPoint, setStartPoint] = useState(
        props?.itemData?.startPoint ? props?.itemData?.startPoint : ""
    );
    const [endPoint, setEndPoint] = useState(
        props?.itemData?.endPoint ? props?.itemData?.endPoint : ""
    );
    const [kilometers, setKilometers] = useState(0);
    const [estDriveTime, setEstDriveTime] = useState("");
    const [mapVisible, setMapVisible] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [stops, setStops] = useState(
        props?.itemData?.stops ? [...props?.itemData?.stops] : []
    );
    const [stopLocations, setStopLocations] = useState(
        props?.itemData?.stops ? [...props?.itemData?.stops] : []
    );
    const [driveDate, setDriveDate] = useState();

    const [drive, setDrive] = useState(props?.itemData);

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
    };

    const handleEndPointChange = (e) => {
        const value = e.target.value;
        setEndPoint(value);
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
                            status === window.google.maps.DistanceMatrixStatus.OK &&
                            response?.rows[0]?.elements[0]?.distance &&
                            response?.rows[0]?.elements[0]?.duration
                        ) {
                            const distanceInMeters =
                                response.rows[0].elements[0].distance.value;
                            const distanceInKilometers = distanceInMeters / 1000;
                            setKilometers(distanceInKilometers);
                            const durationText = response.rows[0].elements[0].duration.text;
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
                                status === window.google.maps.DistanceMatrixStatus.OK &&
                                response?.rows[0]?.elements[0]?.distance &&
                                response?.rows[0]?.elements[0]?.duration
                            ) {
                                const distanceInMeters =
                                    response.rows[0].elements[0].distance.value;
                                const distanceInKilometers = distanceInMeters / 1000;
                                totalDistance += distanceInKilometers;

                                // Calculate the duration in minutes based on the 'value' field
                                const durationInMinutes =
                                    response.rows[0].elements[0].duration.value / 60;

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
                    calculateSegmentDistance(totalWaypoints[i], totalWaypoints[i + 1])
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const drive = {
            client: event.target.client.value,
            startTime: event.target.startTime.value,
            endTime: event.target.startTime.value,
            estimatedDrivingTime: event.target.estimatedDrivingTime.value,
            description: event.target.description.value,
            kilometers: kilometers,
            price: parseInt(event.target.price.value),
            date: event.target.date.value,
            fuelPrice: event.target.fuelPrice.value,
            startPoint: startPoint,
            stops: stopLocations,
            endPoint: endPoint,
            vehicleId: event.target.vehicleId.value,
            vehicleNickname: event.target.vehicleNickname.value,
            id: uuidv4(),
        };
        props.onAddDrive(drive);
    };

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
            if (startPoint && endPoint && stopLocations.length === stops.length) {
                const distance = await calculateDistance();
                setKilometers(distance);
            }
        };

        calculateDistanceAndSetValues();
    }, [startPoint, endPoint, stopLocations, stops]); // Include 'stops' in the dependency array

    const handleAddStop = (editStart, editStops, editEnd) => {
        if (editStart && editStops && editEnd) {
            console.log("editStart && editStops && editEnd");
            setStops([...stops, ""]); // Add an empty string to the stops state
            setStopLocations([...stopLocations, ""]); // Add an empty string to the stopLocations state

            // Calculate distance if both startPoint, endPoint, and stops are selected
            if (editStart && editEnd && stopLocations.length > 0) {
                calculateDistance().then((distance) => {
                    setKilometers(distance);
                });
            }
        } else {
            setStops([...stops, ""]); // Add an empty string to the stops state
            setStopLocations([...stopLocations, ""]); // Add an empty string to the stopLocations state

            // Calculate distance if both startPoint, endPoint, and stops are selected
            if (startPoint && endPoint && stopLocations.length > 0) {
                calculateDistance().then((distance) => {
                    setKilometers(distance);
                });
            }
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

    const handleSave = (e) => {
        e.preventDefault();
        console.log(e);
        const newDrive = {
            ...drive,
            kilometers: kilometers.toFixed(2),
            estimatedDrivingTime: estDriveTime,
        };
        props.handleEditSave(newDrive, e);
    };

    const handleCancelEdit = (e) => {
        e.preventDefault();
        props.setEditRowState();
    };

    const handleFields = (e, index) => {
        if (props?.itemData?.stops && e.target.name === "stops" && index) {
            const updatedStops = [...drive.stops];
            updatedStops[index] = e.target.value;
            setDrive((prevDrive) => ({
                ...prevDrive,
                stops: updatedStops,
            }));
        } else {
            setDrive((prevDrive) => ({
                ...prevDrive,
                [e.target.name]: e.target.value,
            }));
        }
    };

    return (
        <>
            <h3>
                {props?.editMode ? "עדכון נסיעה" : "הוספת נסיעה חדשה"}
                {props?.selectedVehicle && (
                    <span> עבור רכב מספר: {props.selectedVehicle}</span>
                )}
            </h3>
            <form
                className={styles.addDriveform}
                onSubmit={(e) => (props?.editMode ? handleSave(e) : handleSubmit(e))}
            >
                <label>
                    מספר רכב:
                    <input
                        type="number"
                        disabled={props?.itemData?.vehicleId ? true : false}
                        name="vehicleId"
                        id="vehicleId"
                        defaultValue={props?.itemData?.vehicleId}
                        onChange={(e) => {
                            handleDriveDate(e);
                            handleFields(e);
                        }}
                    />
                </label>
                <label>
                    כינוי רכב:
                    <input
                        type="text"
                        disabled={props?.itemData?.vehicleNickname ? true : false}
                        name="vehicleNickname"
                        id="vehicleNickname"
                        defaultValue={props?.itemData?.vehicleNickname}
                        onChange={(e) => {
                            handleDriveDate(e);
                            handleFields(e);
                        }}
                    />
                </label>
                <label>
                    תאריך נסיעה:
                    <input
                        type="date"
                        name="date"
                        required
                        defaultValue={
                            props?.itemData?.date ? props?.itemData?.date : driveDate
                        }
                        onChange={(e) => {
                            handleDriveDate(e);
                            handleFields(e);
                        }}
                    />
                </label>
                <label>
                    לקוח:
                    <input
                        type="text"
                        name="client"
                        required
                        placeholder="שם הלקוח"
                        defaultValue={props?.itemData?.client}
                        onChange={(e) => handleFields(e)}
                    />
                </label>
                <div className={styles.oneInRow}>
                    <label>
                        תיאור:
                        <textarea
                            name="description"
                            id="description"
                            rows="4"
                            defaultValue={props?.itemData?.description}
                            onChange={(e) => handleFields(e)}
                        ></textarea>
                    </label>
                </div>
                <label>
                    שעת התחלה:
                    <input
                        type="time"
                        name="startTime"
                        required
                        defaultValue={props?.itemData?.startTime}
                        onChange={(e) => handleFields(e)}
                    />
                </label>
                <label>
                    שעת סיום:
                    <input
                        type="time"
                        name="endTime"
                        required
                        defaultValue={props?.itemData?.endTime}
                        onChange={(e) => handleFields(e)}
                    />
                </label>
                <div className={styles.pointLabelsWrapper}>
                    <div className={styles.pointLabels}>
                        <label className={styles.mapLabel}>
                            נקודת איסוף:
                            <Autocomplete
                                onPlaceSelected={handleStartPointSelect}
                                onLoad={(autocomplete) =>
                                    autocomplete.setFields(["place_id", "formatted_address"])
                                }
                            >
                                <div className={styles.mapInputWrapper}>
                                    <input
                                        type="text"
                                        name="startPoint"
                                        onChange={(e) => {
                                            handleStartPointChange(e);
                                            handleFields(e);
                                        }}
                                        onBlur={(e) => {
                                            handleStartPointChange(e);
                                            handleFields(e);
                                        }}
                                        onFocus={() => {
                                            handleStartFocus();
                                        }}
                                        placeholder="הזנת נק' איסוף"
                                        defaultValue={startPoint}
                                    />
                                    <button
                                        className={styles.smallButton}
                                        onClick={(e) => {
                                            handleInputFocus(true, e), handleStartFocus();
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
                                    <div key={index} className={styles.stopInputWrapper}>
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
                                            <div className={styles.mapInputWrapper}>
                                                <input
                                                    type="text"
                                                    name="stops"
                                                    value={location}
                                                    onChange={(e) => {
                                                        handleStopChange(e, index);
                                                        handleFields(e, index);
                                                    }}
                                                    onBlur={(e) => {
                                                        handleStopChange(e, index);
                                                        handleFields(e, index);
                                                    }}
                                                    placeholder="הזנת נקודת עצירה"
                                                />
                                                <button
                                                    className={styles.smallButton}
                                                    onClick={() => handleRemoveStop(index)}
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
                            onClick={() =>
                                handleAddStop(
                                    props?.itemData?.startPoint,
                                    props?.itemData?.stops,
                                    props?.itemData?.endPoint
                                )
                            }
                        >
                            הוסף נקודת עצירה
                        </button>

                        <label className={styles.mapLabel}>
                            נקודת יעד:
                            <Autocomplete
                                onPlaceSelected={handleEndPointSelect}
                                onLoad={(autocomplete) =>
                                    autocomplete.setFields(["place_id", "formatted_address"])
                                }
                            >
                                <div className={styles.mapInputWrapper}>
                                    <input
                                        type="text"
                                        name="endPoint"
                                        onChange={(e) => {
                                            handleEndPointChange(e);
                                            handleFields(e);
                                        }}
                                        onBlur={(e) => {
                                            handleEndPointChange(e);
                                            handleFields(e);
                                        }}
                                        onFocus={() => {
                                            handleEndFocus();
                                        }}
                                        placeholder="הזנת נק' יעד"
                                        defaultValue={endPoint}
                                    />
                                    <button
                                        className={styles.smallButton}
                                        onClick={(e) => {
                                            handleInputFocus(true, e), handleEndFocus();
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
                        value={kilometers.toFixed(2)}
                        onChange={(e) => handleFields(e)}
                        readOnly
                    />
                </label>
                <label>
                    זמן נסיעה מוערך:
                    <input
                        type="text"
                        name="estimatedDrivingTime"
                        required
                        value={estDriveTime}
                        onChange={(e) => {
                            setEstDriveTime(e.target.value);
                            handleFields(e);
                        }}
                        readOnly
                    />
                </label>
                <label>
                    מחיר:
                    <input
                        type="number"
                        step={0.01}
                        name="price"
                        required
                        defaultValue={props?.itemData?.price}
                        onChange={(e) => handleFields(e)}
                    />
                </label>
                <label>
                    מחיר הדלק לליטר:
                    <input
                        type="number"
                        step={0.01}
                        name="fuelPrice"
                        required
                        defaultValue={
                            props?.itemData?.fuelPrice
                                ? props?.itemData?.fuelPrice
                                : props?.fuelPrice
                        }
                        onChange={(e) => {
                            props.handleFuelPrice(e.target.value);
                            handleFields(e);
                        }}
                    />
                </label>
                <div className={styles.buttonsWrapper}>
                    <button className={styles.saveButton} type="submit">
                        {props?.editMode ? "עדכון הנסיעה" : "הוספת נסיעה לטבלה"}
                    </button>
                    {props?.editMode && (
                        <button className={styles.cancelButton} onClick={handleCancelEdit}>
                            ביטול עריכת הנסיעה
                        </button>
                    )}
                </div>
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
