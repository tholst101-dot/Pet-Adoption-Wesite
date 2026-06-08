const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Core Middleware Infrastructure Configs
app.use(cors());
app.use(express.json());

// 2. Establish Local MongoDB Handshake Connection
mongoose.connect("mongodb://127.0.0.1:27017/PetAdoption")
  .then(() => console.log("🚀 Success: MongoDB connected to local pet_adoption database!"))
  .catch(err => console.error("❌ Database Connection Error:", err.message));

// 3. Database Model Schema Layout
const RegistrationSchema = new mongoose.Schema({  applicantName: { type: String, required: true },
  phone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  animalCategory: { type: String, required: true },
  breedSelected: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  amountCharged: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', RegistrationSchema);

// 4. REST API Endpoints Routing Logic

// POST Endpoint: Form processing & database persistence (Email dispatch bypassed)
app.post('/api/adopt', async (req, res) => {
  try {
    const newRequest = new Registration(req.body);
    const savedData = await newRequest.save();
    
    res.status(201).json({ success: true, data: savedData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET Endpoint: Querying database records for Admin Control Dashboard view
app.get('/api/admin/records', async (req, res) => {
  try {
    const allRecords = await Registration.find().sort({ registeredAt: -1 });
    res.status(200).json(allRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Endpoint: Allows admin to purge a specific document by its Object ID
app.delete('/api/admin/records/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    await Registration.findByIdAndDelete(targetId);
    res.status(200).json({ success: true, message: "Record successfully purged from MongoDB collections index." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`📡 Full-Stack API Engine listening on port ${PORT}`));