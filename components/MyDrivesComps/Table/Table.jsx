import React, { useEffect, useState } from "react";
import styles from "./table.module.scss";
import TableFooter from "./TableFooter";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import axios from "axios";
import EditRow from "./editRow";
import ReactDOM from "react-dom";
import TableRow from "./TableRow";


const Table = (props) => {
    console.log("Table data received: ", props.data);


const [editRowState, setEditRowState] = useState();

    const handleEditSave = (item, e) => {
        // console.log(e);
        let popupContent = 
        <>
            <h3>מעדכן את הנסיעה</h3>
        </>;
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
            axios.put(`/api/users/${props.userData._id}`, {
                drives: newData
            }).then((res) => {
                // console.log(res)
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
            })
        } catch (error) {
            // console.log(error)
        }
    };

    

    const handleEdit = (itemData, row) => {
        const EditRowComp = (
            <EditRow
                handleEditSave={handleEditSave}
                oldRow={row}
                itemData={itemData}
            />
        );
        // ReactDOM.render(EditRowComp, row);
        setEditRowState(row.id);
    };


    const handleDelete = (row, clientName) => {
        // console.log("handleDelete");
        const oldData = props?.userData?.drives;
        const rowId = row.id;
        // Remove the item with the specified ID
        const newData = oldData.filter((item) => item.id !== rowId);
        axios.put(`/api/users/${props.userData._id}`, {
            drives: newData
        }).then((res) => {
            // console.log(res);
            if (res.status == 200) {
                const currentBgColor = row.style.backgroundColor;
                props.handlePopup(false,"")
                setTimeout(() => {
                    props.handlePopup(true,<><h3>הנסיעה של {clientName} נמחקה בהצלחה</h3></>)
                }, 1000);
                setTimeout(() => {
                    props.handlePopup(false,<><h3>הנסיעה של {clientName} נמחקה בהצלחה</h3></>)
                }, 2000);
                setTimeout(() => {
                    row.style.backgroundColor = "#ff4d4d85";
                    setTimeout(() => {
                        row.style.backgroundColor = currentBgColor;
                        props.handleUserData(res.data);
                    }, 1000);
                }, 3000);
            }
        })
    };

    


    const handleClick = (e, item) => {
        const span = e.target.closest("span");
        const row = span.closest(".row");
        const rowId = row.getAttribute("id");
        if (span) {
            const action = span.getAttribute("action");
            switch (action) {
                case "delete":
                    // console.log("do delete stuff");
                    const popupContent = (row) => {
                        const client = row.querySelector('div[data="client"]');
                        return (
                            <div>
                                <h3> האם ברצונך למחוק את {client.innerText} ?</h3>
                                <div style={{ display: "flex", justifyContent: "space-between",}}>
                                    <button onClick={() => handleDelete(row, client.innerText)}> כן</button>
                                    <button onClick={() => props.handlePopup(false, null)}> לא </button>
                                </div>
                            </div>
                        );
                    };
                    props.handlePopup(true, popupContent(row));
                    break;
                case "edit":
                    // console.log("do edit stuff");
                    handleEdit(item, row);
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


const handleDescription = (client, description) => {
    props.handlePopup(
        true,
        <>
            <h3>לקוח: {client}, תיאור הנסיעה</h3>
            <p>{description}</p>
        </>
    );
}



    return (
        <div className={styles.table}>
            <div className={`${styles.row} ${styles.header}`}>
                <div className={styles.cell}>תאריך</div>
                <div className={styles.cell}>לקוח</div>
                <div className={`${styles.cell} ${styles.column}`}>
                    <span>התחלה</span>
                    <hr />
                    <span>סיום</span>
                </div>
                <div className={styles.cell}>תיאור הנסיעה</div>
                <div className={`${styles.cell} ${styles.column}`}>
                    <span>מחיר ליטר</span>
                    <hr />
                    <span>ק&quot;מ</span>
                    <hr />
                    <span>צריכת דלק</span>
                </div>
                <div className={`${styles.cell} ${styles.column}`}>
                    <span>מחיר נסיעה</span>
                    <hr />
                    <span>רווח</span>
                </div>
                <div className={styles.cell}>עריכה / מחיקה</div>
            </div>

            {sortedData?.map((item, index) =>
                editRowState && editRowState == item.id ? (
                    <EditRow
                        handleEditSave={handleEditSave}
                        // oldRow={row}
                        key={index}
                        itemData={item}
                    />
                ) : (
                    <TableRow
                        item={item}
                        key={index}
                        dateFormatter={dateFormatter}
                        handleDescription={handleDescription}
                        handleClick={handleClick}
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
