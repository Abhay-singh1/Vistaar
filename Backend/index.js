const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config({
    path:'./config/index.env'
})


const conDb = require('./config/db.js')
const db = mongoose.connection
const app = express()

app.use(express.json())
app.use(cors())


conDb()
const customer = db.collection('customers')

const Port  = process.env.PORT

app.listen(Port,()=>{
    console.log(`Server listening on ${Port}!`)
})



//Get the list of active customers in DB

app.get('/customers', async(req, res)=>{
    try {
        const response = await db.collection('customers').find({'active':true}).toArray()
        console.log(response)
        res.status(200).json(response)
    } catch (err) {
        console.log(err)
    }
})


//Get the transactions linked to the account

app.get('/transactions/:account', async(req, res)=>{
    try {
        const id = Number(req.params.account)
        const response = await db.collection('transactions').find({account_id: id}).toArray()
        console.log(response, id)
        res.status(200).json(response)
    } catch (err) {
        console.log(err)
    }
})


//  Create a mongo query to list down account ids which has made at least one transaction below the amount 5000

app.get('/accounts',async(req,res)=>{
    try {
        const response = await db.collection('transactions').aggregate([
            {
                $unwind: "$transactions"
            },
            {
                $match: {
                "transactions.amount": { $lt: 5000 }
                }
            },
            {
                $group:{
                    _id: "$account_id"
                }
            }
        ]).toArray()
        console.log(response)
        res.status(200).json(response)
    } catch (err) {
        console.log(err)
    }
})


// Create a mongo query to list down distinct list of products available in the system

app.get('/products', async(req,res)=>{
    try {
        const response = await db.collection('accounts').distinct('products')
        console.log(response)
        res.status(200).json(response)
    } catch (err) {
        console.log(err)
    }
})