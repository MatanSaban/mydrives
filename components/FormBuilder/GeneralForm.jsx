import React from 'react';
import styles from '../EmployeesComps/addemployee.module.scss'

const GeneralForm = (props) => {
    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic
    };

    // const mapFunctionNameToFunction = async (functionName) => {
    //     try {
    //         const functions = await import('../../functions/functions.js');
    //         const fn = functions[functionName];
    //         if (typeof fn === 'function') {
    //             return fn;
    //         } else {
    //             console.error(`Function ${functionName} not found.`);
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error(`Error importing functions: ${error}`);
    //         return null;
    //     }
    // };


    return (
        <div>
            <form className={styles.form} onSubmit={(e) => props.onSubmitFunc(e)}>
                {props?.json?.fields?.map((field) => (
                    <div className={styles.labelWrapper} onClick={(e) => props.onLabelClickFunc(e)} key={field.name}>
                        {/* {console.log('field?.autocomplete')}
                        {console.log(field.attributes.dateandtext)} */}
                        <label>{field.label}</label>
                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                onChange={(e) => props.onChangeFunc(e)}
                                onBlur={(e) => props.onBlurFunc(e)}
                                onFocus={(e) => props.onFocusFunc(e)}
                            >
                                {field.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={props.dateInputsFocused?.[field.name] === true ? "date" : "text"}
                                name={field.name}
                                onChange={(e) => props.onChangeFunc(e)}
                                onBlur={(e) => props.onBlurFunc(e)}
                                onFocus={(e) => props.onFocusFunc(e)}
                                autoComplete={field?.autocomplete ? field?.autocomplete : "false"}
                                dateandtext={field?.attributes.dateandtext ? 'true' : 'false'}
                            />
                        )}
                    </div>
                ))}
                <button className={styles.submit_btn}>{props.buttonText}</button>
            </form>
        </div>
    );
};

export default GeneralForm;
