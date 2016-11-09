
module.exports = {
    getById: getUserById,
    register: registerNewUser
};

function getUserById(req, res) {
    res.sendStatus(200);
}

function registerNewUser(req, res){
    res.sendStatus(201);
}