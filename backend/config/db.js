import mongoose from "mongoose";


export const connectDB= async () => {
    await mongoose.connect('mongodb+srv://lathusan_db_user:2004812@cluster0.75krggb.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}