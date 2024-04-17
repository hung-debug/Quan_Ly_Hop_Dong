export interface AuthConfig {
  issuer: string,
  clientId: string,
  responseType: string,
  redirectUri: string,
  scope: string,
}

export const authConfig: AuthConfig = {
  issuer: 'https://auth-sso.mobifone.vn:8080/oauth/realms/sso-mobifone',
  clientId: 'econtract',
  responseType: 'code',
  redirectUri: window.location.origin + '/login-callback',
  scope: 'openid',
};