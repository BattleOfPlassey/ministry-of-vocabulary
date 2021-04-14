import React from 'react';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import './InputField.css'

const InputField = (props) => {
    const OnErrorClass = ['form-control', 'InputError'].join(' ');
    return (
        <div className="form-group">
            <label>{props.label}</label>
            <input type={props.type} autoComplete='on' name={props.name}
                defaultValue={props.defaultValue} placeholder={props.placeholder || props.label}
                className={props.errors[props.name] ? OnErrorClass : 'form-control'}
                onChange={props.onChange} {...props} />
            {props.errors[props.name] !== '' && <ErrorMsg msg={props.errors[props.name]} />}
        </div>
    );
}

export default InputField;