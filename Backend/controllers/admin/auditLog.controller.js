const AuditLog = require('../../models/AuditLog');
const asyncHandler = require('../../middlewares/asyncHandler');

exports.getAuditLogs = asyncHandler(async (req, res) => {
  const { timeframe, module, user, page = 1, limit = 20 } = req.query;

  const query = {};

  if (module) {
    query.module = module;
  }
  if (user) {
    query.actor_id = user;
  }
  
  if (timeframe) {
    const now = new Date();
    let startDate = new Date();
    if (timeframe === 'Last 24 Hours') {
      startDate.setDate(now.getDate() - 1);
    } else if (timeframe === 'Last 7 Days') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'Last 30 Days') {
      startDate.setDate(now.getDate() - 30);
    }
    query.created_at = { $gte: startDate };
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [auditLogs, total] = await Promise.all([
    AuditLog.find(query).sort({ created_at: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
    AuditLog.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      auditLogs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

exports.getPulse = asyncHandler(async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const changeStream = AuditLog.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      res.write(`data: ${JSON.stringify(change.fullDocument)}\n\n`);
    }
  });

  req.on('close', () => {
    changeStream.close();
  });
});

exports.getVolumeTrend = asyncHandler(async (req, res) => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const trend = await AuditLog.aggregate([
    {
      $match: {
        created_at: { $gte: yesterday },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
          day: { $dayOfMonth: '$created_at' },
          hour: { $hour: '$created_at' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
        '_id.hour': 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: { trend },
  });
});

exports.exportLogs = asyncHandler(async (req, res) => {
  const { timeframe, module, user } = req.query;

  const query = {};

  if (module) {
    query.module = module;
  }
  if (user) {
    query.actor_id = user;
  }
  
  if (timeframe) {
    const now = new Date();
    let startDate = new Date();
    if (timeframe === 'Last 24 Hours') {
      startDate.setDate(now.getDate() - 1);
    } else if (timeframe === 'Last 7 Days') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'Last 30 Days') {
      startDate.setDate(now.getDate() - 30);
    }
    query.created_at = { $gte: startDate };
  }

  const logs = await AuditLog.find(query).sort({ created_at: -1 }).lean();

  const fields = ['created_at', 'actor_name', 'module', 'action', 'target_entity_name', 'status', 'ip_address'];
  
  try {
    let csv = fields.join(',') + '\\n';
    logs.forEach(log => {
      const row = fields.map(field => {
        let value = log[field] || '';
        if (value instanceof Date) {
          value = value.toISOString();
        }
        value = String(value).replace(/"/g, '""');
        if (value.search(/("|,|\\n)/g) >= 0) {
          value = `"${value}"`;
        }
        return value;
      });
      csv += row.join(',') + '\\n';
    });
    
    res.header('Content-Type', 'text/csv');
    res.attachment('audit_logs.csv');
    return res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not generate CSV' });
  }
});
