import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('organizationId');
    
    // DEBUG: Log if user not found (Helpful for your 401 error)
    if (!user) {
      console.log(`Login Failed: User ${email} not found in DB`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login Failed: Password mismatch for ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Create JWT Payload (Handle case where orgId is null for Super Admins)
    const payload = { 
      userId: user._id, 
      role: user.role, 
      orgId: user.organizationId ? user.organizationId._id : null 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // 4. Set HTTP-Only Cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 3600000 
    });

    // 5. Send Response (Safe handling for Super Admin who has no organizationId)
    res.json({
      message: 'Logged in successfully',
      user: {
        email: user.email,
        role: user.role,
        organization: user.organizationId ? {
          name: user.organizationId.name,
          primaryColor: user.organizationId.settings?.primaryColor,
          logoUrl: user.organizationId.logoUrl
        } : { name: "System Control", primaryColor: "#ef4444" , logoUrl: "" } // Red for SuperAdmin
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};