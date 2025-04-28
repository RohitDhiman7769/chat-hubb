import { useState } from 'react'
import './inputField.css'
function Input({ placeholder, type, name, classname, setFieldValue, paramToKnowComp, value , inputRef}) {

  const handleChange = (event) => {
    if (paramToKnowComp == 1) {
      setFieldValue(name, event.target.value); // Send data to parent
    } else if (paramToKnowComp == 2) {
      setFieldValue(event.target.value);
    }else if (paramToKnowComp == 3) {
      setFieldValue(event.target.checked);

    }
  };
  return (
    <>
        <input style={{ backgroundColor: 'white', color: 'black' }} placeholder={placeholder} type={type} className={classname} onChange={handleChange} name={name}   ref={inputRef} />
    </>
  )
}

export default Input
