
import { AsyncStorage } from 'react-native';
import PushNotification from 'react-native-push-notification'

    //push notification
            PushNotification.configure({
                      onNotification: async function(notification:any) {
                          if(notification.data){
                            console.log('REMOTE NOTIFICATION ==>', notification.data);
                            let dataFromStorage:any
                            let notificationData = await AsyncStorage.getItem('notificationData');
                            if(notificationData != null){
                                dataFromStorage = JSON.parse(notificationData);
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
    
                    // PushNotification.localNotification({
                    //     autoCancel:true,
                    //             title: "Pending Notifications", 
                    //           message: "Pending Notifications", 
                    //           playSound: true, 
                    //           soundName: "default",
                    //           invokeApp: true, 
                    //           largeIcon:'esi_logo',
                    //           smallIcon:'esi_logo',
                    //           color:'#00BFFF',
                    //      });
                          }
                       
                      },
                      popInitialNotification: true,
                      
                    })
 
