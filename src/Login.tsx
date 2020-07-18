
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Platform, TouchableOpacity, Alert, ToastAndroid, Modal, Dimensions, AsyncStorage } from 'react-native';
import { Item, Icon, Input, Button, Toast, Title, Container, Left, Right, } from 'native-base'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import axios from "axios";
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as testActions from "./actions/TestAction";
import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
interface Props extends NavigationScreenProp<void> {
  navigation: NavigationScreenProp<any, any>;
  testActions: typeof testActions;
}

interface State {
  username: any,
  password: any,
  disableBtn: boolean,
  loginFailedModal: boolean,
  loginCheckMessage: boolean,
  loginErrorMessage: boolean,
  networkErrorMessage: boolean,
  serverErrorMessage: boolean
}

const backend_Endpoint = 'https://appbackend20180515014638.azurewebsites.net//api/register'
let handle: any
let registrationId: any;
class Login extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      disableBtn: true,
      loginFailedModal: false,
      loginCheckMessage: false,
      loginErrorMessage: false,
      networkErrorMessage: false,
      serverErrorMessage: false,
    }
  }

  componentWillMount() {
    this.checkUserLogin();
    this.permission();
    this.getTokenPN();
  }
 
  
//get token
  getTokenPN() {
    PushNotification.configure({
      onRegister: function (token: any) {
        console.log("TOKEN:...............", token);
        handle = token.token
      },
      onNotification: function (notification: any) {
        console.log("NOTIFICATION....:", notification);

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    })

  }
  async checkUserLogin() {
    const registrationKey = await AsyncStorage.getItem('authenticationKey')
    // JSON.parse(registrationId);
    if (registrationKey !== null) {
      console.log(".......login", registrationKey);
      this.props.navigation.navigate('NotificationList')
    }
  }


  permission() {
    console.log('PushNotificationIOS.requestPermissions')
    if (Platform.OS == 'ios') {
      PushNotificationIOS.requestPermissions();
      PushNotificationIOS.addEventListener('register', this._OnRegister)
      PushNotificationIOS.addEventListener('registrationError', this._OnRegistrationError)
      PushNotificationIOS.addEventListener('localNotification', this._OnLocalNotification)
      PushNotificationIOS.addEventListener('notification', this._OnNotification)
    }
  }

  _OnRegister = (deviceToken: any) => {
    console.log('deviceToken', deviceToken)
    // Alert.alert('deviceToken', deviceToken)
  }

  _OnRegistrationError = (Error: any) => {
    console.log('Error', Error)
  }

  _OnLocalNotification = (localNotification: any) => {
    console.log('localNotification', localNotification)
  } 

  _OnNotification = (notif: any) => {
    console.log('_OnNotification', notif)
    
  }

  navigateToNotificationList() {
    // this.setState({loginFailedModal:true})
    this.setState({ loginCheckMessage: true })
    AsyncStorage.setItem('username', JSON.stringify(this.state.username));
    this.apiCall();
  }
  saveRegistrationId(registrationId: any) {
    this.setState({ loginCheckMessage: false })
    AsyncStorage.setItem('authenticationKey', JSON.stringify(registrationId))
  }
  apiCall() {
    const authInfo = {
      Username: this.state.username,
      Password: this.state.password
    }

    const deviceInfo={
      Username:this.state.username,
      Password:this.state.password,
      Platform: Platform.OS=='ios'?'apns':'gcm',
      Handle:handle
    }

    const loginModel = JSON.stringify(authInfo);
    const notifRegisModel = JSON.stringify(deviceInfo);

    var config = { headers: { "Content-Type": "application/json" } };

    // api call for username password validation
    axios.post(`${backend_Endpoint}?handle=${handle}`, loginModel, config)
      .then((response) => {
        console.log("response...", response)
        console.log("registrationId........", response.data)
        if (response.data) {
          registrationId = response.data;
          this.saveRegistrationId(registrationId);
          //api call for notification registration
          axios.put(`${backend_Endpoint}/${response.data}`, notifRegisModel, config)
            .then((responseData) => {
              console.log("responseData...", responseData)
              if (responseData.status == 200) {
                console.log("login successfull...")
                ToastAndroid.show('Logged in and registered', ToastAndroid.SHORT)
                this.props.navigation.navigate('NotificationList')
              }
            })
            .catch((error) => {
              console.log("1error...", error.response)
              this.setState({ loginCheckMessage: false, serverErrorMessage: true, loginFailedModal: true })
            })
        }
      })
      .catch((error) => {
        console.log("2error...", error.response)
        if (error.response.status == '401') {
          this.setState({ loginCheckMessage: false, loginErrorMessage: true, loginFailedModal: true })
        } else {
          this.setState({ loginCheckMessage: false, networkErrorMessage: true, loginFailedModal: true })
        }
      })
  }

  setUsername(username: any) {
    this.setState({ username: username })
  }
  setPassword(password: any) {
    this.setState({ password: password })
  }
  closeLoginFailedModal() {
    this.setState({ loginFailedModal: false, networkErrorMessage: false, loginErrorMessage: false, serverErrorMessage: false })
  }
  testSample() {
    this.props.testActions.testSample('Kashyap');
  }
  render() {
    // console.log("this.props.testReducer.name.....",this.props.testReducer);
    return (
      <Container style={{ backgroundColor: '#000000' }}>
        <View style={{ backgroundColor: '#000000' }}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 25, padding: 10 }}>EtherSec</Text>
        </View>
        <Image source={require('../assets/ESI_Logo.png')} style={styles.image}></Image>

        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
          {this.state.loginCheckMessage && <Text style={{ color: '#ffffff', padding: 10, fontWeight: 'bold' }}>Checking Login Credentials...</Text>}
          {this.state.loginErrorMessage && <Text style={{ color: '#FF0000', padding: 10, fontWeight: 'bold' }}>Login Failed: Invalid username and/or password</Text>}
          {this.state.networkErrorMessage && <Text style={{ color: '#FF0000', padding: 10, fontWeight: 'bold' }}>Login Failed: Please check your network connection</Text>}
          <View style={{ backgroundColor: '#ffffff', borderRadius: 5 }}>
            <Item style={styles.formItem}>
              <Input autoCapitalize='none' placeholderTextColor={"#c8c8c8"} style={styles.formItemInput}
                onChangeText={(text) => this.setUsername(text)}
                placeholder='Username' keyboardType='email-address' maxLength={256} />
            </Item>
          </View>

          <View style={{ backgroundColor: '#ffffff', borderRadius: 5, }}>
            <Item style={styles.formItem}>
              <Input placeholderTextColor={"#c8c8c8"} style={styles.formItemInput} secureTextEntry={true}
                onChangeText={(text) => this.setPassword(text)}
                placeholder='Password' keyboardType='default' maxLength={16} />
            </Item>
          </View>

          <TouchableOpacity disabled={(this.state.username.length > 0 && this.state.password.length > 0) ? false : true} style={styles.button}
            onPress={() => this.navigateToNotificationList()}>
            <Text style={[styles.buttonText, { color: (this.state.username.length > 0 && this.state.password.length > 0) ? '#ffffff' : '#606060' }]}>Login</Text>
          </TouchableOpacity>

          <View style={{ margin: 30 }}>
            <Text style={{ color: '#ffffff', fontSize: 16 }}>To receive detection alerts,please login with your system username and password</Text>
          </View>
        </View>
        <Modal visible={this.state.loginFailedModal} transparent={true} animationType={'none'}>
          {this.state.loginErrorMessage &&
            <View style={styles.loginFailedModal}>
              <Text style={{ fontSize: 19, fontWeight: 'bold' }}>Login Failed: Invalid username and/or password</Text>
              <Button style={{ marginTop: 40 }} transparent onPress={() => this.closeLoginFailedModal()}>
                <Text style={{ color: '#009999', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
              </Button>
            </View>}
          {this.state.networkErrorMessage &&
            <View style={styles.loginFailedModal}>
              <Text style={{ fontSize: 19, fontWeight: 'bold' }}>Login Failed: Please check your network connection</Text>
              <Text style={{ fontSize: 17, marginTop: 20 }}>Unable to establish a connection to the remote server, please check your network connection.</Text>
              <Button style={{ marginTop: 20 }} transparent onPress={() => this.closeLoginFailedModal()}>
                <Text style={{ color: '#009999', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
              </Button>
            </View>}
          {this.state.serverErrorMessage &&
            <View style={styles.loginFailedModal}>
              <Text style={{ fontSize: 19, fontWeight: 'bold' }}>Login Failed: Server error,contact applcation support</Text>
              <Text style={{ fontSize: 17, marginTop: 20 }}>Message: 'An error has occurred'</Text>
              <Button style={{ marginTop: 20 }} transparent onPress={() => this.closeLoginFailedModal()}>
                <Text style={{ color: '#009999', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
              </Button>
            </View>}
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
      // fontFamily: "CeraPro-Medium",
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
          // fontFamily: "CeraPro-Regular", 
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
     image:{height:150,width:150,margin:15,alignSelf:'center'},
  });

const mapStateToProps = ({ testReducer }) => {
  return {
    testReducer: testReducer
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    testActions: bindActionCreators(testActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

