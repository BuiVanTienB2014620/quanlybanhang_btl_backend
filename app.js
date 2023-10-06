const express = require("express");

const ordersRouter = require("./app/routes/order.route");
const orderDetailsRouter = require("./app/routes/orderdetail.route");
const staffsRouter = require("./app/routes/staff.route");
const imgcsRouter = require("./app/routes/imgc.route");
const customersRouter = require("./app/routes/customer.route");
const commoditiesRouter = require("./app/routes/commoditi.route");


const cors = require("cors");
const ApiError = require ("./app/api-error");


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/orders", ordersRouter);
app.use("/api/orderDetails", orderDetailsRouter);
app.use("/api/staffs", staffsRouter);
app.use("/api/imgcs", imgcsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/commodities", commoditiesRouter);

app.get("/", (req,res) => {
    res.json({ message: "Welcome to order application "});

});



// handle 404 responese
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",

    });
});




module.exports = app;