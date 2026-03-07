import express from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Eureka } from 'eureka-js-client';

const app = express();
app.use(express.json());

const PORT = 8084;

// --- 1. MongoDB Connection Setup ---
// We will use local MongoDB for now. Later we can replace this with Azure/Atlas Connection String.
const MONGO_URI = 'mongodb://127.0.0.1:27017/greenhouse_crops';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- 2. Mongoose Schema & Model ---
// Defining the structure of a Crop batch and its lifecycle states [cite: 154, 156]
const cropSchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    batchId: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ['SEEDLING', 'VEGETATIVE', 'HARVESTED'], // State Machine [cite: 156]
        default: 'SEEDLING'
    },
    plantedAt: { type: Date, default: Date.now }
});

const Crop = mongoose.model('Crop', cropSchema);

// --- 3. Eureka Server Registration ---
const client = new Eureka({
    instance: {
        app: 'CROP-INVENTORY-SERVICE',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${PORT}`,
        port: {
            '$': PORT,
            '@enabled': true,
        },
        vipAddress: 'CROP-INVENTORY-SERVICE',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

client.start();

// --- 4. REST API Endpoints ---

// Endpoint to register a new crop batch [cite: 158]
app.post('/api/crops', async (req: Request, res: Response): Promise<any> => {
    try {
        const newCrop = new Crop({
            cropName: req.body.cropName,
            batchId: req.body.batchId
        });
        const savedCrop = await newCrop.save();
        res.status(201).json(savedCrop);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to view the current crop inventory [cite: 161]
app.get('/api/crops', async (req: Request, res: Response) => {
    try {
        const crops = await Crop.find();
        res.status(200).json(crops);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update the lifecycle stage (status) of a crop [cite: 159]
app.put('/api/crops/:id/status', async (req: Request, res: Response): Promise<any> => {
    try {
        const { status } = req.body;

        // Validate if the status is one of the allowed enum values
        const allowedStatuses = ['SEEDLING', 'VEGETATIVE', 'HARVESTED'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status. Must be SEEDLING, VEGETATIVE, or HARVESTED." });
        }

        const updatedCrop = await Crop.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true } // Returns the updated document
        );

        if (!updatedCrop) {
            return res.status(404).json({ message: 'Crop not found' });
        }

        res.status(200).json(updatedCrop);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Crop Inventory Service is running on port ${PORT}`);
});