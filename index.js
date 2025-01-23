const express = require("express");
const DB_hotel = require("./database/db");
const RolesRouter = require("./routes/RolesRoute");
const PermissionListRouter = require("./routes/PermissionListRoute");
const PermissionRouter = require("./routes/PermissionRoute");
const AuthRouter = require("./routes/AuthRoute");
const RoomRouter = require("./routes/RoomRoute");
const FacilityRouter = require("./routes/FacilityRoute");
const AdditionalServiceRouter = require("./routes/AdditionalServiceRoute");
const authMiddleware = require("./middleware/authMiddleware");
const BookingRouter = require("./routes/BookingRoute");
const multer = require("multer");
const path = require("path");
const app = express();
app.use(express.json())
const cors = require('cors');
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

DB_hotel()
app.listen(90,function(){
    console.log("server started !")
})

// Role Based

app.use("/api/v1/auth",AuthRouter)
app.use("/api/v1/roles",RolesRouter)
app.use("/api/v1/permission_list",PermissionListRouter)
app.use("/api/v1/permission",PermissionRouter)

// Auth Based

app.use("/api/v1/room",RoomRouter)
app.use("/api/v1/facility",authMiddleware.verifyaccount,FacilityRouter)
app.use("/api/v1/a_service",authMiddleware.verifyaccount,AdditionalServiceRouter)
app.use("/api/v1/booking",authMiddleware.verifyaccount,BookingRouter)