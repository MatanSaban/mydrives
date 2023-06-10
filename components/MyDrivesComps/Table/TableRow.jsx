import React from 'react'
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import styles from "./table.module.scss";

const TableRow = (props) => {
  return (
      <div id={props.item.id} className={`${styles.row} row`}>
          <div data={"date"} className={styles.cell}>
              {props.dateFormatter(props.item.date)}
          </div>
          <div data={"client"} className={styles.cell}>
              {props.item.client}
          </div>
          <div className={`${styles.cell} ${styles.column}`}>
              <div data={"startTime"}>{props.item.startTime}</div>
              <hr />
              <div data={"endTime"}>{props.item.endTime}</div>
          </div>
          <div data={"description"} className={styles.cell}>
              <button
                  onClick={() =>
                      props.handleDescription(
                          props.item.client,
                          props.item.description,
                          props.item.startPoint,
                          props.item.stops,
                          props.item.endPoint
                      )
                  }
              >
                  הצגת תיאור
              </button>
          </div>
          <div className={`${styles.cell} ${styles.column}`}>
              <div data={"fuelPrice"}>
                  {parseFloat(props.item.fuelPrice).toFixed(2)} ₪
              </div>
              <hr />
              <div data={"kilometers"}>
                  {props.item.kilometers.toFixed(2)} ק&quot;מ
              </div>
              <hr />
              <div data={"fuelConsumption"}>
                  {(
                      (props.item.kilometers / 17.6) *
                      props.item.fuelPrice
                  ).toFixed(2)}{" "}
                  ₪
              </div>
          </div>
          <div className={`${styles.cell} ${styles.column}`}>
              <div data={"price"}>₪{props.item.price}</div>
              <hr />
              <div data={"profit"} style={{ direction: "ltr" }}>
                  ₪
                  {(
                      props.item.price -
                      (props.item.kilometers / 17.6) * props.item.fuelPrice
                  ).toFixed(2)}
              </div>
          </div>
          <div data={"action"} className={`${styles.cell} ${styles.column}`}>
              <span
                  action="edit"
                  onClick={(e) => props.handleClick(e, props.item)}
              >
                  <AiOutlineEdit />
              </span>
              <span action="delete" onClick={(e) => props.handleClick(e)}>
                  <BsTrash />
              </span>
          </div>
      </div>
  );
}

export default TableRow
