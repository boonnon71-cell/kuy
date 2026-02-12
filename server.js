const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./patients.json";

/* อ่านข้อมูล */
function readPatients() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

/* บันทึกข้อมูล */
function savePatients(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* ============================= */
/* API ดึงผู้ป่วยทั้งหมด */
app.get("/patients", (req, res) => {
    res.json(readPatients());
});

/* API แก้ไขวันนัด */
app.put("/patients/:name/appointment", (req, res) => {
    const { name } = req.params;
    const { appointment } = req.body;

    let patients = readPatients();

    const index = patients.findIndex(p => p.name === name);

    if (index === -1) {
        return res.status(404).json({ message: "ไม่พบผู้ป่วย" });
    }

    patients[index].appointment = appointment;
    savePatients(patients);

    res.json({ message: "อัปเดตสำเร็จ" });
});

/* ============================= */

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
