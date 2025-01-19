const express = require("express");
const DB_hotel = require("./database/db");
const RolesRouter = require("./routes/RolesRoute");
const PermissionListRouter = require("./routes/PermissionListRoute");
const PermissionRouter = require("./routes/PermissionRoute");
const AuthRouter = require("./routes/AuthRoute");
const RoomRouter = require("./routes/RoomRoute");
const FacilityRouter = require("./routes/FacilityRoute");
const app = express();
app.use(express.json())
DB_hotel()
app.listen(90,function(){
    console.log("server started !")
})
app.use("/api/v1/auth",AuthRouter)
app.use("/api/v1/roles",RolesRouter)
app.use("/api/v1/permission_list",PermissionListRouter)
app.use("/api/v1/permission",PermissionRouter)
app.use("/api/v1/room",RoomRouter)
app.use("/api/v1/facility",FacilityRouter)