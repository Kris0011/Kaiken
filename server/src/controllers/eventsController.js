const Trade = require("../models/Trade");
const Event = require("../models/Event");
const { getWebSocketInstance } = require('../config/socket');
const { executeTrades } = require('../utils/tradeUtils');
const WebSocket = require('ws');
const uploadImageToCloudinary = require('../utils/uploadCloudinary');


exports.createEvent = async (req, res) => {
    try {
        // console.log("Creating event with data:", req);
        const { name, description, startTime, status, currentYesPrice } = req.body;

        console.log("Request body for creating event:", req.body);
        console.log("Request file for creating event:", req.file);



        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file.buffer);
        }

        // Create event with default volumes 0, winningOutcome null
        const event = new Event({
            image: imageUrl,
            name,
            description,
            startTime,
            status: status || 'upcoming',
            currentYesPrice: currentYesPrice || 0.5,
            totalYesVolume: 0,
            totalNoVolume: 0,
            winningOutcome: null
        });

        await event.save();

        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Error creating event" });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Error fetching events" });
    }
};

exports.deleteEventByID = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        await Trade.deleteMany({ event: id });

        res.status(200).json({ message: "Event and related trades deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Request body for updating event status:", req.body);
        const { status, result } = req.body;
        const winningOutcome = result?.toLowerCase();


        const { currentYesPrice, totalYesVolume, totalNoVolume } = req.body;

        if (!['upcoming', 'live', 'resolved'].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Update fields as per input
        event.status = status;

        if (typeof currentYesPrice === 'number') {
            event.currentYesPrice = currentYesPrice;
        }
        if (typeof totalYesVolume === 'number') {
            event.totalYesVolume = totalYesVolume;
        }
        if (typeof totalNoVolume === 'number') {
            event.totalNoVolume = totalNoVolume;
        }

        if (status === 'resolved') {
            if (!['yes', 'no'].includes(winningOutcome)) {
                return res.status(400).json({ message: "winningOutcome must be 'yes' or 'no' when status is completed" });
            }
            event.winningOutcome = winningOutcome;
        } else {
            // Reset winning outcome if not completed
            event.winningOutcome = null;
        }

        await event.save();

        // Notify clients via WebSocket
        const wss = getWebSocketInstance();
        if (wss && wss.clients) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: "eventUpdated", event }));
                }
            });
        }

        // If event completed, execute trades for this event
        if (status === 'resolved' && event.winningOutcome) {
            await executeTrades(id, event.winningOutcome);
        }

        res.json({ message: "Event updated successfully", event });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: error.message });
    }
};



exports.getUpcomingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'upcoming' });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        res.status(500).json({ error: "Error fetching upcoming events" });
    }
};

exports.getLiveEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'live' });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching live events:", error);
        res.status(500).json({ error: "Error fetching live events" });
    }
};


exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).lean();
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
