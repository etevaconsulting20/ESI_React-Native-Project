// @flow
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';
import PushNotification from 'react-native-push-notification'

// Optional flow type
// import type { RemoteMessage } from 'react-native-firebase';


// export default async (message: any) => {
    // handle your message
        //firebase
            // let dataFromStorage:any
            // let notificationData = await AsyncStorage.getItem('notificationData');
            // if(notificationData != null){
            //     dataFromStorage = JSON.parse(notificationData);
            //     console.log('from asyncStoreage bgmessage...............',dataFromStorage);
            //     // let dataToStore=dataFromStorage;
            //     let obj ={...message.data,isRead:false,readNotificationTime:null};
            //     dataFromStorage.push(obj);
            //     console.log('dataToStorage...............',dataFromStorage);
            //     await AsyncStorage.setItem('notificationData',JSON.stringify(dataFromStorage));
            // }
            
            // const channel = new firebase.notifications.Android
            //     .Channel('test-channel','Test Channel',firebase.notifications.Android.Importance.High)
            //     .setDescription('My apps test channel');
            // firebase.notifications().android.createChannel(channel);

            //  const notification = new firebase.notifications.Notification()
            //     .setNotificationId('notificationId')
            //     .setTitle('Pending Notifications')
            //     .setBody('Pending Notifications')
            //     .setData({
            //         key1: 'value1',
            //         key2: 'value2',
            //     })
            //     .setSound('default')
            //     .android.setAutoCancel(true)
            //     .android.setChannelId('test-channel')
            //     .android.setSmallIcon('esi_logo')
            //     .android.setColor('#00BFFF')
            //     .android.setPriority(firebase.notifications.Android.Priority.Max);

            //  notification.android.setChannelId('test-channel')
            //         .android.setSmallIcon('esi_logo');

            // //display the notification
            // firebase.notifications().displayNotification(notification);

    //push notification
            PushNotification.configure({
                      onNotification: async function(notification:any) {
                          if(notification.data){
                            console.log('REMOTE NOTIFICATION ==>', notification.data);
                            let dataFromStorage:any
                            let notificationData = await AsyncStorage.getItem('notificationData');
                            if(notificationData != null){
                                dataFromStorage = JSON.parse(notificationData);
                                console.log('from asyncStoreage bgmessage...............',dataFromStorage);
                                // let dataToStore=dataFromStorage;
                                let obj ={...notification.data,isRead:false,readNotificationTime:null};
                                dataFromStorage.push(obj);
                                console.log('dataToStorage...............',dataFromStorage);
                                await AsyncStorage.setItem('notificationData',JSON.stringify(dataFromStorage));
                            }else{
                                let obj ={...notification.data,isRead:false,readNotificationTime:null};
                                let notificationInfo=[]
                                notificationInfo.push(obj)
                                console.log('from notificationInfo in notify...............',notificationInfo);
                                AsyncStorage.setItem('notificationData',JSON.stringify(notificationInfo)); 
                            }
    
                    PushNotification.localNotification({
                        autoCancel:true,
                                title: "Pending Notifications", 
                              message: "Pending Notifications", 
                              playSound: true, 
                              soundName: "default",
                              invokeApp: true, 
                              largeIcon:'esi_logo',
                              smallIcon:'esi_logo',
                              color:'#00BFFF',
                         });
                          }
                       
                      },
                      popInitialNotification: true,
                      
                    })
    // return Promise.resolve();
// }
