import React, { useState } from "react";
import styles from "./table.module.scss";
import TableFooter from "./TableFooter";
import axios from "axios";
import EditRow from "./EditRow";
import TableRow from "./TableRow";
import { AiFillHtml5 } from "react-icons/ai";
import AddDriveForm from "./AddDriveForm";
import { v4 as uuidv4 } from "uuid";


const Table = (props) => {
    const [editRowState, setEditRowState] = useState();

    const handleEditSave = (item, e) => {
        let popupContent = (
            <>
                <h3>מעדכן את הנסיעה</h3>
            </>
        );
        props.handlePopup(true, popupContent);
        const oldData = props?.userData?.drives;
        const newData = oldData.map((oldItem) => {
            if (oldItem.id === item.id) {
                return item;
            } else {
                return oldItem;
            }
        });
        try {
            axios
                .put(`/api/users/${props.userData._id}`, {
                    drives: newData,
                })
                .then((res) => {
                    if (res.status === 200) {
                        let popupContent = (
                            <>
                                <h3>שומר את הנסיעה</h3>
                            </>
                        );
                        props.handlePopup(true, popupContent);
                        props.handleUserData(res.data);
                        setTimeout(() => {
                            props.handlePopup(false, popupContent);
                            popupContent = (
                                <>
                                    <h3>שומר את הנסיעה</h3>
                                </>
                            );
                            props.handlePopup(true, popupContent);
                            setEditRowState();
                        }, 1000);
                        setTimeout(() => {
                            props.handlePopup(false, popupContent);
                        }, 2000);
                    }
                });
        } catch (error) { }
    };

    const handleEdit = (itemData, driveItem) => {
        const row = driveItem.querySelector(".row");
        const EditRowComp = (
            <AddDriveForm
                handleEditSave={handleEditSave}
                oldRow={row}
                itemData={itemData}
                handleFuelPrice={props.handleFuelPrice}
                fuelPrice={props?.fuelPrice}
                onAddDrive={props.addDrive}
                handlePopup={props.handlePopup}
            />
        );
        // ReactDOM.render(EditRowComp, row);
        setEditRowState(row.id);
    };

    const handleDelete = (driveItem, clientName) => {
        const oldData = props?.userData?.drives;
        const driveId = driveItem.id;
        // Remove the item with the specified ID
        const newData = oldData.filter((item) => item.id !== driveId);
        axios
            .put(`/api/users/${props.userData._id}`, {
                drives: newData,
            })
            .then((res) => {
                if (res.status == 200) {
                    const currentBgColor =
                        driveItem.querySelector(".row").style.backgroundColor;
                    props.handlePopup(false, "");
                    setTimeout(() => {
                        props.handlePopup(
                            true,
                            <>
                                <h3>הנסיעה של {clientName} נמחקה בהצלחה</h3>
                            </>
                        );
                    }, 500);
                    setTimeout(() => {
                        props.handlePopup(
                            false,
                            <>
                                <h3>הנסיעה של {clientName} נמחקה בהצלחה</h3>
                            </>
                        );
                    }, 1500);
                    setTimeout(() => {
                        driveItem.querySelector('.row').style.backgroundColor = "#ff4d4d85";
                        setTimeout(() => {
                            driveItem.querySelector(
                                ".row"
                            ).style.backgroundColor = currentBgColor;
                            props.handleUserData(res.data);
                        }, 1000);
                    }, 1000);
                }
            });
    };

    const handleDuplicate = (itemData) => {
        props.handlePopup(true, <h3>משכפל נסיעה</h3>);
        const duplicatedItem = { ...itemData, id: uuidv4() };
        let newDrives = [...props?.userData?.drives, duplicatedItem];
        let newUserData = { ...props?.userData, drives: newDrives };
        axios
            .put(`/api/users/${props?.userData?._id}`, newUserData)
            .then((res) => {
                if (res.status === 200) {
                    props.handlePopup(true, <h3>הנסיעה שוכפלה בהצלחה</h3>);
                    props.handleUserData(res.data);
                    setTimeout(() => {
                        props.handlePopup(false, <h3>הנסיעה שוכפלה בהצלחה</h3>);
                    }, 1000);
                } else {
                    props.handlePopup(false);
                }
            });
    };


    const handleClick = (e, item) => {
        const span = e.target
        const row = span.closest("div.driveItem");
        const rowId = row.getAttribute("id");
        if (span) {
            const action = span.getAttribute("action");
            switch (action) {
                case "delete":
                    const popupContent = (row) => {
                        const client = row.querySelector('div[data="client"]');
                        return (
                            <div>
                                <h3>
                                    {" "}
                                    האם ברצונך למחוק את {client.innerText} ?
                                </h3>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            handleDelete(row, client.innerText)
                                        }
                                    >
                                        {" "}
                                        כן
                                    </button>
                                    <button
                                        onClick={() =>
                                            props.handlePopup(false, null)
                                        }
                                    >
                                        {" "}
                                        לא{" "}
                                    </button>
                                </div>
                            </div>
                        );
                    };
                    props.handlePopup(true, popupContent(row));
                    break;
                case "edit":
                    handleEdit(item, row);
                    break;
                case "duplicate":
                    handleDuplicate(item);
                    break;
                default:
                    break;
            }
        }
    };

    const sortedData = props?.data?.sort((a, b) => {
        if (a.date < b.date) {
            return -1;
        } else if (a.date > b.date) {
            return 1;
        } else {
            if (a.startTime < b.startTime) {
                return -1;
            } else if (a.startTime > b.startTime) {
                return 1;
            } else {
                return 0;
            }
        }
    });

    const dateFormatter = (oldDateFormat) => {
        const date = new Date(oldDateFormat);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString().substr(-2);
        const newDateFormat = `${day}/${month}/${year}`;
        return newDateFormat;
    };

    const handleDescription = (
        client,
        description,
        startPoint,
        stops,
        endPoint
    ) => {
        props.handlePopup(
            true,
            <div className={styles.descriptionPopupContent}>
                <h3>לקוח: {client}, תיאור הנסיעה : </h3>
                <p>{description}</p>
                <h4>פירוט הנסיעה: </h4>
                <p>
                    <h5>נקודת התחלה : {startPoint}</h5>

                    {stops.length > 0 && <h5>נקודות עצירה : </h5>}
                    {stops.length > 0 && (
                        <ol>
                            {stops.map((stop) => {
                                return (
                                    <>
                                        <li>{stop}</li>
                                    </>
                                );
                            })}
                        </ol>
                    )}

                    <h5>נקודת סיום : {endPoint}</h5>
                </p>
            </div>
        );
    };

    return (
        <div className={styles.table}>
            {sortedData?.map((item, index) =>
                editRowState && editRowState == item.id ? (
                    <AddDriveForm
                        handleEditSave={handleEditSave}
                        editMode={true}
                        key={index}
                        itemData={item}
                        setEditRowState={setEditRowState}
                    />
                ) : (
                    <TableRow
                        item={item}
                        key={index}
                        index={index + 1}
                        dateFormatter={dateFormatter}
                        handleDescription={handleDescription}
                        handleClick={handleClick}
                        handlePopup={props.handlePopup}
                    />
                )
            )}
            <TableFooter
                data={props.data}
                handleFuelPrice={props.handleFuelPrice}
                fuelPrice={props?.fuelPrice}
            />
        </div>
    );
};

export default Table;
