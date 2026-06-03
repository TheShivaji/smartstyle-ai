import app from "./src/app.js";
import connectDB from "./src/config/db.js"

(async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit(1);
    }
})()