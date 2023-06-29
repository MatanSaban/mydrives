import React, { useEffect, useState } from "react";
import styles from "./addemployee.module.scss";
import GeneralForm from "../FormBuilder/GeneralForm";
import axios from "axios";

const AddEmployeeForm = (props) => {
  const [employee, setEmployee] = useState({});
  const [formJson, setFormJson] = useState({
    fields: [
      {
        label: "שם פרטי",
        name: "firstname",
        type: "text",
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "שם משפחה",
        name: "lastname",
        type: "text",
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "תעודת זהות",
        name: "idNumber",
        type: "number",
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "טלפון",
        name: "phoneNumber",
        type: "number",
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "אימייל",
        name: "email",
        type: "email",
        autocomplete: "new-email",
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "סיסמא",
        name: "password",
        type: "password",
        autocomplete: "new-password",
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "תפקיד",
        name: "role",
        type: "select",
        options: [
          { label: "", value: "choose" },
          { label: "בעלים", value: "owner" },
          { label: "מנהל עבודה", value: "manager" },
          { label: "מרכזן", value: "controller" },
          { label: "נהג", value: "driver" },
        ],
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "דרגת רישיון",
        name: "licenseLevel",
        type: "select",
        options: [
          { label: "", value: "choose" },
          { label: "B", value: "B" },
          { label: "C", value: "C" },
          { label: "C1", value: "C1" },
          { label: "D", value: "D" },
          { label: "D1", value: "D1" },
          { label: "D2", value: "D2" },
          { label: "D3", value: "D3" },
        ],
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "תוקף רישיון נהיגה",
        name: "licenseExpiration",
        type: "text",
        attributes: {
          dateandtext: "true",
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "תאריך לידה",
        name: "birthDate",
        type: "text",
        attributes: {
          dateandtext: "true",
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "הצמדת רכב",
        name: "carAttach",
        type: "select",
        options: [{ label: "", value: "choose" }],
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
      {
        label: "הצמדת מסלול קבוע",
        name: "course",
        type: "select",
        options: [
          { label: "", value: "choose" },
          { label: "car1", value: "car1" },
          { label: "car2", value: "car2" },
          { label: "car3", value: "car3" },
        ],
        attributes: {
          onChange: "handleFields",
          onBlur: "handleInputBlur",
          onFocus: "handleInputFocus",
        },
      },
    ],
  });

  const handleFields = (e) => {
    const target = e.target;
    setEmployee({ ...employee, [target.name]: target.value });
  };

  const handleSubmit = (e) => {
    const oldEployees = props?.userData?.employees;
    oldEployees.push(employee);
    let employees = oldEployees;
    const data = props?.userData;
    data.employees = employees;

    console.log("newUserData");
    console.log(data);
    axios
      .put(`/api/users/${props?.userData?._id}`, {
        employees: oldEployees,
      })
      .then((res) => {
        if (res.status === 200) {
          props?.handleUserData(res.data);
          e.target.reset();
          const fieldsArr = Array.from(
            e.target.querySelectorAll(`.labelWrapper`)
          );
          fieldsArr.forEach((labelWrapper) => {
            Array.from(labelWrapper.classList).forEach((className) => {
              if (!className.includes("labelWrapper")) {
                labelWrapper.classList.remove(className);
              }
            });
          });
        }
      });
  };

  const getUserCars = () => {
    let cars = [];
    if (!props?.userData?.cars) {
      return cars;
    }
    if (props?.userData?.cars) {
      cars = props.userData.cars;
      console.log("cars");
      console.log(cars);
      return cars;
    }
  };

  const userCars = getUserCars();
  const carAttachOptions = [
    { label: "", value: "choose" },
    ...userCars.map((car) => {
      return {
        label: car.records[0].mispar_rechev,
        value: car.records[0].mispar_rechev,
      };
    }),
  ];

  useEffect(() => {
    setFormJson((prevJson) => {
      return {
        ...prevJson,
        fields: prevJson.fields.map((field) => {
          if (field.name === "carAttach") {
            return {
              ...field,
              options: carAttachOptions,
            };
          }
          return field;
        }),
      };
    });
  }, [props]);

  return (
    <div className={styles.wrapper}>
      <GeneralForm
        buttonText={"הוספת עובד"}
        json={formJson}
        onChangeFunc={handleFields}
        onSubmitFunc={handleSubmit}
      />
    </div>
  );
};

export default AddEmployeeForm;

// getUserCars().map((car) => {
//     return {
//       label: car.records[0].mispar_rechev,
//       value: car.records[0].mispar_rechev,
//     };
//   }),
