import React, { useState } from 'react';
import styles from './addemployee.module.scss';
import GeneralForm from '../FormBuilder/GeneralForm';
import axios from 'axios';

const AddEmployeeForm = (props) => {

    const [employee, setEmployee] = useState({});

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

        console.log('newUserData')
        console.log(data)
        axios.put(`/api/users/${props?.userData?._id}`, {
            employees: oldEployees
        }).then((res) => {
            if (res.status === 200) {
                props?.handleUserData(res.data)
            }
        })

    };



    const [formJson, setFormJson] = useState({
        "fields": [
            {
                "label": "שם פרטי",
                "name": "firstname",
                "type": "text",
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "שם משפחה",
                "name": "lastname",
                "type": "text",
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "תעודת זהות",
                "name": "idNumber",
                "type": "number",
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "טלפון",
                "name": "phoneNumber",
                "type": "number",
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "אימייל",
                "name": "email",
                "type": "email",
                "autocomplete": "new-email",
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "סיסמא",
                "name": "password",
                "type": "password",
                "autocomplete": "new-password",
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "תפקיד",
                "name": "role",
                "type": "select",
                "options": [
                    { "label": "", "value": "choose" },
                    { "label": "בעלים", "value": "owner" },
                    { "label": "מנהל עבודה", "value": "manager" },
                    { "label": "מרכזן", "value": "controller" },
                    { "label": "נהג", "value": "driver" }
                ],
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "דרגת רישיון",
                "name": "licenseLevel",
                "type": "select",
                "options": [
                    { "label": "", "value": "choose" },
                    { "label": "B", "value": "B" },
                    { "label": "C", "value": "C" },
                    { "label": "C1", "value": "C1" },
                    { "label": "D", "value": "D" },
                    { "label": "D1", "value": "D1" },
                    { "label": "D2", "value": "D2" },
                    { "label": "D3", "value": "D3" }
                ],
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "תוקף רישיון נהיגה",
                "name": "licenseExpiration",
                "type": "text",
                "attributes": {
                    "dateandtext": "true",
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "תאריך לידה",
                "name": "birthDate",
                "type": "text",
                "attributes": {
                    "dateandtext": "true",
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            },
            {
                "label": "הצמדת רכב",
                "name": "carAttach",
                "type": "select",
                "options": [
                    { "label": "", "value": "choose" },
                    { "label": "car1", "value": "car1" },
                    { "label": "car2", "value": "car2" },
                    { "label": "car3", "value": "car3" }
                ],
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                },
            },
            {
                "label": "הצמדת מסלול קבוע",
                "name": "course",
                "type": "select",
                "options": [
                    { "label": "", "value": "choose" },
                    { "label": "car1", "value": "car1" },
                    { "label": "car2", "value": "car2" },
                    { "label": "car3", "value": "car3" }
                ],
                "attributes": {
                    "onChange": "handleFields",
                    "onBlur": "handleInputBlur",
                    "onFocus": "handleInputFocus"
                }
            }
        ]
    }
    );

    return (
        <div className={styles.wrapper}>
            <GeneralForm buttonText={"הוספת עובד"} json={formJson} onChangeFunc={handleFields} onSubmitFunc={handleSubmit} />
            {/* <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        שם פרטי
                    </label>
                    <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => handleInputBlur(e)}
                        onFocus={(e) => handleInputFocus(e)}
                    />
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        שם משפחה
                    </label>
                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => handleInputBlur(e)}
                        onFocus={(e) => handleInputFocus(e)}
                    />
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        תעודת זהות
                    </label>
                    <input
                        type="number"
                        name="idNumber"
                        id="idNumber"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => handleInputBlur(e)}
                        onFocus={(e) => handleInputFocus(e)}
                    />
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        טלפון
                    </label>
                    <input
                        type="number"
                        name="phoneNumber"
                        id="phoneNumber"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => handleInputBlur(e)}
                        onFocus={(e) => handleInputFocus(e)}
                    />
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        אימייל
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        autocomplete="new-email"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => handleInputBlur(e)}
                        onFocus={(e) => handleInputFocus(e)}
                    />
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        סיסמא
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete='new-password'
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => handleInputBlur(e)}
                        onFocus={(e) => handleInputFocus(e)}
                    />
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        תפקיד
                    </label>
                    <select
                        name="role"
                        id="role"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => handleInputBlur(e)}
                        onFocus={(e) => handleInputFocus(e)}
                    >
                        <option value="choose"></option>
                        <option value="owner">בעלים</option>
                        <option value="manager">מנהל עבודה</option>
                        <option value="controller">מרכזן</option>
                        <option value="driver">נהג</option>
                    </select>
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        דרגת רישיון
                    </label>
                    <select
                        name="licenseLevel"
                        id="licenseLevel"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => handleInputBlur(e)}
                        onFocus={(e) => handleInputFocus(e)}
                    >
                        <option value="choose"></option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="C1">C1</option>
                        <option value="D">D</option>
                        <option value="D1">D1</option>
                        <option value="D2">D2</option>
                        <option value="D3">D3</option>
                    </select>
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        תוקף רישיון נהיגה
                    </label>
                    <input
                        type={dateInputsFocused["licenseExpiration"] ? "date" : "text"}
                        name="licenseExpiration"
                        id="licenseExpiration"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => { handleInputBlur(e); handleBlur(e.target.name, e.target.value) }}
                        onFocus={(e) => { handleInputFocus(e); handleFocus(e.target.name) }}
                    />
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        תאריך לידה
                    </label>
                    <input
                        type={dateInputsFocused["birthDate"] ? "date" : "text"}
                        name="birthDate"
                        id="birthDate"
                        onChange={(e) => handleFields(e)}
                        onBlur={(e) => { handleInputBlur(e); handleBlur(e.target.name, e.target.value) }}
                        onFocus={(e) => { handleInputFocus(e); handleFocus(e.target.name) }}
                    />
                </div>

                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        הצמדת רכב
                    </label>
                    {props?.userData?.cars.length > 0 &&
                        <select
                            name="carAttach"
                            id="carAttach"
                            onChange={(e) => { handleFields(e); handleInputBlur(e) }}
                            onBlur={(e) => handleInputBlur(e)}
                            onFocus={(e) => handleInputFocus(e)}
                        >
                            <option value="choose"></option>
                            {
                                props?.userData?.cars.map((car) => {
                                    return (
                                        <option key={car?.records[0]?.mispar_rechev} value={car?.records[0]?.mispar_rechev}>
                                            {car?.records[0]?.mispar_rechev}
                                        </option>
                                    )
                                })
                            }
                        </select>}
                </div>
                <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                    <label>
                        הצמדת מסלול קבוע
                    </label>
                    {props?.userData?.cars.length > 0 &&
                        <select
                            name="course"
                            id="course"
                            onChange={(e) => { handleFields(e); handleInputBlur(e) }}
                            onBlur={(e) => handleInputBlur(e)}
                            onFocus={(e) => handleInputFocus(e)}
                        >
                            <option value="choose"></option>
                            {
                                props?.userData?.cars.map((car) => {
                                    return (
                                        <option key={car?.records[0]?.mispar_rechev} value={car?.records[0]?.mispar_rechev}>
                                            {car?.records[0]?.mispar_rechev}
                                        </option>
                                    )
                                })
                            }
                        </select>}
                </div>
                <div className={`${styles.parentWrapper} ${styles.address}`}>
                    <h3>תאריכי העסקה</h3>
                    <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                        <label>
                            התחלת עבודה
                        </label>
                        <input
                            type={dateInputsFocused["jobStarted"] ? "date" : "text"}
                            name="jobStarted"
                            id="jobStarted"
                            onChange={(e) => handleFields(e)}
                            onBlur={(e) => { handleInputBlur(e); handleBlur(e.target.name, e.target.value) }}
                            onFocus={(e) => { handleInputFocus(e); handleFocus(e.target.name) }}
                        />
                    </div>
                    <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                        <label>
                            סיום עבודה (השאר ריק אם העובד עדיין פעיל)
                        </label>
                        <input
                            type={dateInputsFocused["jobEnded"] ? "date" : "text"}
                            name="jobEnded"
                            id="jobEnded"
                            onChange={(e) => handleFields(e)}
                            onBlur={(e) => { handleInputBlur(e); handleBlur(e.target.name, e.target.value) }}
                            onFocus={(e) => { handleInputFocus(e); handleFocus(e.target.name) }}
                        />
                    </div>
                </div>
                <div className={`${styles.parentWrapper} ${styles.bankAccount}`}>
                    <h3>פרטי בנק</h3>
                    <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                        <label>
                            בנק
                        </label>
                        <input
                            type="text"
                            parent="bankAccount"
                            name="bankName"
                            id="bankName"
                            onChange={(e) => handleFields(e)}
                            onBlur={(e) => handleInputBlur(e)}
                            onFocus={(e) => handleInputFocus(e)}
                        />
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                            <label>
                                מספר בנק
                            </label>
                            <input
                                type="number"
                                parent="bankAccount"
                                name="number"
                                id="bankNumber"
                                onChange={(e) => handleFields(e)}
                                onBlur={(e) => handleInputBlur(e)}
                                onFocus={(e) => handleInputFocus(e)}
                            />
                        </div>
                        <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                            <label>
                                מספר סניף
                            </label>
                            <input
                                type="number"
                                parent="bankAccount"
                                name="branch"
                                id="branch"
                                onChange={(e) => handleFields(e)}
                                onBlur={(e) => handleInputBlur(e)}
                                onFocus={(e) => handleInputFocus(e)}
                            />
                        </div>
                        <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                            <label>
                                מספר חשבון
                            </label>
                            <input
                                type="number"
                                parent="bankAccount"
                                name="accountNumber"
                                id="accountNumber"
                                onChange={(e) => handleFields(e)}
                                onBlur={(e) => handleInputBlur(e)}
                                onFocus={(e) => handleInputFocus(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className={`${styles.parentWrapper} ${styles.address}`}>
                    <h3>כתובת</h3>
                    <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                        <label>
                            עיר
                        </label>
                        <input
                            type="text"
                            parent="address"
                            name="city"
                            id="city"
                            onChange={(e) => handleFields(e)}
                            onBlur={(e) => handleInputBlur(e)}
                            onFocus={(e) => handleInputFocus(e)}
                        />
                    </div>
                    <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                        <label>
                            רחוב
                        </label>
                        <input
                            type="text"
                            parent="address"
                            name="street"
                            id="street"
                            onChange={(e) => handleFields(e)}
                            onBlur={(e) => handleInputBlur(e)}
                            onFocus={(e) => handleInputFocus(e)}
                        />
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                            <label>
                                מספר בית
                            </label>
                            <input
                                type="number"
                                parent="address"
                                name="number"
                                id="number"
                                onChange={(e) => handleFields(e)}
                                onBlur={(e) => handleInputBlur(e)}
                                onFocus={(e) => handleInputFocus(e)}
                            />
                        </div>
                        <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                            <label>
                                כניסה
                            </label>
                            <input
                                type="text"
                                parent="address"
                                name="entrance"
                                id="entrance"
                                onChange={(e) => handleFields(e)}
                                onBlur={(e) => handleInputBlur(e)}
                                onFocus={(e) => handleInputFocus(e)}
                            />
                        </div>
                        <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                            <label>
                                קומה
                            </label>
                            <input
                                type="number"
                                parent="address"
                                name="floor"
                                id="floor"
                                onChange={(e) => handleFields(e)}
                                onBlur={(e) => handleInputBlur(e)}
                                onFocus={(e) => handleInputFocus(e)}
                            />
                        </div>
                    </div>
                </div>

                <div className={`${styles.parentWrapper} ${styles.emergencyContacts}`}>
                    <h3>איש קשר לחירום</h3>
                    <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                        <label>
                            שם פרטי
                        </label>
                        <input
                            type="text"
                            parent="emergencyContacts"
                            name="firstname"
                            id="emergencyFirstname"
                            onChange={(e) => handleFields(e)}
                            onBlur={(e) => handleInputBlur(e)}
                            onFocus={(e) => handleInputFocus(e)}
                        />
                    </div>
                    <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                        <label>
                            שם משפחה
                        </label>
                        <input
                            type="text"
                            parent="emergencyContacts"
                            name="lastname"
                            id="emergencyLastname"
                            onChange={(e) => handleFields(e)}
                            onBlur={(e) => handleInputBlur(e)}
                            onFocus={(e) => handleInputFocus(e)}
                        />
                    </div>
                    <div className={`${styles.labelWrapper} `} onClick={(e) => handleLabelClick(e)}>
                        <label>
                            מספר טלפון
                        </label>
                        <input
                            type="number"
                            parent="emergencyContacts"
                            name="phoneNumber"
                            id="emergencyPhoneNumber"
                            onChange={(e) => handleFields(e)}
                            onBlur={(e) => handleInputBlur(e)}
                            onFocus={(e) => handleInputFocus(e)}
                        />
                    </div>
                </div>

                <button className={styles.submit_btn}>הוספת העובד</button>
            </form> */}
        </div>
    );
};

export default AddEmployeeForm;
