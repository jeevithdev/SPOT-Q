const bcrypt = require('bcryptjs');

exports.hashPassword = async (plain) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(plain, salt);
};

exports.comparePassword = async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};
