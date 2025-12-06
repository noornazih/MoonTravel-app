// Sanitize input to prevent SQL injection and enforce lowercase
const sanitizeInput = (value) => {
    if (typeof value === 'string') {
        return value.trim().replace(/'/g, "''").toLowerCase();
    }
    return value;
};

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate strong password (min 8 chars, upper, lower, number, special char)
const isStrongPassword = (password) => {
    if (!password || password.length < 8) {
        return false;
    }
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    return passwordRegex.test(password);
};

// Validate required fields
const validateRequired = (fields, requiredKeys) => {
    for (const key of requiredKeys) {
        if (!fields[key] || !String(fields[key]).trim()) {
            return `${key} is required`;
        }
    }
    return null;
};

// Validate password strength
const validatePassword = (password) => {
    if (!password) {
        return "Password is required";
    }
    if (!isStrongPassword(password)) {
        return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
    }
    return null;
};

// Signup validation (Traveler, Hotel Manager, Admin)
const validateSignup = (req, res, next) => {
    let { username, email, password, role, hotelName, location } = req.body;

    username = sanitizeInput(username);
    email = sanitizeInput(email);
    password = sanitizeInput(password);

    const requiredError = validateRequired(req.body, ['username', 'email', 'password', 'role']);
    if (requiredError) {
        return res.status(400).json({ error: requiredError, status: 400 });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format", status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError, status: 400 });
    }

    // Hotel Manager requires hotelName and location
    if (role === 'hotel_manager' && (!hotelName || !location)) {
        return res.status(400).json({ error: "Hotel name and location required", status: 400 });
    }

    req.body = { username, email, password, role, hotelName, location };
    next();
};

// Login validation (all roles)
const validateLogin = (req, res, next) => {
    let { email, password } = req.body;

    email = sanitizeInput(email);
    password = sanitizeInput(password);

    const requiredError = validateRequired(req.body, ['email', 'password']);
    if (requiredError) {
        return res.status(400).json({ error: requiredError, status: 400 });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format", status: 400 });
    }

    req.body.email = email;
    next();
};

// User update validation (Admin only)
const validateUserUpdate = (req, res, next) => {
    const updates = {};

    if (req.body.name) updates.name = sanitizeInput(req.body.name);
    if (req.body.email) {
        updates.email = sanitizeInput(req.body.email);
        if (!isValidEmail(updates.email)) {
            return res.status(400).json({ error: "Invalid email format", status: 400 });
        }
    }
    if (req.body.password) {
        const passwordError = validatePassword(req.body.password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError, status: 400 });
        }
    }
    if (req.body.role && !['traveler', 'hotel_manager', 'admin'].includes(req.body.role)) {
        return res.status(400).json({ error: "Invalid role specified", status: 400 });
    }

    req.body = { ...req.body, ...updates };
    next();
};

module.exports = {
    validateSignup,
    validateLogin,
    validateUserUpdate
};