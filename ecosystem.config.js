module.exports = {
  apps: [
    {
      name: "gap-analysis-backend",
      script: "./backend/dist/main.js",
      cwd: "./backend",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      instances: 1,
      exec_mode: "cluster",
    },
    {
      name: "gap-analysis-frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
