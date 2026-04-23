const mockDb = {
  activeResources: [
    { id: '8f23-da12-9901', name: 'prod-db-master-01', type: 'RDS', status: 'Active', ip: '10.0.42.129' },
    { id: 'c412-ee98-1244', name: 'api-gateway-us-east', type: 'EC2', status: 'Provisioning', ip: '54.21.109.43' },
    { id: 'k901-aa12-0041', name: 'cache-redis-04', type: 'Elasticache', status: 'Active', ip: 'redis.internal.net' },
    { id: 'v223-bb44-9912', name: 'worker-node-primary-a', type: 'EKS Node', status: 'Active', ip: '172.16.5.42' },
  ],
  
  serviceCatalog: [
    {
      id: "rds-pg",
      title: "RDS (PostgreSQL)",
      description: "High-performance managed relational database with automated backups and scaling.",
      icon: "database",
      providerLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSsg4icExh1ZBTivDiXTv94hT3j3tzazT5FBfneEF5jHXicVJqrPUUKH4VBgZRBVJojV8E3403KPiDGNZ-iIXKD2cHk3ePpq5Bh3czlNYdwsUpVgw7JET-6z2oNxV-cNLCo_FldYUFhc35LcmVe9kgevi1ZhP9e2sKhuAhlvgKTYjURD7hlVT_SppPk59jUQcAVXHtcaqtxDWQMH0PO8nYZN8OdWQypnnyQvZgiYSd7VXa60U3pNn6zitQ2Hiakk0iHU03IQChPlNY",
      tags: ["Managed", "PostgreSQL 15"],
      color: "primary"
    },
    {
      id: "ec2",
      title: "EC2 Instance",
      description: "On-demand virtual computing power. Secure, resizable capacity for any workload.",
      icon: "dns",
      providerLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSsg4icExh1ZBTivDiXTv94hT3j3tzazT5FBfneEF5jHXicVJqrPUUKH4VBgZRBVJojV8E3403KPiDGNZ-iIXKD2cHk3ePpq5Bh3czlNYdwsUpVgw7JET-6z2oNxV-cNLCo_FldYUFhc35LcmVe9kgevi1ZhP9e2sKhuAhlvgKTYjURD7hlVT_SppPk59jUQcAVXHtcaqtxDWQMH0PO8nYZN8OdWQypnnyQvZgiYSd7VXa60U3pNn6zitQ2Hiakk0iHU03IQChPlNY",
      tags: ["Compute", "T3.Large"],
      color: "primary"
    },
    {
      id: "s3",
      title: "S3 Bucket",
      description: "Object storage built to retrieve any amount of data from anywhere.",
      icon: "folder_zip",
      providerLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSsg4icExh1ZBTivDiXTv94hT3j3tzazT5FBfneEF5jHXicVJqrPUUKH4VBgZRBVJojV8E3403KPiDGNZ-iIXKD2cHk3ePpq5Bh3czlNYdwsUpVgw7JET-6z2oNxV-cNLCo_FldYUFhc35LcmVe9kgevi1ZhP9e2sKhuAhlvgKTYjURD7hlVT_SppPk59jUQcAVXHtcaqtxDWQMH0PO8nYZN8OdWQypnnyQvZgiYSd7VXa60U3pNn6zitQ2Hiakk0iHU03IQChPlNY",
      tags: ["Storage", "IA Support"],
      color: "primary"
    },
    {
      id: "redis",
      title: "Redis Cache",
      description: "Fully managed, in-memory data store for accelerating application performance.",
      icon: "bolt",
      providerLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG_OkeW_nrGrxpfayadCMoYP1U7sjsRogDTTGnUzB9F8haKzocKnsZO3zXU_o_Sdac9k60GuFMOYxg82De2zwHp3RIuZz99Upf8xiB9K7TZMD2GWqoXS7KqIBOc4APbCUaFWmyH5o7lzin6G_KT4uJvzujy219vWTKLm02m8DL45e11ZAUJCx-QXl9Iyedf0qNhO4lUJhdrKxXd_FAZkGJ9OHK5ZepbL-KTGYEYVBQsvPtG3hCGrhdzk8dzNgbBGxLkA3GPygGwXXQ",
      tags: ["Cache", "Azure Native"],
      color: "tertiary"
    },
    {
      id: "lambda",
      title: "Lambda Function",
      description: "Run code without thinking about servers. Pay only for the compute time you consume.",
      icon: "functions",
      providerLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSsg4icExh1ZBTivDiXTv94hT3j3tzazT5FBfneEF5jHXicVJqrPUUKH4VBgZRBVJojV8E3403KPiDGNZ-iIXKD2cHk3ePpq5Bh3czlNYdwsUpVgw7JET-6z2oNxV-cNLCo_FldYUFhc35LcmVe9kgevi1ZhP9e2sKhuAhlvgKTYjURD7hlVT_SppPk59jUQcAVXHtcaqtxDWQMH0PO8nYZN8OdWQypnnyQvZgiYSd7VXa60U3pNn6zitQ2Hiakk0iHU03IQChPlNY",
      tags: ["Serverless", "Python/Node"],
      color: "primary"
    }
  ],

  activityFeed: [
    {
      id: "act-1",
      user: "Anuj",
      action: "created",
      resourceName: "'agri-lens-db'",
      time: "2 hours ago",
      type: "Database Provisioning",
      status: "SUCCESS",
      icon: "add_circle",
      colorClass: "primary"
    },
    {
      id: "act-2",
      user: "System",
      action: "auto-scaled",
      resourceName: "'prod-us-east-1'",
      targetState: "to 5 nodes",
      time: "4 hours ago",
      type: "Autoscaler Action",
      icon: "dynamic_feed",
      colorClass: "tertiary"
    },
    {
      id: "act-3",
      user: "System",
      action: "updated",
      resourceName: "Billing Cycle",
      time: "6 hours ago",
      type: "Finance",
      icon: "receipt_long",
      colorClass: "secondary",
      link: true
    }
  ],

  stats: {
    totalResources: 14,
    totalResourcesDelta: "+2 Since yesterday",
    monthlyCost: "$1,240.50",
    monthlyCostDelta: "↑ 4.2% projected",
    systemHealth: "99.9%"
  }
};

module.exports = mockDb;
