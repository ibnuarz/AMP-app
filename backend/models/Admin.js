const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name_admin: {
        type: String
    },
    username_admin: {
        type: String,
        required: [true, "username tidak boleh kosong!"],
        unique: [true, "username sudah digunakan!"]
    },
    email_admin: {
        type: String,
        required: [true, "email tidak boleh kosong!"],
        unique: [true, "email sudah digunakan!"],
        validate: {
            validator: validator.isEmail,
            message: "silahkan input email yang valid!"
        }
    },
    password_admin: {
        type: String,
        required: [true, "password tidak boleh kosong!"],
        minLength: [6, "Password minimal harus 6 karakter"]
    },
    dob_admin: {
        type: String,
        required: [true, "tanggal lahir tidak boleh kosong!"]
    },
    phone_admin: {
        type: String,
        required: [true, "Nomor telepon tidak boleh kosong!"]
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    }
});

adminSchema.pre('save', async function(next) {
    if (this.isModified('password_admin') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password_admin = await bcrypt.hash(this.password_admin, salt);
    }
    next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
