import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './config/db.js'

import userRouter from './routes/user.js'
import tutorRouter from './routes/tutor.js'
import adminRouter from './routes/admin.js'

import {errorHandler,notFound} from './middleware/errorHandling.js'
import passport from './config/passport.js'

connectDB();


const app= express()
app.use(passport.initialize())

app.use(cors({
    credentials : true,
    origin : process.env.CLIENT_URL
}))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));

//User Route
app.use('/api/user',userRouter);

//Tutor route
app.use('/api/tutor',tutorRouter)

//Admin route
app.use('/api/admin',adminRouter)

//error handling
app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT || 9000,()=>{
    console.log(`Server started on http://localhost:${process.env.PORT}`)
})