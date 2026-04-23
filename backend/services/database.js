const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qmmtsgyslngbnbvmrvgv.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseKey) {
    console.warn('Warning: No Supabase key provided. Database operations will fail.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SQL to create tables (run this in Supabase SQL Editor)
/*
-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Provisioning',
    ip TEXT,
    engine VARCHAR(100),
    credentials JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity feed table
CREATE TABLE IF NOT EXISTS activity (
    id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_name VARCHAR(255),
    time VARCHAR(100),
    type VARCHAR(100),
    status VARCHAR(50),
    icon VARCHAR(50),
    color_class VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stats table (single row for global stats)
CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_resources INTEGER DEFAULT 0,
    total_resources_delta VARCHAR(100) DEFAULT '+0 Since yesterday',
    monthly_cost VARCHAR(50) DEFAULT '$0.00',
    monthly_cost_delta VARCHAR(100) DEFAULT '0% projected',
    system_health VARCHAR(20) DEFAULT '100%'
);

-- Initialize stats row
INSERT INTO stats (id, total_resources, monthly_cost) 
VALUES (1, 0, '$0.00') 
ON CONFLICT (id) DO NOTHING;

-- Service catalog table
CREATE TABLE IF NOT EXISTS service_catalog (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    provider_logo TEXT,
    tags JSONB,
    color VARCHAR(20)
);

-- Seed service catalog
INSERT INTO service_catalog (id, title, description, icon, provider_logo, tags, color) VALUES
('rds-pg', 'RDS (PostgreSQL)', 'High-performance managed relational database with automated backups and scaling.', 'database', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSsg4icExh1ZBTivDiXTv94hT3j3tzazT5FBfneEF5jHXicVJqrPUUKH4VBgZRBVJojV8E3403KPiDGNZ-iIXKD2cHk3ePpq5Bh3czlNYdwsUpVgw7JET-6z2oNxV-cNLCo_FldYUFhc35LcmVe9kgevi1ZhP9e2sKhuAhlvgKTYjURD7hlVT_SppPk59jUQcAVXHtcaqtxDWQMH0PO8nYZN8OdWQypnnyQvZgiYSd7VXa60U3pNn6zitQ2Hiakk0iHU03IQChPlNY', '["Managed", "PostgreSQL 15"]', 'primary'),
('ec2', 'EC2 Instance', 'On-demand virtual computing power. Secure, resizable capacity for any workload.', 'dns', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSsg4icExh1ZBTivDiXTv94hT3j3tzazT5FBfneEF5jHXicVJqrPUUKH4VBgZRBVJojV8E3403KPiDGNZ-iIXKD2cHk3ePpq5Bh3czlNYdwsUpVgw7JET-6z2oNxV-cNLCo_FldYUFhc35LcmVe9kgevi1ZhP9e2sKhuAhlvgKTYjURD7hlVT_SppPk59jUQcAVXHtcaqtxDWQMH0PO8nYZN8OdWQypnnyQvZgiYSd7VXa60U3pNn6zitQ2Hiakk0iHU03IQChPlNY', '["Compute", "T3.Large"]', 'primary'),
('s3', 'S3 Bucket', 'Object storage built to retrieve any amount of data from anywhere.', 'folder_zip', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSsg4icExh1ZBTivDiXTv94hT3j3tzazT5FBfneEF5jHXicVJqrPUUKH4VBgZRBVJojV8E3403KPiDGNZ-iIXKD2cHk3ePpq5Bh3czlNYdwsUpVgw7JET-6z2oNxV-cNLCo_FldYUFhc35LcmVe9kgevi1ZhP9e2sKhuAhlvgKTYjURD7hlVT_SppPk59jUQcAVXHtcaqtxDWQMH0PO8nYZN8OdWQypnnyQvZgiYSd7VXa60U3pNn6zitQ2Hiakk0iHU03IQChPlNY', '["Storage", "IA Support"]', 'primary'),
('redis', 'Redis Cache', 'Fully managed, in-memory data store for accelerating application performance.', 'bolt', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG_OkeW_nrGrxpfayadCMoYP1U7sjsRogDTTGnUzB9F8haKzocKnsZO3zXU_o_Sdac9k60GuFMOYxg82De2zwHp3RIuZz99Upf8xiB9K7TZMD2GWqoXS7KqIBOc4APbCUaFWmyH5o7lzin6G_KT4uJvzujy219vWTKLm02m8DL45e11ZAUJCx-QXl9Iyedf0qNhO4lUJhdrKxXd_FAZkGJ9OHK5ZepbL-KTGYEYVBQsvPtG3hCGrhdzk8dzNgbBGxLkA3GPygGwXXQ', '["Cache", "Azure Native"]', 'tertiary'),
('lambda', 'Lambda Function', 'Run code without thinking about servers. Pay only for the compute time you consume.', 'functions', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSsg4icExh1ZBTivDiXTv94hT3j3tzazT5FBfneEF5jHXicVJqrPUUKH4VBgZRBVJojV8E3403KPiDGNZ-iIXKD2cHk3ePpq5Bh3czlNYdwsUpVgw7JET-6z2oNxV-cNLCo_FldYUFhc35LcmVe9kgevi1ZhP9e2sKhuAhlvgKTYjURD7hlVT_SppPk59jUQcAVXHtcaqtxDWQMH0PO8nYZN8OdWQypnnyQvZgiYSd7VXa60U3pNn6zitQ2Hiakk0iHU03IQChPlNY', '["Serverless", "Python/Node"]', 'primary')
ON CONFLICT (id) DO NOTHING;
*/

// Database operations
const db = {
  // Resources
  async getResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
    return data || [];
  },

  async getResource(id) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching resource:', error);
      return null;
    }
    return data;
  },

  async createResource(resource) {
    const { data, error } = await supabase
      .from('resources')
      .insert([resource])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating resource:', error);
      return null;
    }
    return data;
  },

  async updateResource(id, updates) {
    const { data, error } = await supabase
      .from('resources')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating resource:', error);
      return null;
    }
    return data;
  },

  async deleteResource(id) {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting resource:', error);
      return false;
    }
    return true;
  },

  // Activity
  async getActivity() {
    const { data, error } = await supabase
      .from('activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching activity:', error);
      return [];
    }
    return data || [];
  },

  async createActivity(activity) {
    const { data, error } = await supabase
      .from('activity')
      .insert([activity])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating activity:', error);
      return null;
    }
    return data;
  },

  // Stats
  async getStats() {
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.error('Error fetching stats:', error);
      return {
        totalResources: 0,
        totalResourcesDelta: '+0 Since yesterday',
        monthlyCost: '$0.00',
        monthlyCostDelta: '0% projected',
        systemHealth: '100%'
      };
    }
    
    return {
      totalResources: data.total_resources,
      totalResourcesDelta: data.total_resources_delta,
      monthlyCost: data.monthly_cost,
      monthlyCostDelta: data.monthly_cost_delta,
      systemHealth: data.system_health
    };
  },

  async incrementResourceCount() {
    const { data: current } = await supabase
      .from('stats')
      .select('total_resources')
      .eq('id', 1)
      .single();
    
    const newCount = (current?.total_resources || 0) + 1;
    
    await supabase
      .from('stats')
      .update({ 
        total_resources: newCount,
        total_resources_delta: `+1 Since yesterday`
      })
      .eq('id', 1);
  },

  async decrementResourceCount() {
    const { data: current } = await supabase
      .from('stats')
      .select('total_resources')
      .eq('id', 1)
      .single();
    
    const newCount = Math.max(0, (current?.total_resources || 0) - 1);
    
    await supabase
      .from('stats')
      .update({ total_resources: newCount })
      .eq('id', 1);
  },

  // Service Catalog
  async getServiceCatalog() {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*');
    
    if (error) {
      console.error('Error fetching service catalog:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      providerLogo: item.provider_logo,
      tags: item.tags,
      color: item.color
    }));
  }
};

module.exports = { db, supabase };