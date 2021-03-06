import { create } from 'axios';
import myConfig from '../../src/app/appsettings.json'

const instance = create({
    baseURL: myConfig.AppSettings.ApiUrl //'http://localhost/CertiPath.BlockchainGateway.API/Api' //'http://www.dltgateway.com/DLTGatewayAPI/Api/'  //http://localhost/CertiPath.BlockchainGateway.API/Api' // staging URL: 'http://nbcpwin1.eastus.cloudapp.azure.com:9000/'
});

let user = JSON.parse(sessionStorage.getItem('userAuth'));
if (user != null) {
    if (user.IsAuthenticated.toString().toUpperCase() == 'TRUE') {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + user.access_token;
    }
}


export default instance;