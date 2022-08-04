//NOTE: if i convert the keycloak.js to keycloak.ts it throws error saying Only a void function can be called with the 'new' keyword.ts(2350)

import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    realm: `${process.env.REACT_APP_KEYCLOAK_REALM}`,
    url: `${process.env.REACT_APP_KEYCLOAK_URL}auth/`,
    clientId: `${process.env.REACT_APP_KEYCLOAK_CLIENT_ID}`,
});
export default keycloak;
