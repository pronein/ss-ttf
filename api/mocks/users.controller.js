
module.exports = {
    getById: getUserById,
    register: registerNewUser
};

function getUserById(req, res) {
    if(req.swagger.params.id.value == 200) {
        res.status(200).json({firstName: 'Adam', lastName: 'Schrader', username: 'pronein', email: 'adam.dot.schrader@gmail.com'});
    } else if(req.swagger.params.id.value == 204){
        res.sendStatus(204);
    } else {
        res.status(500).json({message: 'An error occurred for id: ' + req.swagger.params.id.value});
    }
}

function registerNewUser(req, res) {
    var userToRegister = req.swagger.params.user.value;

    if(userToRegister.firstName == 500) {
        res.status(500).json({message: 'An error occurred while trying to register the new user.'});
    } else {
        res.status(201).json({id:'123abc345dcd'});
    }
}