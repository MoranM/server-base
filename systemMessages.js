let hebw_lang = {
    "missingMandatoryFields": "שדות חובה חסרים",
    "emailExist": "אימייל נמצא בשימוש",
    "invalidEmail": "אימייל לא חוקי",
    "invalidPassword": "על הסיסמא להיות באורך של 5 תווים לפחות"
}

let def_lang = {
    "missingMandatoryFields": "Mandatory fields are missing",
    "emailExist": "This email already exist",
    "invalidEmail": "Invalid email",
    "invalidPassword": "Password should contains at least 5 characters"
}

module.exports = (req) =>{
    let lang = req.cookies['lang'];
    if(!lang || lang === 'heb'){
        return hebw_lang;
    }

    return def_lang;
}