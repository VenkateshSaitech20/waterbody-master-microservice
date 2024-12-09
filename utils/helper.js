const formatErrors = (error) => {
    const errors = {};
    let errorDetails = error.details;
    errorDetails.forEach(({ path, message }) => {
        const field = path.join('.');
        errors[field] = message;
    });
    return errors;
};

const generateSlug = (text) => {
    if (!text) return '';
    return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

module.exports = { formatErrors, generateSlug }