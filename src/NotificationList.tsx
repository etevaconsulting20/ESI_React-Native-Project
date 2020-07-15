
import React, {Component} from 'react';
import { StyleSheet,Text, View,ScrollView, Platform, TouchableOpacity, Alert, Modal,ToastAndroid, Dimensions, Linking, TouchableWithoutFeedback, AsyncStorage} from 'react-native';
import {Item,Input,Toast, Title, Header, Left, Right, Body, Button, CheckBox, Container} from 'native-base'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import firebase from 'react-native-firebase';
import PushNotification from 'react-native-push-notification'

interface  Props extends NavigationScreenProp <void>{
    navigation: NavigationScreenProp<any, any>;
  }
  
  interface State{
      menuModal:boolean,
      confirmationModal:boolean,
      tickToConfirm:boolean,
      modal:any,
      navigationParams:any,
      notificationDetails:any,
      unreadNotifications:any,
      username:any,
  }

class NotificationList extends Component<Props, State> {
    _menu = null;
    constructor(props:any) {
        super(props);
        this.getNotificationDataFromStorage = this.getNotificationDataFromStorage.bind(this)
        this.state={
         menuModal:false,
         confirmationModal:false,
         tickToConfirm:false,
         modal:null,
         navigationParams:null,
         notificationDetails:[],
         unreadNotifications:null,
         username:null,
      }
    }

     componentWillMount(){
        // this.getNavigationParams();
        this.getUsernameFromStorage();
        this.getNotificationDataFromStorage();
      this.getNotificationMessage();
     
      }
   
      async getUsernameFromStorage(){
        let username= await AsyncStorage.getItem('username');
        if(username !==null){
             this.setState({username:JSON.parse(username)})
        }
      }
       async getNotificationDataFromStorage(){
       let data= await AsyncStorage.getItem('notificationData');
        if(data != null){
            let dataFromStorage:any
            dataFromStorage = JSON.parse(data);
            console.log('from asyncStoreage...............',dataFromStorage);
            let count=0;
            dataFromStorage.map((data:any,i:any)=>{
                if(data.isRead == false){
                    count = count+1;
                }
            })
            this.setState({notificationDetails:dataFromStorage,unreadNotifications:count})
            // return JSON.parse(data);
        }
       
      }
     
