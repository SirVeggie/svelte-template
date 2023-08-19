module.exports = {
  apps: [{
    name: 'svelte-template',
    script: 'node', args: '-r dotenv/config build',
  }]
};
