
const express = require('express');
const app = express();

app.use(express.json());

let registrations = [
    {
        id: 501,
        participantName: "Riya Sharma",
        eventName: "Tech Fest",
        department: "CSE",
        ticketCount: 2,
        paymentStatus: "Paid"
    },
    {
        id: 502,
        participantName: "Arjun Mehta",
        eventName: "Code Sprint",
        department: "IT",
        ticketCount: 1,
        paymentStatus: "Pending"
    },
    {
        id: 503,
        participantName: "Neha Verma",
        eventName: "Tech Fest",
        department: "ECE",
        ticketCount: 3,
        paymentStatus: "Paid"
    }
];

// GET ALL
app.get('/api/registrations', (req, res) => {
    res.status(200).json(registrations);
});

// POST
app.post('/api/registrations', (req, res) => {
    const { participantName, eventName, department, ticketCount, paymentStatus } = req.body;

    if (!participantName || !eventName || !department ||
        !Number.isInteger(ticketCount) || ticketCount <= 0 ||
        !['Paid', 'Pending'].includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const newRegistration = {
        id: registrations.length ? Math.max(...registrations.map(r => r.id)) + 1 : 501,
        participantName,
        eventName,
        department,
        ticketCount,
        paymentStatus
    };

    registrations.push(newRegistration);
    res.status(201).json(newRegistration);
});

// FILTER BY DEPARTMENT
app.get('/api/registrations/filter', (req, res) => {
    const department = req.query.department;

    const result = registrations.filter(r =>
        r.department.toLowerCase() === (department || '').toLowerCase()
    );

    res.status(200).json(result);
});

// GET PENDING
app.get('/api/registrations/pending', (req, res) => {
    const result = registrations.filter(r => r.paymentStatus === 'Pending');
    res.status(200).json(result);
});

// GET BY ID
app.get('/api/registrations/:id', (req, res) => {
    const record = registrations.find(r => r.id === Number(req.params.id));

    if (!record) {
        return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json(record);
});

// PUT
app.put('/api/registrations/:id', (req, res) => {
    const record = registrations.find(r => r.id === Number(req.params.id));

    if (!record) {
        return res.status(404).json({ message: "Registration not found" });
    }

    const { participantName, eventName, department, ticketCount, paymentStatus } = req.body;

    if (!participantName || !eventName || !department ||
        !Number.isInteger(ticketCount) || ticketCount <= 0 ||
        !['Paid', 'Pending'].includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid input" });
    }

    record.participantName = participantName;
    record.eventName = eventName;
    record.department = department;
    record.ticketCount = ticketCount;
    record.paymentStatus = paymentStatus;

    res.status(200).json(record);
});

// DELETE
app.delete('/api/registrations/:id', (req, res) => {
    const index = registrations.findIndex(r => r.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Registration not found" });
    }

    registrations.splice(index, 1);
    res.status(200).json({ message: "Registration deleted successfully" });
});

// SERVER
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