      getNotificationMessage(){
        let notificationDetails=this.state.notificationDetails
        //firebase
                // let messageListener = firebase.messaging().onMessage(async (message)=>{
                //     if(message){
                //         this.createNotification();
                //         let obj ={...message.data,isRead:false,readNotificationTime:null};
                //         let notificationDetails = [...this.state.notificationDetails , obj]
                //         console.log(' notificationDetails...', notificationDetails)
                //         await AsyncStorage.setItem('notificationData',JSON.stringify(notificationDetails));
                //         this.getNotificationDataFromStorage();
                //     }
                // })
        
     //push notification
          PushNotification.configure({
            onNotification:  async function(notification:any) {
                if(notification.data){
                    console.log('REMOTE NOTIFICATION ==>', notification.data)
                    let data = await AsyncStorage.getItem('notificationData');
                              if(data != null){
                                  let dataFromStorage:any
                                  dataFromStorage = JSON.parse(data);
                                  console.log('asyncStoreage...............',dataFromStorage);
                                  let obj ={...notification.data,isRead:false,readNotificationTime:null};
                                   dataFromStorage.push(obj)
                                  console.log('dataFromStorage ..............',dataFromStorage);
                                    AsyncStorage.setItem('notificationData',JSON.stringify(dataFromStorage)); 
                                  
                              }else{
                                  let obj ={...notification.data,isRead:false,readNotificationTime:null};
                                  let notificationInfo=[]
                                  notificationInfo.push(obj)
                                  console.log(' notificationInfo...............',notificationInfo);
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
      }

    createNotification(){
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
    }

    getNavigationParams(){
        if(this.props.navigation.state.params != undefined){
          let initData = this.props.navigation.state.params.initData;
          this.setState({notificationDetails:initData})
          console.log("details.........",initData)
        }
        else{
          this.state.navigationParams = null
        }
       }

    async navigateToNotificationDetails(data:any,i:any){
         if(this.state.notificationDetails[i].isRead ==false){
            this.state.notificationDetails[i].readNotificationTime = moment().format('hh:mm - MMM D, YYYY');
            this.setState({unreadNotifications:this.state.unreadNotifications - 1})
        }
        this.state.notificationDetails[i].isRead = true;
        
        await AsyncStorage.setItem('notificationData',JSON.stringify(this.state.notificationDetails));
        this.props.navigation.navigate('NotificationDetails',{initData:data,index:i})
    }
    openMenuModal(){
        this.setState({
            menuModal:true
        })
    }
    openConfirmationModal(modalData:any){
        this._menu.hide();
        this.setState({
            menuModal:false,confirmationModal:true,modal:modalData
        })
    }
    closeConfirmationModal(){
        this.setState({
            confirmationModal:false,tickToConfirm:false
        })
    }
    toggleCheckbox(){
        this.setState({
            tickToConfirm:!this.state.tickToConfirm
        })
    }
    async showToastAndDeleteNotifications(){
        if(this.state.modal == 'deleteAll'){
            ToastAndroid.show(`${this.state.notificationDetails.length}: Messages Deleted`,ToastAndroid.SHORT)
            this.state.notificationDetails=[];
            await AsyncStorage.setItem('notificationData',JSON.stringify(this.state.notificationDetails));
        }
        if(this.state.modal == 'deleteAllRead'){
           let deleteData= this.state.notificationDetails;
           let deleteAllRead =[];
           let readNotificationsCount=0;
              deleteData.map((data:any,i:any)=>{
                if(data.isRead == false){
                    deleteAllRead.push(data)
                }else{
                    readNotificationsCount = readNotificationsCount + 1
                }
            })
            this.state.notificationDetails = deleteAllRead;
            await AsyncStorage.setItem('notificationData',JSON.stringify(this.state.notificationDetails));
            ToastAndroid.show(`${readNotificationsCount}: Messages Deleted`,ToastAndroid.SHORT)
        }
        this.setState({
            confirmationModal:false,tickToConfirm:false
        })
    }
     logout(text:any){
        this._menu.hide();
        if(text == 'logout'){
            AsyncStorage.multiRemove(['authenticationKey'],()=>{
                this.props.navigation.navigate('Login')
            })
        }
        if(text == 'logoutAndDeleteMsg'){
            AsyncStorage.multiRemove(['authenticationKey','notificationData'],()=>{
                this.props.navigation.navigate('Login')
            })
        }
    
    }
    loginToSystem(){
        this._menu.hide();
        Linking.openURL("https://www.myethersec.com/SafeServe/ServerPhP/UI/FrontPages/MyEtherSecFrontPage.php")
    }
    setMenuRef = (ref:any) => {
        this._menu = ref;
      };
      showMenu = () => {
        this._menu.show();
      };
      
    render(){
        // console.log("render.this.state.notificationDetails...",this.state.notificationDetails)
        return(
            <Container>
                 <Header style={styles.header}>
                        <Left style={styles.headerLeft}>
                            <Text style={{color:'#ffffff',fontSize:21,fontWeight:'bold'}}>{this.state.username}</Text>
                            { this.state.notificationDetails && this.state.notificationDetails.length>0 ?
                                <Text style={{color:'#A9A9A9',fontSize:16,}}>{this.state.notificationDetails.length} ({this.state.unreadNotifications} unread)</Text>
                                   : 
                                   <Text style={{color:'#A9A9A9',fontSize:16,}}>0 (0 unread)</Text>
                              }
                            </Left>
                        <Right style={styles.headerRight}>
                            <MaterialCommunityIcons name="home" style={styles.icons}> </MaterialCommunityIcons>
                            <Menu style={styles.menuModal}
                                    ref={this.setMenuRef}
                                    button={ <MaterialCommunityIcons onPress={()=>this.showMenu()} name="dots-vertical" style={styles.icons}> </MaterialCommunityIcons>}>
                                <MenuItem onPress={()=>this.loginToSystem()}>Login to System</MenuItem>
                                <MenuItem onPress={()=>this.openConfirmationModal('deleteAll')}>Delete All</MenuItem>
                                <MenuItem onPress={()=>this.openConfirmationModal('deleteAllRead')}>Delete All Read</MenuItem>
                                <MenuItem onPress={()=>this.openConfirmationModal('logout')}>Logout</MenuItem>
                            </Menu>
                            {/* <MaterialCommunityIcons onPress={()=>this.openMenuModal()} name="dots-vertical" style={styles.icons}> </MaterialCommunityIcons> */}
                        </Right>
                    </Header>
            <ScrollView>
                {/* <NavigationEvents 
            onWillFocus={payload => {
                this.getNotificationDataFromStorage();
                this.getNotificationMessage();
            }}
            /> */}
                   
                 {/* <View style={{backgroundColor:'#383838'}}> */}
                {this.state.notificationDetails && this.state.notificationDetails.length > 0 ? this.state.notificationDetails.map((data:any,i:any)=>(
                    <TouchableOpacity key={i} onPress={() => this.navigateToNotificationDetails(data,i)}>
                    <View style={{flexDirection:'row',height:63,backgroundColor:data.isRead ?'#E0E0E0':'#383838', borderBottomColor:data.isRead ? '#808080' : '#ffffff',borderBottomWidth:0.4}}>
                        <Left style={{flex:1}}>
                            <MaterialCommunityIcons name="bell-alert" style={{fontSize:38 ,color:data.isRead ? '#000000' : '#ffffff'}}> </MaterialCommunityIcons>
                        </Left>
                        <Body style={{flex:3,flexDirection:'column',flexWrap:'wrap'}}>  
                              <Text style={data.isRead ? styles.text1 : styles.text}>{data.systemId}</Text>
                             <Text style={data.isRead ? styles.subText1 : styles.subText}>Camera: {data.cameraId}</Text>
                        </Body>
                        <Right style={{flex:1.5}}>
                            <Text style={{color:data.isRead ? '#000000' : '#1E90FF',paddingRight:12,fontSize:16,fontWeight:data.isRead ? 'normal' : 'bold'}}>
                                     {moment(moment.unix(data.dateTimeAlarm/1000).format("MM/DD/YYYY")).isBefore(moment().format("MM/DD/YYYY")) 
                                       ? `${moment.unix(data.dateTimeAlarm/1000).format('ddd hh:mm')}`  
                                       :  `${moment.unix(data.dateTimeAlarm/1000).format('hh:mm')}` }
                                </Text> 
                        </Right>
                    </View>
                    </TouchableOpacity>
                )) :
                <View style={{justifyContent:'center',alignItems:'center',paddingTop:20}}>
                    <Text style={{fontSize:18,color:'#808080'}}>No notifications to display</Text>
                </View>
            }
           
                
                <Modal visible={this.state.confirmationModal} transparent={true} animationType={'none'}>
                    <View style={styles.confirmationModal}>
                        {this.state.modal == 'deleteAll' ? <Text style={styles.confirmText}>Are you sure you want to delete all messages?</Text> : null}
                        {this.state.modal == 'deleteAllRead' ? <Text style={styles.confirmText}>Are you sure you want to delete all read messages?</Text> : null}
                        {this.state.modal == 'logout' ?
                        <View>
                            <Text style={styles.confirmText}>Are you sure you want to logout?</Text>
                            <Button transparent style={{marginTop:25}} onPress={()=>this.toggleCheckbox()}>
                             <View style={{flexDirection:"row"}}>
                                <Left style={{flex:3}}>
                                    <Text style={{color:'#808080',fontSize:18}}>Tick to confirm you wish to logout and no longer receive alert messages.</Text>
                                </Left>
                                <Right style={{flex:0.5,paddingRight:12}}>
                                    <CheckBox checked={this.state.tickToConfirm} onPress={()=>this.toggleCheckbox()}></CheckBox>
                                </Right>
                            </View>
                           </Button> 
                           <View style={{flexDirection:'column',paddingTop:10,marginTop:200}}>
                                <Button transparent style={{alignSelf:'flex-end',marginBottom:20}} onPress={()=>this.logout('logout')} disabled={!this.state.tickToConfirm}>
                                    <Text style={{color:this.state.tickToConfirm ? '#009999' : '#C0C0C0',fontWeight:'bold',fontSize:20}}>YES</Text>
                                </Button>
                                <Button transparent style={{alignSelf:'flex-end',marginBottom:20}} onPress={()=>this.logout('logoutAndDeleteMsg')} disabled={!this.state.tickToConfirm}>
                                    <Text style={{color:this.state.tickToConfirm ? '#009999' : '#C0C0C0',fontWeight:'bold',fontSize:20}}>YES AND DELETE EXISTING MESSAGES</Text>
                                </Button>
                                <Button transparent style={{alignSelf:'flex-end'}} onPress={()=>this.closeConfirmationModal()} >
                                    <Text style={{color:'#009999',fontWeight:'bold',fontSize:20}}>CANCEL</Text>
                                </Button>
                            </View>
                        </View> :
                        
                        <View>
                            <Button transparent onPress={()=>this.toggleCheckbox()}>
                            <View style={{flexDirection:"row"}}>
                                <Left>
                                    <Text style={{color:'#808080',fontSize:18}}>Tick to confirm</Text>
                                </Left>
                                <Right style={{paddingRight:12}}>
                                    <CheckBox checked={this.state.tickToConfirm} onPress={()=>this.toggleCheckbox()}></CheckBox>
                                </Right>
                            </View>
                            </Button> 
                            <View style={{flexDirection:'row',marginTop:300}}>
                                <Left>
                                    <Button transparent onPress={()=>this.closeConfirmationModal()}>
                                        <Text style={{color:'#009999',fontWeight:'bold',fontSize:20}}>CANCEL</Text>
                                    </Button>
                                </Left>
                                <Right>
                                    <Button transparent onPress={()=>this.showToastAndDeleteNotifications()} disabled={!this.state.tickToConfirm}>
                                        <Text style={{color:this.state.tickToConfirm ? '#009999' : '#C0C0C0',fontWeight:'bold',fontSize:20}}>YES</Text>
                                    </Button>
                                </Right>
                            </View>
                        </View>}
                        
                    </View>
                </Modal>

              </ScrollView>
             </Container>
        )
    }
}


 const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    icons:{fontSize:25 ,color:'#ffffff',paddingLeft:10},
    header:{
        backgroundColor:'#181818',
        height:65,
        borderBottomColor:'#ffffff',borderBottomWidth:0.4,
    },
    headerLeft: {
        flex: 2,
        flexDirection: 'column',paddingLeft:5
    },
    headerRight: {
        flex: 2,
        flexDirection: 'row'
    },
    text:{
        color:'#ffffff',fontSize:20,fontWeight:'bold'
    },
    subText:{color:'#ffffff',fontSize:15,fontWeight:'bold'},
    text1:{
        color:'#000000',fontSize:20,fontWeight:'normal',fontStyle:'italic'
    },
    subText1:{ color:'#000000',fontSize:15,fontWeight:'normal',fontStyle:'italic'},
    menuModal: {  
        alignSelf:'flex-end',
        backgroundColor : "#ffffff",   
        height: 'auto' ,  
        width: '55%',  
        borderRadius:1,  
        borderWidth: 1,  
        borderColor: '#ccc',    
        elevation:20
         },
    confirmationModal:{
        justifyContent:'center',
        // alignItems:'center',
        alignSelf:'center',
        padding:15,
        backgroundColor : "#ffffff",
        height: 'auto' ,  
        width: '85%',  
        borderRadius:3,  
        borderWidth: 1,  
        borderColor: '#ccc',    
        elevation:20,
      top:Dimensions.get('window').height/15
         },
    buttonText:{
        fontSize:16,paddingLeft:15
    },
    confirmText:{
        fontSize:22,fontWeight:'bold'
    },
  });

export default NotificationList

