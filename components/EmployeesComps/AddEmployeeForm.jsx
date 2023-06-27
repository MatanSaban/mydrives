import React, { useState } from 'react';
import styles from './addemployee.module.scss';

const AddEmployeeForm = (props) => {
    const [focusedLabel, setFocusedLabel] = useState('');

    const handleFields = (e) => {
        // handleFields logic
    };

    const handleSubmit = (e) => {
        // handleSubmit logic
    };


    const handleInputFocus = (e) => {
        const input = e.target;
        const labelWrapper = input.closest(`.${styles.labelWrapper}`);

        labelWrapper.classList.add(styles.focused);
        setFocusedLabel(labelWrapper.id);
    };

    const handleInputBlur = (e) => {
        const input = e.target;
        const labelWrapper = input.closest(`.${styles.labelWrapper}`);

        labelWrapper.classList.remove(styles.focused);
        setFocusedLabel('');

        console.log('input.value');
        console.log(input.value);
        if (input.value.trim() !== '' && input.value.trim() != 'choose') {
            labelWrapper.classList.add(styles.filled);
            console.log("here");
        } else {
            labelWrapper.classList.remove(styles.filled);
            console.log("here2");
        }
    };

    const handleLabelClick = (e) => {
        const label = e.target;
        const labelWrapper = label.closest(`.${styles.labelWrapper}`);
        const input = labelWrapper.querySelector('input');

        if (input) {
            input.focus();
        }

        if (!labelWrapper.classList.contains(styles.filled) && !labelWrapper.classList.contains(styles.focused)) {
            labelWrapper.classList.add(styles.focused);
            setFocusedLabel(labelWrapper.id);
        }
    };

    return (
        <div className={styles.wrapper}>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
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
                <div className={`${styles.parentWrapper} ${styles.address}`}>
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
                <div className={`${styles.parentWrapper} ${styles.address}`}>
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
                <div className={`${styles.parentWrapper} ${styles.emergencyContacts}`}>
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
                <button>הוספת העובד</button>
            </form>
        </div>
    );
};

export default AddEmployeeForm;
