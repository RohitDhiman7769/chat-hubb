import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name :'cart',
    initialState : {
        items : {val : 'heyy'}
    },
    reducers : {
        addItem : (state , action )=>{
            console.log(action)
            state.items.val = action.payload.val;
        },
        removeItem : (state)=>{
            state.items.pop()
        },
        clearCart :(state , action)=>{
            state.items.length = 0
        }
    }
})

export const {addItem , removeItem, clearCart} = cartSlice.actions;

export default cartSlice.reducer; 