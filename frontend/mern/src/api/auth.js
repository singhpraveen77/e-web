import axios  from "axios";

const api= axios.create({
    baseURL:"http://localhost:5000/app/v1/user",
    
})

export const resgisterUser=(userData)=> api.post("/register",userData);
export const loginUser=(userData)=> api.post("/login",userData);