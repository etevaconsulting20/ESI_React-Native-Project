// @flow
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';
// Optional flow type
// import type { RemoteMessage } from 'react-native-firebase';


export default async (message: any) => {
    // handle your message
    // let messageListener = firebase.messaging().onMessage((message)=>{
        // console.log('background message......',message)
        // if(message){
            // Alert.alert(message.data);

            let dataFromStorage:any
            let notificationData = await AsyncStorage.getItem('notificationData');
            if(notificationData != null){
                dataFromStorage = JSON.parse(notificationData);
                console.log('from asyncStoreage bgmessage...............',dataFromStorage);
                // let dataToStore=dataFromStorage;
                let obj ={...message.data,isRead:false,readNotificationTime:null};
                dataFromStorage.push(obj);
                console.log('dataToStorage...............',dataFromStorage);
                await AsyncStorage.setItem('notificationData',JSON.stringify(dataFromStorage));
            }
            
            // let dataToStore=dataFromStorage;
            // let obj ={...message.data,isRead:false,readNotificationTime:null};
            // dataToStore.push(obj);
            // // let notificationDetails = [...dataFromStorage, obj]
            // await AsyncStorage.setItem('notificationData',JSON.stringify(dataToStore));

            const channel = new firebase.notifications.Android
                .Channel('test-channel','Test Channel',firebase.notifications.Android.Importance.High)
                .setDescription('My apps test channel');
            firebase.notifications().android.createChannel(channel);

             const notification = new firebase.notifications.Notification()
                .setNotificationId('notificationId')
                .setTitle('Pending Notifications')
                .setBody('Pending Notifications')
                .setData({
                    key1: 'value1',
                    key2: 'value2',
                })
                .setSound('default')
                .android.setAutoCancel(true)
                .android.setChannelId('test-channel')
                .android.setSmallIcon('esi_logo')
                .android.setColor('#00BFFF')
                .android.setPriority(firebase.notifications.Android.Priority.Max);

             notification.android.setChannelId('test-channel')
                    .android.setSmallIcon('esi_logo');

            //display the notification
            firebase.notifications().displayNotification(notification);

          

         
        // }
    // })
    return Promise.resolve();
}
