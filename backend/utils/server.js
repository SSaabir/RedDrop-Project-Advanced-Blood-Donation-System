import feedbackRoutes from "./routes/feedback.routes.js";
app.use('/api/feedback', feedbackRoutes);

import inquiryRoutes from "./routes/inquiry.routes.js";
app.use('/api/inquiry', inquiryRoutes);