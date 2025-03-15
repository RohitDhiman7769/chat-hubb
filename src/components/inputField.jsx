import { useState } from 'react'
import './inputField.css'
function Input({placeholder, type, name,classname,setFieldValue}) {
//   const [count, setCount] = useState(0)

const handleChange = (event) => {
    // setInputValue(event.target.value);
    setFieldValue(name,event.target.value); // Send data to parent
};
  return (
    <>
     <div>
       <input style={{backgroundColor:'white', color: 'black'}}  placeholder={placeholder} type={type} className={classname} onChange={handleChange} name={name}  />
     </div>
    </>
  )
}

export default Input
