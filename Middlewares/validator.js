const validateMiddleware = (schema) => (req, res, next) => {
    const body = req.body;

    try {
        schema.validateSync(body, { abortEarly: false });
        console.log("Received Request", body);
        next();
    } catch (err) {
        res.status(400).send({ message: err.message, status: false });
    }
}

module.exports = {validateMiddleware}