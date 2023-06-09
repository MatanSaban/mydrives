import React, { useEffect, useState } from "react";
import Hero from "../../HeroComp/Hero";
import styles from "./myday.module.scss";
import Table from "../Table/Table";
import AddDriveForm from "../Table/AddDriveForm";
import axios from "axios";
import { LoadScript } from "@react-google-maps/api"; // import LoadScript here

const MyDay = (props) => {
    const [showAddDriveForm, setShowAddDriveForm] = useState(false);
    const [selectedRange, setSelectedRange] = useState("myDay");
    const [customDates, setCustomDates] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState("choose"
    );

    const applySelectedRangeFilter = (drives) => {
        if (!Array.isArray(drives)) {
            return [];
        }

        const today = new Date();
        const filteredDrives = drives?.filter((drive) => {
            const driveDate = new Date(drive.date);

            const isDriveInSelectedRange =
                selectedRange === "myDay"
                    ? driveDate.getDate() === today.getDate() &&
                    driveDate.getMonth() === today.getMonth() &&
                    driveDate.getFullYear() === today.getFullYear()
                    : selectedRange === "myWeek"
                        ? driveDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6) &&
                        driveDate <= today
                        : selectedRange === "myMonth"
                            ? driveDate.getMonth() === today.getMonth() &&
                            driveDate.getFullYear() === today.getFullYear()
                            : true;

            const isDriveMatchingVehicle =
                selectedVehicle === "choose" || drive.vehicleId === selectedVehicle;

            return isDriveInSelectedRange && isDriveMatchingVehicle;
        });

        return filteredDrives;
    };

    const [tableData, setTableData] = useState(() =>
        applySelectedRangeFilter(props?.userData?.drives)
    );

    useEffect(() => {
        setTableData(applySelectedRangeFilter(props?.userData?.drives));
    }, [selectedRange, selectedVehicle, props?.userData]);

    const addDrive = (driveData) => {
        if (isDriveWithinFilters(driveData)) {
            setTableData([...tableData, driveData]);

            axios
                .put(`/api/users/${props?.userData?.id}`, {
                    drives: [...props?.userData?.drives, driveData],
                })
                .then((res) => {
                    if (res.status === 200) {
                        props.handleUserData(res.data);
                    }
                });
            setShowAddDriveForm(false);
        } else {
            axios
                .put(`/api/users/${props?.userData?.id}`, {
                    drives: [...props?.userData?.drives, driveData],
                })
                .then((res) => {
                    if (res.status === 200) {
                        props.handleUserData(res.data);
                    }
                });
            setShowAddDriveForm(false);
        }
    };
    const isDriveWithinFilters = (driveData) => {
        const today = new Date();
        const driveDate = new Date(driveData.date);

        if (customDates) {
            const fromDateInput = document.getElementById("fromDate");
            const untilDateInput = document.getElementById("untilDate");
            const fromDate = fromDateInput.value ? new Date(fromDateInput.value) : null;
            const untilDate = untilDateInput.value ? new Date(untilDateInput.value) : null;

            return driveDate >= fromDate && driveDate <= untilDate;
        }

        const isDriveInSelectedRange =
            selectedRange === "myDay"
                ? driveDate.getDate() === today.getDate() &&
                driveDate.getMonth() === today.getMonth() &&
                driveDate.getFullYear() === today.getFullYear()
                : selectedRange === "myWeek"
                    ? driveDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6) &&
                    driveDate <= today
                    : selectedRange === "myMonth"
                        ? driveDate.getMonth() === today.getMonth() &&
                        driveDate.getFullYear() === today.getFullYear()
                        : true;

        const isDriveMatchingVehicle =
            selectedVehicle === "choose" || driveData.vehicleId === selectedVehicle;

        return isDriveInSelectedRange && isDriveMatchingVehicle;
    };


    const handleSelectChange = (event) => {
        if (event) {
            const selectedValue = event.target.value;
            setSelectedRange(selectedValue);

            switch (selectedValue) {
                case "myDay":
                case "myWeek":
                case "myMonth":
                case "myAllTimes":
                    setCustomDates(false);
                    break;
                case "myCustomDates":
                    setCustomDates(true);
                    break;
                default:
                    setCustomDates(false);
            }
        }
    };

    const filterTableByCustomDates = () => {
        const fromDateInput = document.getElementById("fromDate");
        const untilDateInput = document.getElementById("untilDate");
        const fromDate = fromDateInput.value ? new Date(fromDateInput.value) : null;
        const untilDate = untilDateInput.value ? new Date(untilDateInput.value) : null;

        if (fromDate && untilDate) {
            setTableData(
                props.userData.drives.filter((drive) => {
                    const driveDate = new Date(drive.date);
                    return driveDate >= fromDate && driveDate <= untilDate;
                })
            );
        } else {
            setTableData(props.userData.drives);
        }
    };

    return (
        <div className={styles.myDay}>
            <button
                className={styles.addDriveButton}
                onClick={() => setShowAddDriveForm(!showAddDriveForm)}
            >
                {showAddDriveForm ? "סגירת הוספת נסיעה" : "הוספת נסיעה"}
            </button>
            <button className={styles.selectButton}>
                <select
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    defaultValue={'choose'}
                    name="carChoose"
                    id="carChoose"
                >
                    <option value="choose">
                        בחר רכב
                    </option>
                    {props?.userData?.cars?.map((car) => {
                        return (
                            <option value={car.records[0].mispar_rechev} key={car.records[0]._id}>
                                {car.records[0].mispar_rechev}
                            </option>
                        );
                    })}
                </select>
            </button>
            <button className={styles.selectButton} id="selectButton">
                <select defaultValue={"myDay"} onChange={handleSelectChange}>
                    <option value="myDay">היום שלי</option>
                    <option value="myWeek">השבוע שלי</option>
                    <option value="myMonth">החודש שלי</option>
                    <option value="myAllTimes">כל הזמנים</option>
                    <option value="myCustomDates">לפי תאריכים</option>
                </select>
            </button>
            {customDates && (
                <div className={styles.betweenDates}>
                    <label htmlFor="fromDate"> מתאריך </label>
                    <input
                        type="date"
                        name="fromDate"
                        id="fromDate"
                        onChange={filterTableByCustomDates}
                    />
                    <label htmlFor="untilDate"> עד תאריך </label>
                    <input
                        type="date"
                        name="untilDate"
                        id="untilDate"
                        onChange={filterTableByCustomDates}
                    />
                </div>
            )}
            {showAddDriveForm && (
                <AddDriveForm
                    handleFuelPrice={props.handleFuelPrice}
                    fuelPrice={props?.fuelPrice}
                    when="today"
                    onAddDrive={addDrive}
                    handlePopup={props.handlePopup}
                    selectedVehicle={selectedVehicle}
                />
            )}
            <Table
                when="today"
                onAddDrive={addDrive}
                handleFuelPrice={props.handleFuelPrice}
                fuelPrice={props?.fuelPrice}
                userData={props?.userData}
                data={tableData}
                handlePopup={props.handlePopup}
                handleUserData={props.handleUserData}
            />
        </div>
    );
};

export default MyDay;
