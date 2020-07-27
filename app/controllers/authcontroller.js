
var exports = module.exports = {}

// I should be able to create a views object.
// In the Main Layout I should be able to export the HTML
 
exports.signup = function(req, res) {
 
    res.render('signup');
 
}

exports.signin = function(req, res) {
 
    res.render('signin');
 
}