const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  dbInstance = await open({
    filename: path.join(__dirname, '..', 'data', 'cloudforge.db'),
    driver: sqlite3.Database
  });
  return dbInstance;
}

async function initializeDatabase() {
  const db = await getDb();
  
  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Provisioning',
      ip TEXT,
      engine TEXT,
      credentials TEXT,
      environment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activity (
      id TEXT PRIMARY KEY,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      resource_name TEXT,
      time TEXT,
      type TEXT,
      status TEXT,
      icon TEXT,
      color_class TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY DEFAULT 1,
      total_resources INTEGER DEFAULT 0,
      total_resources_delta TEXT DEFAULT '+0 Since yesterday',
      monthly_cost TEXT DEFAULT '$0.00',
      monthly_cost_delta TEXT DEFAULT '0% projected',
      system_health TEXT DEFAULT '100%'
    );

    CREATE TABLE IF NOT EXISTS service_catalog (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      provider_logo TEXT,
      tags TEXT,
      color TEXT
    );
  `);

  // Initialize stats row
  await db.run(`INSERT OR IGNORE INTO stats (id, total_resources, monthly_cost) VALUES (1, 0, '$0.00')`);

  // Seed service catalog
  const catalogCount = await db.get('SELECT COUNT(*) as cnt FROM service_catalog');
  if (catalogCount.cnt === 0) {
    const awsLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/512px-Amazon_Web_Services_Logo.svg.png';
    const azureLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/150px-Microsoft_Azure.svg.png';
    
    const items = [
      ['rds-pg', 'Aurora PostgreSQL', 'High-performance managed relational database with automated backups, point-in-time recovery, and multi-AZ failover.', 'database', awsLogo, '["Managed","PostgreSQL 15","Multi-AZ"]', 'primary'],
      ['ec2', 'EC2 Instance', 'Secure, resizable virtual computing capacity. Launch instances in minutes with your choice of OS and instance type.', 'dns', awsLogo, '["Compute","Auto-Scale","EBS"]', 'primary'],
      ['s3', 'S3 Bucket', 'Object storage built to retrieve any amount of data from anywhere with 99.999999999% durability.', 'folder_zip', awsLogo, '["Storage","IA Support","Versioned"]', 'primary'],
      ['redis', 'ElastiCache Redis', 'Fully managed in-memory data store for sub-millisecond response times and real-time caching at scale.', 'bolt', awsLogo, '["Cache","Cluster Mode","6.x"]', 'tertiary'],
      ['lambda', 'Lambda Function', 'Run code without thinking about servers. Pay only for the compute time you consume. Scales automatically.', 'functions', awsLogo, '["Serverless","Python/Node","API Gateway"]', 'primary'],
    ];

    const stmt = await db.prepare('INSERT OR IGNORE INTO service_catalog (id, title, description, icon, provider_logo, tags, color) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const item of items) {
      await stmt.run(...item);
    }
    await stmt.finalize();
    console.log('✅ Service catalog seeded with', items.length, 'items');
  }

  // Seed initial activity if empty
  const actCount = await db.get('SELECT COUNT(*) as cnt FROM activity');
  if (actCount.cnt === 0) {
    const activities = [
      ['act-1', 'System', 'initialized', 'CloudForge Platform', 'Just now', 'system', 'Active', 'cloud_done', 'tertiary'],
      ['act-2', 'admin', 'configured', 'IAM Role Binding', '2 min ago', 'security', 'Completed', 'security', 'primary'],
      ['act-3', 'System', 'health check passed for', 'us-east-1 region', '5 min ago', 'infra', 'Healthy', 'check_circle', 'tertiary'],
    ];
    const stmt = await db.prepare('INSERT OR IGNORE INTO activity (id, user_name, action, resource_name, time, type, status, icon, color_class) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const a of activities) { await stmt.run(...a); }
    await stmt.finalize();
  }

  console.log('✅ Database initialized successfully');
  return db;
}

// Database operations
const dbOps = {
  async getResources() {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM resources ORDER BY created_at DESC');
    return rows.map(r => ({
      ...r,
      credentials: r.credentials ? JSON.parse(r.credentials) : null
    }));
  },

  async getResource(id) {
    const db = await getDb();
    const row = await db.get('SELECT * FROM resources WHERE id = ?', id);
    if (row && row.credentials) row.credentials = JSON.parse(row.credentials);
    return row || null;
  },

  async createResource(resource) {
    const db = await getDb();
    const creds = resource.credentials ? JSON.stringify(resource.credentials) : null;
    await db.run(
      'INSERT INTO resources (id, name, type, status, ip, engine, credentials, environment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      resource.id, resource.name, resource.type, resource.status || 'Provisioning',
      resource.ip || null, resource.engine || null, creds, resource.environment || null
    );
    // Update stats
    await this.recalculateStats();
    return resource;
  },

  async updateResource(id, updates) {
    const db = await getDb();
    const sets = [];
    const vals = [];
    if (updates.status !== undefined) { sets.push('status = ?'); vals.push(updates.status); }
    if (updates.ip !== undefined) { sets.push('ip = ?'); vals.push(updates.ip); }
    if (updates.credentials !== undefined) { sets.push('credentials = ?'); vals.push(JSON.stringify(updates.credentials)); }
    sets.push("updated_at = datetime('now')");
    vals.push(id);
    await db.run(`UPDATE resources SET ${sets.join(', ')} WHERE id = ?`, ...vals);
  },

  async deleteResource(id) {
    const db = await getDb();
    await db.run('DELETE FROM resources WHERE id = ?', id);
    await this.recalculateStats();
  },

  async recalculateStats() {
    const db = await getDb();
    const count = await db.get('SELECT COUNT(*) as cnt FROM resources WHERE status = ?', 'Active');
    const total = count?.cnt || 0;
    // Simple cost estimation
    const cost = total * 45;
    const costStr = `$${cost.toFixed(2)}`;
    await db.run(
      'UPDATE stats SET total_resources = ?, monthly_cost = ?, total_resources_delta = ? WHERE id = 1',
      total, costStr, `+${total} deployed`
    );
  },

  async getStats() {
    const db = await getDb();
    const row = await db.get('SELECT * FROM stats WHERE id = 1');
    return row || { total_resources: 0, total_resources_delta: '+0', monthly_cost: '$0.00', monthly_cost_delta: '0%', system_health: '100%' };
  },

  async getActivity() {
    const db = await getDb();
    return db.all('SELECT * FROM activity ORDER BY created_at DESC LIMIT 20');
  },

  async addActivity(activity) {
    const db = await getDb();
    await db.run(
      'INSERT INTO activity (id, user_name, action, resource_name, time, type, status, icon, color_class) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      activity.id, activity.user, activity.action, activity.resourceName,
      activity.time, activity.type, activity.status || null, activity.icon, activity.colorClass
    );
  },

  async getDashboard() {
    const stats = await this.getStats();
    const activity = await this.getActivity();
    return {
      stats: {
        totalResources: stats.total_resources,
        totalResourcesDelta: stats.total_resources_delta,
        monthlyCost: stats.monthly_cost,
        monthlyCostDelta: stats.monthly_cost_delta,
        systemHealth: stats.system_health,
      },
      activity: activity.map(a => ({
        id: a.id,
        user: a.user_name,
        action: a.action,
        resourceName: a.resource_name,
        time: a.time,
        type: a.type,
        status: a.status,
        icon: a.icon,
        colorClass: a.color_class,
      })),
    };
  },

  async getServiceCatalog() {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM service_catalog');
    return rows.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      providerLogo: item.provider_logo,
      tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : (item.tags || []),
      color: item.color
    }));
  }
};

module.exports = { db: dbOps, initializeDatabase };