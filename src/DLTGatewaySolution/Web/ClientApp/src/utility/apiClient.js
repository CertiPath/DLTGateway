import { create } from 'axios';

const instance = create({
    baseURL: 'http://localhost/CertiPath.BlockchainGateway.API/Api' // staging URL: 'http://nbcpwin1.eastus.cloudapp.azure.com:9000/'
});

export default instance;