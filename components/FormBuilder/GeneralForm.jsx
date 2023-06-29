import React, { useState } from 'react';
import styles from './generalform.module.scss';

const GeneralForm = (props) => {
    const [focusedLabel, setFocusedLabel] = useState('');
    const [dateInputsFocused, setDateInputsFocused] = useState({});

    const handleFormSubmit = (event) => {
        event.preventDefault();
        props.onSubmitFunc(event)
    };

    const shouldRenderField = (condition) => {
        // Evaluate the condition expression dynamically
        if (condition) {
            return !!eval(condition);
        } else {
            return true;
        }
    };

    const onFocusFunc = (e) => {
        const input = e.target;
        const labelWrapper = input.closest(`.${styles.labelWrapper}`);

        labelWrapper.classList.add(styles.focused);
        labelWrapper.classList.remove(styles.notFocused);
        labelWrapper.classList.remove(styles.notFilled);
        setFocusedLabel(labelWrapper.id);

        if (e.target.attributes['dateandtext']?.value === 'true') {
            setDateInputsFocused((prevState) => ({ ...prevState, [e.target.name]: true }));
        }
    };

    const onBlurFunc = (e) => {
        const input = e.target;
        const labelWrapper = input.closest(`.${styles.labelWrapper}`);

        labelWrapper.classList.add(styles.notFilled);
        labelWrapper.classList.add(styles.notFocused);
        labelWrapper.classList.remove(styles.focused);
        setFocusedLabel('');

        if (input.value.trim() !== '' && input.value.trim() !== 'choose') {
            labelWrapper.classList.add(styles.filled);
        } else {
            labelWrapper.classList.remove(styles.filled);
        }
    };

    const onLabelClickFunc = (e) => {
        const label = e.target;
        const labelWrapper = label.closest(`.${styles.labelWrapper}`);
        const input = labelWrapper.querySelector('input');
        const select = labelWrapper.querySelector('select');

        if (input) {
            input.focus();
        }
        if (select) {
            select.focus();
        }

        if (!labelWrapper.classList.contains(styles.filled) && !labelWrapper.classList.contains(styles.focused)) {
            labelWrapper.classList.add(styles.focused);
            setFocusedLabel(labelWrapper.id);
        }
    };


    const onChangeFunc = (e) => {
        props.onChangeFunc(e, props?.passedData);
    };


    const checkForPassedData = (defVal) => {
        const data = props?.passedData;
        if (data && defVal) {
            let value = defVal.split('?.');
            value[0] = "data";
            value = value.join("?.")
            return eval(value);
        } else {
            return null;
        }
    };


    return (
        <form className={styles.form} onSubmit={(e) => handleFormSubmit(e)}>
            {props?.json?.fields?.map((field) =>
                shouldRenderField(field.condition) ? (
                    <div className={`${styles.labelWrapper} ${field?.defaultValue?.length > 0 ? `${styles.filled} ${styles.inPopupForm}` : ``}`} onClick={(e) => onLabelClickFunc(e)} key={field.name}>
                        <label className={`${styles.labelWrapper} ${field?.defaultValue?.length > 0 ? styles.inPopupForm : ""}`} >{field.label}</label>
                        {field.type === 'select' && (
                            <select
                                name={field.name}
                                onChange={(e) => onChangeFunc(e)}
                                onBlur={(e) => onBlurFunc(e)}
                                onFocus={(e) => onFocusFunc(e)}
                                defaultValue={field?.defaultValue && checkForPassedData(field?.defaultValue)}
                                required={field?.required ? field?.required : false}
                            >
                                {field.options.map((option) => (
                                    <option key={option?.value} value={option?.value}>
                                        {option?.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {field.type !== 'select' && (
                            <input
                                type={dateInputsFocused?.[field.name] === true ? 'date' : 'text'}
                                name={field.name}
                                onChange={(e) => onChangeFunc(e)}
                                onBlur={(e) => onBlurFunc(e)}
                                onFocus={(e) => onFocusFunc(e)}
                                autoComplete={field?.autocomplete ? field?.autocomplete : 'false'}
                                dateandtext={field?.attributes.dateandtext ? 'true' : 'false'}
                                defaultValue={field?.defaultValue && checkForPassedData(field?.defaultValue)}
                                required={field?.required ? field?.required : false}

                            />
                        )}
                    </div>
                ) : null
            )}
            <button className={styles.submit_btn}>{props.buttonText}</button>
        </form>
    );
};

export default GeneralForm;
