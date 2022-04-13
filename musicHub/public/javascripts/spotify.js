const getAccessToken = () => {
    const urlParams = (new URL(document.location)).searchParams;
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    return accessToken;
};

const accessToken = getAccessToken();
console.log(accessToken);

//const urlParams = (new URL(document.location)).searchParams;
//const accessToken = urlParams.get('access_token');
//const refreshToken = urlParams.get('refresh_token');

//console.log("Access Token: " + accessToken);
//console.log("Refresh Token: " + refreshToken);