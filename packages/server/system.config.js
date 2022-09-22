module.exports = {
  serverPort: 5006,
  passwordSalt: 'mango-i18n-system-password-salt',
  jwtSecurity: {
    jwtAccessSecret: 'mango-i18n-system-jwt-access-secret',
    jwtRefreshSecret: 'mango-i18n-system-jwt-refresh-secret',
    expiresIn: '31d',
    refreshIn: '62d',
  },
  registerKey: 'mango-i18n-system-register-key',
};
