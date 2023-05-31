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
    
    
    const applySelectedRangeFilter = (drives) => {
        if (!Array.isArray(drives)) {
            return [];
        }

        const today = new Date();
        const filteredDrives = drives?.filter((drive) => {
            const driveDate = new Date(drive.date);
            let fromDate, untilDate;

            switch (selectedRange) {
                case "myDay":
                    return (
                        driveDate.getDate() === today.getDate() &&
                        driveDate.getMonth() === today.getMonth() &&
                        driveDate.getFullYear() === today.getFullYear()
                    );
                case "myWeek":
                    fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() - 6);
                    untilDate = new Date();
                    return driveDate >= fromDate && driveDate <= untilDate;
                case "myMonth":
                    fromDate = new Date();
                    fromDate.setDate(1);
                    untilDate = new Date();
                    return driveDate >= fromDate && driveDate <= untilDate;
                case "myAllTimes":
                    return true;
                default:
                    return true;
            }
        });
        return filteredDrives;
    };

    const [tableData, setTableData] = useState(() =>
        applySelectedRangeFilter(props?.userData?.drives)
    );

    useEffect(() => {
        setTableData(applySelectedRangeFilter(props?.userData?.drives));
        console.log(
            "Filtered data: ",
            applySelectedRangeFilter(props?.userData?.drives)
        );
    }, [selectedRange, props?.userData]);

    const addDrive = (driveData) => {
        if (isDriveWithinFilters(driveData)) {
            setTableData([...tableData, driveData]);

            axios
                .put(`/api/users/${props?.userData?.id}`, {
                    drives: [...tableData, driveData],
                })
                .then((res) => {
                    if (res.status === 200) {
                        props.handleUserData(res.data);
                    }
                });
            setShowAddDriveForm(false);
        } else {
            // If the drive is not within the filters, update the user data on the server without adding the drive to the table.
            axios
                .put(`/api/users/${props?.userData?.id}`, {
                    drives: [...props.userData.drives, driveData],
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
        const driveDate = new Date(driveData.date);
        let fromDate, untilDate;

        if (customDates) {
            const fromDateInput = document.getElementById("fromDate");
            const untilDateInput = document.getElementById("untilDate");
            fromDate = fromDateInput.value
                ? new Date(fromDateInput.value)
                : null;
            untilDate = untilDateInput.value
                ? new Date(untilDateInput.value)
                : null;

            return driveDate >= fromDate && driveDate <= untilDate;
        }

        switch (selectedRange) {
            case "myDay":
                return (
                    driveDate.getDate() === new Date().getDate() &&
                    driveDate.getMonth() === new Date().getMonth() &&
                    driveDate.getFullYear() === new Date().getFullYear()
                );
            case "myWeek":
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 6);
                untilDate = new Date();
                return driveDate >= fromDate && driveDate <= untilDate;
            case "myMonth":
                fromDate = new Date();
                fromDate.setDate(1);
                untilDate = new Date();
                return driveDate >= fromDate && driveDate <= untilDate;
            case "myAllTimes":
                return true;
            default:
                return true;
        }
    };

    const handleSelectChange = (event) => {
        // Check if the event object is defined
        if (event) {
            const selectedValue = event.target.value;
            setSelectedRange(selectedValue);

            switch (selectedValue) {
                case "myDay":
                    setCustomDates(false);
                    break;
                case "myWeek":
                    setCustomDates(false);
                    break;
                case "myMonth":
                    setCustomDates(false);
                    break;
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

    useEffect(() => {
        console.log("use effect runs my day");
        setTableData(applySelectedRangeFilter(props?.userData?.drives));
    }, [props?.userData]);

    const filterTableByCustomDates = () => {
        const fromDateInput = document.getElementById("fromDate");
        const untilDateInput = document.getElementById("untilDate");
        const fromDate = fromDateInput.value
            ? new Date(fromDateInput.value)
            : null;
        const untilDate = untilDateInput.value
            ? new Date(untilDateInput.value)
            : null;

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
                <button
                    className={styles.selectButton}
                    id="selectButton" // added id attribute here
                >
                    <select
                        defaultValue={"myDay"}
                        onChange={handleSelectChange}
                    >
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
                    />
                )}
                {console.log(
                    "Filtered table data passed to Table component: ",
                    tableData
                )}
                <Table
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
