const PlayerModel = require('../model/PlayerModel');
const mongoose = require('mongoose');

async function PlayerValidation(req, res, next) {
    console.log('=== PLAYER VALIDATION ===');
    console.log('Name:', req.body.name);
    console.log('Photo present:', !!req.body.photo);
    console.log('Params id:', req.params.id);
    console.log('=========================');

    const { name, photo } = req.body;
    const isUpdate = req.params.id != null;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Provide a valid name (at least 2 characters).' });
    }

    if (!photo || typeof photo !== 'string' || photo.trim().length === 0) {
        return res.status(400).json({ error: 'Provide a photo as a base64 string or data URI.' });
    }

    // Allowed image MIME types
    const allowedMime = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

    // Match data URI: data:<mime>;base64,<data>
    const dataUriMatch = photo.match(/^data:([a-zA-Z0-9+/.-]+\/[\-a-zA-Z0-9+.]+);base64,(.+)$/);
    let base64data = photo;
    let mimeType = null;

    if (dataUriMatch) {
        mimeType = dataUriMatch[1];
        base64data = dataUriMatch[2];
    }

    if (mimeType && !allowedMime.includes(mimeType.toLowerCase())) {
        return res.status(400).json({ error: 'Unsupported image MIME type.' });
    }

    // Remove whitespace/newlines that may have been introduced
    base64data = base64data.replace(/\s+/g, '');

    // Basic base64 validation
    const b64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (!b64Regex.test(base64data)) {
        return res.status(400).json({ error: 'Photo is not valid base64.' });
    }

    // Decode to check size (limit to 2.5 MB)
    let buffer;
    try {
        buffer = Buffer.from(base64data, 'base64');
    } catch (err) {
        return res.status(400).json({ error: 'Photo base64 decoding failed.' });
    }

    const maxBytes = 2.5 * 1024 * 1024; // 2.5 MB
    if (buffer.length > maxBytes) {
        return res.status(400).json({ error: 'Photo is too large. Max 2.5 MB allowed.' });
    }

    // If update, validate id and existence
    if (isUpdate) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ error: 'Invalid id format.' });

        const exists = (await PlayerModel.countDocuments({ _id: req.params.id })) >= 1;
        if (!exists) return res.status(400).json({ error: 'No player found for the provided id.' });
    }

    // Normalize stored photo to data URI form so controllers and storage are consistent
    if (dataUriMatch) {
        req.body.photo = `data:${mimeType};base64,${base64data}`;
    } else {
        // Default MIME when not provided
        const defaultMime = 'image/png';
        req.body.photo = `data:${defaultMime};base64,${base64data}`;
    }

    return next();
}

module.exports = PlayerValidation;