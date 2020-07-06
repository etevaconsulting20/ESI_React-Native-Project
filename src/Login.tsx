
import React, {Component} from 'react';
import { StyleSheet,Text, View,ScrollView, Platform, TouchableOpacity, Alert, ToastAndroid, Modal, Dimensions} from 'react-native';
import {Item,Icon,Input,Button,Toast, Title, Container, Left, Right} from 'native-base'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import firebase from 'react-native-firebase';
import axios from "axios";
import moment from 'moment';

interface  Props extends NavigationScreenProp <void>{
    navigation: NavigationScreenProp<any, any>;
  }
  
  interface State{
    username:any,
    password:any,
    disableBtn:boolean,
    loginFailedModal:boolean,
  }

  const backend_Endpoint='https://appbackend20180515014638.azurewebsites.net//api/register'
  let handle:any

  class Login extends Component<Props, State> {
    constructor(props:any) {
        super(props);
        this.state={
          username:'',
          password:'',
          disableBtn:true,
          loginFailedModal:false,
      }
    }

    componentWillMount(){
        // this.checkPermission();
        this.getToken();
        // this.permission();
        this.firebaseNotificationCheck();
    }

    async firebaseNotificationCheck(){
      const notificationOpen = await firebase.notifications().getInitialNotification();
      // console.log('getInitialNotification......:',notificationOpen)
      if (notificationOpen) {
        let currentTime = moment().utcOffset('+05:30').format(' hh:mm');
        let notificationData={...notificationOpen.notification.data,epochTimeMs:currentTime}
        let initData = notificationData;
        console.log('getInitialNotification data.....:',initData)
        this.props.navigation.navigate('NotificationList',{initData:initData})
       }

       firebase.notifications().onNotificationOpened((notificationOpen) => {
        // console.log('onNotificationOpened......:',notificationOpen)
      if (notificationOpen) {
        let currentTime = moment().utcOffset('+05:30').format(' hh:mm');
        let notificationData={...notificationOpen.notification.data,epochTimeMs:currentTime}
        let initData = notificationData;
        console.log('onNotificationOpened data info.....:',initData)
        this.props.navigation.navigate('NotificationList',{initData:initData})
       }
    });
    }

permission(){
  firebase.messaging().hasPermission()
  .then(enabled => {
    if (enabled) {
      alert('Yes')
    } else {
      alert('No')
    } 
  });


  firebase.messaging().getToken()
  .then(fcmToken => {
    if (fcmToken) {
      // user has a device token
      console.log('token............',fcmToken)
    } else {
      // user doesn't have a device token yet
      console.log('no token............',fcmToken)
    } 
  });
}
    checkPermission = async () => {
      const enabled = await firebase.messaging().hasPermission();
      console.log('enables....',enabled)
      if(enabled){
        Alert.alert(
          'Turn on notifications',
          'app wants to send you push notifications',
          [
            {
              text:'not now',
              style:'cancel'
            },
            {
              text:'ok',
              // onPress: () => this.getToken()
            }
          ],
          {cancelable:false}
        );
      }
    }

    getToken = async () =>{
       const token =await  firebase.messaging().getToken();
          handle = token;
          console.log('handle token............',handle)
          //    firebase.messaging().getToken()
          // .then(fcmToken => {
          //   console.log('fcmToken............',fcmToken)
          //   if (fcmToken) {
          //     console.log('token............',fcmToken)
          //   } else {
          //     // user doesn't have a device token yet
          //   } 
          // });
      
    }

    navigateToNotificationList(){
        // this.setState({loginFailedModal:true})
       this.apiCall();
       this.props.navigation.navigate('NotificationList')
       ToastAndroid.show('Logged in and registered',ToastAndroid.SHORT)
      
    }

    apiCall(){
      const authInfo={
        Username:this.state.username,
        Password:this.state.password
      }

      const deviceInfo={
        Username:this.state.username,
        Password:this.state.password,
        Platform:'gcm',
        Handle:handle
      }

      const loginModel=JSON.stringify(authInfo);
      const notifRegisModel=JSON.stringify(deviceInfo);

      var config= {headers:{"Content-Type":"application/json"}};

      axios.post(`${backend_Endpoint}?handle=${handle}`,loginModel,config)
        .then((response)=>{
            console.log("response...",response)
            console.log("registrationId...",response.data)
            // return response.data
            if(response.data){
              axios.put(`${backend_Endpoint}/${response.data}`,notifRegisModel,config)
              .then((responseData)=>{
                  console.log("responseData...",responseData)
              })
              .catch((error)=>{
                console.log("error...",error.response)
              })
            }
        })
        .catch((error)=>{
          console.log("error...",error.response)
        })
    }

    setUsername(username:any){
      this.setState({username:username})
    }
    setPassword(password:any){
      this.setState({password:password})
    }
    closeLoginFailedModal(){
      this.setState({loginFailedModal:false})
    }

    render(){
        return(
             <Container>
               <View style={{backgroundColor:'#000000',height:100}}><Text style={{color:'#ffffff',fontWeight:'bold',fontSize:25,padding:10}}>EtherSec</Text></View>
              <View style={{justifyContent:'center',alignItems:'center',position: 'absolute',top:50,bottom:0,right:0,left:0,backgroundColor:'#000000'}}>
            <View style={{backgroundColor:'#ffffff',borderRadius:5}}>
                <Item  style={styles.formItem}>
                  <Input autoCapitalize='none' placeholderTextColor={"#c8c8c8"} style={styles.formItemInput} 
                        onChangeText={(text)=>this.setUsername(text)} 
                        placeholder='Username'  keyboardType='email-address'  maxLength={256}/>
                </Item>
            </View>

            <View style={{backgroundColor:'#ffffff',borderRadius:5}}>
              <Item  style={styles.formItem}>
                <Input placeholderTextColor={"#c8c8c8"} style={styles.formItemInput}  secureTextEntry={true} 
                       onChangeText={(text)=>this.setPassword(text)} 
                      placeholder='Password' keyboardType='default'  maxLength={16}/>
              </Item>
            </View>

            <TouchableOpacity disabled={(this.state.username.length>0 && this.state.password.length>0) ? false : true}  style={styles.button} onPress={()=>this.navigateToNotificationList()}>
              <Text style={[styles.buttonText,{color:(this.state.username.length>0 && this.state.password.length>0) ? '#ffffff' : '#606060' }]}>Login</Text>
            </TouchableOpacity>

            <View style={{margin:30}}>
                <Text style={{color:'#ffffff',fontSize:16}}>To receive detection alerts,please login with your system username and password</Text>
            </View>
            </View>

            <Modal visible={this.state.loginFailedModal} transparent={true} animationType={'none'}>
                    <View style={styles.loginFailedModal}>
                          <Text style={{fontSize:16,fontWeight:'bold'}}>Login Failed: Invalid username and/or password</Text>
                          <Button style={{marginTop:40}} transparent onPress={()=>this.closeLoginFailedModal()}>
                                <Text style={{color:'#009999',fontWeight:'bold'}}>OK</Text>
                            </Button>
                    </View>
            </Modal>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    button : {
      width: 298,
      height: 48,
      borderRadius: 5,
      backgroundColor: "#1E90FF",
      alignSelf:'center',
      textAlign:'center',
      marginTop:'5%'
    },
    buttonText:{
      width: 230,
      height: 24,
      fontFamily: "CeraPro-Medium",
      fontSize: 17,
      lineHeight: 24,
      letterSpacing: -0.41,
      // color: "#000000",
      textAlign:'center',
      marginLeft:35,
      marginTop:11,
      marginBottom:11
    },
    formItem:{
      // marginTop:22,
     alignSelf:'center',
      width: 298,
      height: 48,
      // borderRadius: 40,
    },
    formItemInput:{
      ...Platform.select({
        ios: {
          flex:1,
          alignSelf:'center',
          fontFamily: "CeraPro-Regular", 
          fontSize: 16,
          fontWeight: "500",
          // fontStyle: "italic",
          color: "#000000"
        },
        android: {
          alignSelf:'center',
          paddingBottom:10,
          fontFamily: "CeraPro-Regular",
          width: 300,
          height: 'auto',
          fontSize: 20,
          fontWeight: "500",
          // fontStyle: "italic",
          lineHeight: 20,
          letterSpacing: 0.05,
          color: "#000000"
            }
      })
    },
    loginFailedModal:{
      justifyContent:'center',
      // alignItems:'center',
      alignSelf:'center',
      padding:20,
      backgroundColor : "#ffffff",
      height: 'auto' ,  
      width: '85%',  
      borderRadius:3,  
      borderWidth: 1,  
      borderColor: '#ccc',    
      elevation:20,
    top:Dimensions.get('window').height/3
       },
  });

export default Login

