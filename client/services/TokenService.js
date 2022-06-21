import jwtDecode from 'jwt-decode'

const isTokenValid = (token) => {
    const currentDate = new Date();
    const decodedToken = jwtDecode(token);

    return decodedToken.exp * 1000 > currentDate.getTime();
}

const TokenService = { isTokenValid };

export default TokenService;