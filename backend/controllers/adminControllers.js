const Admin = require('../models/Admin');
const User = require('../models/User');
const Cart = require('../models/Cart'); 
const Transaction = require('../models/Transaction');
const TransactionToken = require('../models/Token');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authString = Buffer.from(process.env.MIDTRANS_SERVER_KEY+':').toString('base64');

const generateAccessToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SEC, {
        expiresIn: '1d'
    });
};

const sendAuthToken = (admin, statusCode, res) => {
    const authTokenAdmin = generateAccessToken(admin._id, admin.role);
    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.cookie('jwt', authTokenAdmin, cookieOptions);
    admin.password_admin = undefined;
    res.status(statusCode).json({
        success: true,
        authTokenAdmin,
        data: admin
    });
};

const registerAdmin = async (req, res) => {
    try {
        const { name_admin, username_admin, email_admin, password_admin, dob_admin, phone_admin, role } = req.body;
        const createAdmin = await Admin.create({
            name_admin,
            username_admin,
            email_admin,
            password_admin,
            dob_admin,
            phone_admin,
            role
        });
        sendAuthToken(createAdmin, 201, res);
    } catch (error) {
        return res.status(400).json({
            message: "Error",
            error
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { username_admin, password_admin } = req.body;
        if (!username_admin || !password_admin) {
            return res.status(400).json({
                message: "Username dan password tidak boleh kosong"
            });
        }
        const adminData = await Admin.findOne({ username_admin });
        if (!adminData) {
            return res.status(400).json({
                message: "Username belum terdaftar"
            });
        }
        const passValid = await bcrypt.compare(password_admin, adminData.password_admin);
        if (adminData && passValid) {
            sendAuthToken(adminData, 200, res);
        } else {
            return res.status(400).json({
                message: "Password salah"
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error",
            error: error.message
        });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;
        const updatedData = req.body;
        await Admin.findByIdAndUpdate(adminId, updatedData);
        res.status(200).json({ success: true, message: 'Profil berhasil diperbarui' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memperbarui profil admin' });
    }
};

const logoutAdmin = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ success: true, message: 'Logout berhasil' });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ success: false, message: 'Error getting users', error: error.message });
    }
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting user', error: error.message });
    }
};

const editUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        let admins;
        if (req.user.role === 'superadmin') {
            admins = await Admin.find().select('+password_admin');
        } else {
            admins = await Admin.find().select('-password_admin');
        }
        res.status(200).json({ success: true, data: admins });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting admins', error: error.message });
    }
};

const getAdminById = async (req, res) => {
    try {
        let admin;
        if (req.user.role === 'superadmin') {
            admin = await Admin.findById(req.params.id).select('+password_admin');
        } else {
            admin = await Admin.findById(req.params.id).select('-password_admin');
        }
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting admin', error: error.message });
    }
};

const editAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Only superadmin can edit admin' });
        }        
        const adminId = req.params.id;
        const updates = req.body;

        if (updates.password_admin) {
            const salt = await bcrypt.genSalt(10);
            updates.password_admin = await bcrypt.hash(updates.password_admin, salt);
        } else {
            delete updates.password_admin;
        }
        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updates, { new: true, runValidators: true });
        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.status(200).json({ success: true, data: updatedAdmin });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating admin', error: error.message });
    }
};


const deleteAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Only superadmin can delete admin' });
        }
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.status(200).json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting admin', error: error.message });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
        .sort({ transaction_date: -1 });
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching transactions', error: error.message });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching transaction', error: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedTransaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        res.status(200).json({ success: true, data: updatedTransaction });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating transaction', error: error.message });
    }
};


const getAllTransactionTokens = async (req, res) => {
    try {
        const tokens = await TransactionToken.find();
        res.status(200).json({ success: true, data: tokens });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching transaction tokens', error: error.message });
    }
};

const getAllDetailTransaction = async (req, res) => {
    const { transaction_code } = req.params;
    try {
        const transaction = await Transaction.findOne({ transaction_code });
        if (!transaction) {
            return res.status(403).json({ message: 'Transaction not found or does not belong to the user' });
        }
        const cartItems = await Cart.find({ transaction_code }).populate('id_product');
        if (!cartItems.length) {
            return res.status(404).json({ message: 'No cart items found for this transaction.' });
        }
        const formattedItems = cartItems.map(item => ({
            _id: item._id,
            product_name: item.id_product.name_product,
            quantity: item.quantity,
            price: item.id_product.price_product
        }));
        res.status(200).json(formattedItems);
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const checkTransactionTokesStatus = async (req, res) => {
    const { transaction_code } = req.params;
    if (!transaction_code) {
      return res.status(400).send("Transaction code is required");
    }
    try {
      const response = await fetch(`https://api.sandbox.midtrans.com/v2/${transaction_code}/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authString}`
        }
      });
  
      const statusData = await response.json();
      if (response.ok) {
        res.status(200).send(statusData);
      } else {
        res.status(response.status).send(statusData);
      }
    } catch (error) {
      console.log(error)
      console.error("Error checking transaction status:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  const deleteTransactionToken = async (req, res) => {
    const { transaction_code } = req.params;

    if (!transaction_code) {
        return res.status(400).json({ success: false, message: 'Transaction code is required' });
    }

    try {
        const result = await TransactionToken.deleteOne({ transaction_code });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Token not found' });
        }
        res.status(200).json({ success: true, message: 'Token deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting token', error: error.message });
    }
   };



module.exports = { 
    registerAdmin, 
    loginAdmin, 
    logoutAdmin, 
    updateAdminProfile, 
    getAllUsers, 
    getUserById, 
    editUser, 
    deleteUser , 
    getAllAdmins, 
    getAdminById, 
    editAdmin, 
    deleteAdmin,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    getAllTransactionTokens,
    checkTransactionTokesStatus,
    deleteTransactionToken,
    getAllDetailTransaction
};