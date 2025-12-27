const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");  


const authenticationRouter = require('./Routers/authenticationRouter.js')
const myprofileRouter = require('./Routers/myprofileRouter.js');
const adminRouter = require('./Routers/adminRouter.js');
const connectionRouter = require('./Routers/connectionRouter.js');
const fileUpload = require('express-fileupload');
const cloudinary = require('./utils/cloudinary.js');
const verifyToken = require('./Middleware/verifyToken.js');
const vefiryADMIN = require('./Middleware/vefiryADMIN.js')
const blockByADMINForWork = require('./Middleware/blockByAdmin.js');
const freekaViewroute = require('./Routers/freekaViewroute.js');
const ProfilesRouter = require('./Routers/ProfilesRouter.js');
const contactRouter = require('./Routers/contactRouter.js');
const connectDatabase = require('./db/dataBase.js');

app.use(express.json());
app.use(express.static('./public'));
app.use(morgan("dev"));
app.use(cookieParser());
connectDatabase()

app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000", "https://muslimmalikrishte.com", "https://api.muslimmalikrishte.com", "https://admin.muslimmalikrishte.com", "https://www.muslimmalikrishte.com"],
    credentials: true,
    methods: "GET,POST,DELETE,PATCH",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.options('*', cors());


app.use(fileUpload({ useTempFiles: true }));

app.get('/', (req, res) => {
  res.send("API WORKING FINE");
});

app.use('/showpieces', freekaViewroute);
app.use('/api/v1/auth', authenticationRouter);
app.use('/api/v1/profiles',  ProfilesRouter);
app.use('/api/v1/myprofile', verifyToken, blockByADMINForWork, myprofileRouter);
app.use('/api/v1/connectionRequest', verifyToken, connectionRouter);
// app.use('/api/v1/adminPanel',verifyToken,vefiryADMIN,adminRouter);
app.use('/api/v1/adminPanel', adminRouter);
app.use('/api/v1/contact', contactRouter);




app.listen(process.env.PORT || 9000, (() => {
  console.log("connected to Port", process.env.PORT || 9000);
}));