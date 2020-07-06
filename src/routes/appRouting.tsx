
import { createSwitchNavigator, createAppContainer } from 'react-navigation';  
import Login from '../Login';
import NotificationList from '../NotificationList';
import NotificationDetails from '../NotificationDetails';

const AppNavigator = createSwitchNavigator(  
    {  
        Login: {screen: Login}, 
        NotificationList: {screen: NotificationList}, 
        NotificationDetails: {screen: NotificationDetails}, 
    },  
    {  
        initialRouteName: "Login"  
    }  
);  
export default AppNavigator