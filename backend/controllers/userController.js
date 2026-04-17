import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import AuditLog from '../models/AuditLog.js';

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { organizationId: req.user.orgId, role: 'coder' };
    const totalCoders = await User.countDocuments(query);

    const coders = await User.find(query)
      .select('-password') // Security: Never send passwords
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      coders,
      currentPage: page,
      totalPages: Math.ceil(totalCoders / limit),
      totalCoders
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coders" });
  }
};

export const updateCoderPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Ensure the admin can only update users within their own organization
    const user = await User.findOne({ _id: id, organizationId: req.user.orgId });

    if (!user) {
      return res.status(404).json({ message: "User not found in your organization" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, organizationId: req.user.orgId });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Flip the status
    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    res.json({ message: `User is now ${user.status}`, status: user.status });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user status" });
  }
};


export const getAuditLogs = async (req, res) => {
  try {
    // 1. Get page and limit from query params (defaults: page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 2. Build the query for the specific organization
    const query = { organizationId: req.user.orgId };

    // 3. Get total count for pagination math
    const totalLogs = await AuditLog.countDocuments(query);

    // 4. Fetch the paginated logs
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .populate('userId', 'email role')
      .skip(skip)
      .limit(limit);

    // 5. Return data + metadata
    res.json({
      logs,
      currentPage: page,
      totalPages: Math.ceil(totalLogs / limit),
      totalLogs
    });
  } catch (error) {
    console.error("Audit Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
};