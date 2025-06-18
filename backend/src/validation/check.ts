import z from "zod"

export const signupSchema=z.object({
    email:z.string(),
    name:z.string(),
    password:z.string(),
    
})

export const signinSchema=z.object({
    email:z.string(),
    password:z.string()
})

