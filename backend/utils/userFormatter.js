exports.cleanUser = (user) => {
    const obj = user.toObject();
    delete obj.password;
    return obj;
};
