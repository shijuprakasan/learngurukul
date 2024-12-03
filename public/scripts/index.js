function contactusapi(file, rank) {
    var _name = document.getElementById('name').value;
    var _email = document.getElementById('email').value;
    var _phone = document.getElementById('phone').value;
    var _description = document.getElementById('description').value;
    var cudata = {
        name: _name,
        email: _email,
        phone: _phone,
        description: _description,
    };
    $.post("/api/contactus", cudata, function (data) {
        if (data) {
            alert('submitted successfully');
        } else {
            alert('Couldnot submit, please try again later');
        }
    });
}