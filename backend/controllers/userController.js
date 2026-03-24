import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Organization from '../models/Organization.js';

// 🔴 SUPER ADMIN: Create Organization + Admin (The Boss)
export const createAgency = async (req, res) => {
  try {
    const { orgName, subdomain, primaryColor, adminEmail, adminPassword } = req.body;

    // 1. Create Organization
    const org = await Organization.create({
      name: orgName,
      subdomain,
      settings: { primaryColor }
    });

    // 2. Hash Password & Create Admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      organizationId: org._id
    });

    res.status(201).json({ message: 'Agency and Admin created successfully', org, adminEmail });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔵 ADMIN (The Boss): Create Coder (Employee)
export const createCoder = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hash Password & Create Coder linked to Boss's Org
    const hashedPassword = await bcrypt.hash(password, 10);
    const coder = await User.create({
      email,
      password: hashedPassword,
      role: 'coder',
      organizationId: req.user.orgId // Inherited from the logged-in Admin's JWT token
    });

    res.status(201).json({ message: 'Coder created successfully', email: coder.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoders = async (req, res) => {
  try {
    const coders = await User.find({ 
      organizationId: req.user.orgId, 
      role: 'coder' 
    }).select('-password'); // Never send passwords to the frontend
    
    res.json(coders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coders" });
  }
};