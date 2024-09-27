var mongoose = require('mongoose')
var validator = require('validator')
var bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name_user: {
        type: String
    },
    username_user: {
        type: String,
        required: [true, "username tidak boleh kosong!"],
        unique: [true, "username sudah digunakan!"]
    },
    email_user: {
        type: String,
        required: [true, "email tidak boleh kosong!"],
        unique: [true, "email sudah digunakan!"],
        validator: {
            validator: validator.isEmail,
            message: "silahkan input email yang valid!"
        }
    },
    password_user: {
        type: String,
        required: [true, "password tidak boleh kosong!"],
        minLength: [6, "Password minimal harus 6 karakter"]
    },
    dob_user: {
        type: String,
        required: [true, "tanggal lahir tidak boleh kosong!"]
    },
    phone_user: {
        type: String,
        required: [true, "Nomor telepon tidak boleh kosong!"]
    },
    gender_user: {
        type: String
    },
    address_user: {
        type: String
    },
    lat_user: { 
        type: Number
    },
    lng_user: { 
        type: Number
    }
})

userSchema.pre('save', async function(next) {
    if (this.isModified('password_user') || this.isNew) {
        try {
            this.password_user = await bcrypt.hash(this.password_user, 10);
        } catch (error) {
            console.error('Error hashing password:', error);
            return next(error);
        }
    }
    next();
});

const user = mongoose.model("User", userSchema)

module.exports = user;