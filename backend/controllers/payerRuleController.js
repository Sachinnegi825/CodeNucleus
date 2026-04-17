import PayerRule from '../models/PayerRule.js';

export const createRule = async (req, res) => {
  try {
    const rule = await PayerRule.create({
      ...req.body,
      organizationId: req.user.orgId,
      createdBy: req.user.userId
    });
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: "Failed to create rule" });
  }
};

export const getRules = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { organizationId: req.user.orgId };
    const totalRules = await PayerRule.countDocuments(query);

    const rules = await PayerRule.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      rules,
      currentPage: page,
      totalPages: Math.ceil(totalRules / limit),
      totalRules
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rules" });
  }
};

export const deleteRule = async (req, res) => {
  try {
    await PayerRule.findOneAndDelete({ _id: req.params.id, organizationId: req.user.orgId });
    res.json({ message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};