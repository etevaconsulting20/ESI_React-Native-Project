
import React, {Component} from 'react';
import { StyleSheet,Text, View,ScrollView, Platform, TouchableOpacity, Dimensions, Modal, BackHandler, Linking, AsyncStorage, ToastAndroid, Image} from 'react-native';
import {Item,Icon,Input,Button,Toast, Title, Left, Right,Header, Card, Footer, FooterTab, Container, CheckBox} from 'native-base'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Video  from 'react-native-video';
import moment from 'moment';

interface  Props extends NavigationScreenProp <void>{
    navigation: NavigationScreenProp<any, any>;
  }
  
  interface State{
    navigationParams:any,
    menuModal:boolean,
    tickToConfirm:boolean,
    confirmationModal:boolean,
    index:any
  }

class NotificationDetails extends Component<Props, State> {
  _menu = null;
    constructor(props:any) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state={
            navigationParams:null,
            menuModal:false,
            tickToConfirm:false,
            confirmationModal:false,
            index:null
    }
  }

    componentWillMount(){
      this.getNavigationParams();
    }
    getNavigationParams(){
      // if(this.props.navigation.state.params != undefined){
        let initData = this.props.navigation.state.params.initData;
        let index = this.props.navigation.state.params.index;
        this.setState({navigationParams:initData,index:index})
        console.log("details.........",initData)
      // }
      // else{
      //   this.state.navigationParams = null
      // }
     }
     openMenuModal(){
      this.setState({
          menuModal:true
      })
    }
   toggleCheckbox(){
    this.setState({
        tickToConfirm:!this.state.tickToConfirm
    })
    }
  logout(text:any){
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
  openConfirmationModal(){
    this._menu.hide();
    this.setState({
        menuModal:false,confirmationModal:true
    })
  }
  closeConfirmationModal(){
    this.setState({
        confirmationModal:false,tickToConfirm:false
    })
}
handleBackButtonClick(){
  this.props.navigation.navigate('NotificationList');
  return true
}
refreshPage(){
  // window.location.reload(false)
}
componentWillUnmount(){
  BackHandler.removeEventListener("hardwareBackPress",this.handleBackButtonClick);
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
  async showToastAndGoToNavigationList(){
  let dataFromStorage:any
  let notificationData = await AsyncStorage.getItem('notificationData');
  if(notificationData != null){
      dataFromStorage = JSON.parse(notificationData);
     dataFromStorage.splice(this.state.index,1)
      console.log('dataToStorage.after delete..............',dataFromStorage);
      await AsyncStorage.setItem('notificationData',JSON.stringify(dataFromStorage));
      this.props.navigation.navigate('NotificationList');
      ToastAndroid.show('Message Deleted',ToastAndroid.SHORT)
  }
}

    render(){
      console.log(moment().format('hh:mm - MMM D YYYY'));
        return(
            <Container>
                <NavigationEvents
                    onWillFocus={payload => {
                      BackHandler.addEventListener("hardwareBackPress",this.handleBackButtonClick); }}/>
                 <Header style={styles.header}>
                        <Left style={styles.headerLeft}>
                            <Text style={{color:'#ffffff',fontSize:20,fontWeight:'bold'}}>{this.state.navigationParams.systemId}</Text>
                            <Text style={{color:'#A9A9A9',fontSize:16}}>{moment.unix(this.state.navigationParams.dateTimeAlarm/1000).format('hh:mm - MMM D, YYYY' )}</Text>
                        </Left>
                        <Right style={styles.headerRight}>
                            <MaterialCommunityIcons name="refresh" onPress={()=>this.refreshPage()} style={styles.icons}> </MaterialCommunityIcons>
                            <MaterialCommunityIcons name="delete" onPress={()=>this.showToastAndGoToNavigationList()} style={styles.icons}> </MaterialCommunityIcons>
                            <Menu style={styles.menuModal}
                                    ref={this.setMenuRef}
                                    button={ <MaterialCommunityIcons onPress={()=>this.showMenu()} name="dots-vertical" style={styles.icons}> </MaterialCommunityIcons>}>
                                <MenuItem onPress={()=>this.loginToSystem()}>Login to System</MenuItem>
                                <MenuItem onPress={()=>this.openConfirmationModal()}>Logout</MenuItem>
                            </Menu>
                            {/* <MaterialCommunityIcons name="dots-vertical" onPress={()=>this.openMenuModal()} style={styles.icons}> </MaterialCommunityIcons> */}
                        </Right>
                    </Header>

         <ScrollView>
                
                    <View style={styles.container}>

                      <View>
                        <Video style={styles.videoView}
                        //  video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                        //  videoWidth={250}
                        //  videoHeight={250}
                        thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                          source={{ uri:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}}
                          resizeMode={"cover"}
                          controls
                        />
                            {/* <Text style={{color:'lightblue'}}>Message:</Text>
                            <Text style={styles.text}>Detection ALert</Text> */}
                        </View>

                      <View style={styles.view}>
                        <Text style={styles.textTitle}>Message:</Text>
                        <Text style={styles.textDesc}>{this.state.navigationParams.nhMessage}</Text>
                      </View>
                    
                      <View style={styles.view}>
                        <Text style={styles.textTitle}>From:</Text>
                        <View style={{flexDirection:'column'}}>
                        <View>
                          <Text style={styles.textDesc}>{this.state.navigationParams.systemId}</Text>
                          <Text style={styles.textDesc}>Camera: {this.state.navigationParams.cameraId}</Text>
                        </View>
                           {/* <Text style={styles.text}>Camera:4</Text> */}
                        </View>
                      </View>

                      <View style={styles.view}>
                        <Text style={styles.textTitle}>Alarm:</Text>
                          <Text style={styles.textDesc}>{moment.unix(this.state.navigationParams.dateTimeAlarm/1000).format('hh:mm - MMM D, YYYY' )}</Text>
                      </View>

                      <View style={styles.view}>
                        <Text style={styles.textTitle}>Status:</Text>
                        <View style={{flexDirection:'column',paddingRight:11}}>
                           <Text style={styles.textDesc}>{moment.unix(this.state.navigationParams.dateTimeAlarm/1000).format('hh:mm - MMM D, YYYY' )} (received)</Text>
                           <Text style={styles.textDesc}>{this.state.navigationParams.readNotificationTime} (read)</Text>
                        </View>
                      </View>

                  </View> 
                  {/* <Image source={require('../assets/esi_logo.xml')} style={{height:50,width:50}}></Image> */}
                  {/* <Image source={{uri:'D:/NavigationSample/EsiApp/ESI_React-Native-Project/assets/esi_logo.xml'}} style={{height:50,width:50}}></Image> */}
            </ScrollView>

            <View style={{  backgroundColor:'#000000',}}>
               <TouchableOpacity  style={styles.button} onPress={()=>this.loginToSystem()}>
                     <Text style={[styles.buttonText]}>Login to System</Text>
                  </TouchableOpacity>
            </View>
                 
            {/* <Modal visible={this.state.menuModal} transparent={true} animationType={'none'}>
                    <View style={styles.menuModal}>
                        <Button transparent onPress={()=>this.loginToSystem()}>
                            <Text style={styles.btnText}>Login to System</Text>
                        </Button>
                        <Button transparent onPress={()=>this.openConfirmationModal()}>
                            <Text style={styles.btnText}>Logout</Text>
                        </Button>
                    </View>
             </Modal> */}

             <Modal visible={this.state.confirmationModal} transparent={true} animationType={'none'}>
                    <View style={styles.confirmationModal}>
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
                        </View> 
                       
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
    container:{
      backgroundColor:'#000000',
      height: 'auto',
      width: Dimensions.get('window').width,
    },
    videoView:{height:300,backgroundColor:'#383838',margin:3,marginTop:6,padding:5,borderRadius:5},
    icons:{fontSize:25 ,color:'#ffffff',paddingLeft:10},
    header:{
      backgroundColor:'#181818',paddingLeft:15,
      height:65,
      // borderBottomColor:'#ffffff',borderBottomWidth:0.4
  },
  headerLeft: {
      flex: 2,
      flexDirection: 'column'
  },
  headerRight: {
      flex: 2,
      flexDirection: 'row'
  },
  view:{backgroundColor:'#383838',flexDirection:'row',padding:7,margin:2,borderRadius:5,},
  textDesc:{
      color:'#ffffff',fontSize:16,paddingLeft:5,
  },
  textTitle:{color:'#1E90FF',fontWeight:'bold',fontSize:16,},
  button : {
    height: 48,
    borderRadius: 5,
    backgroundColor: "#00BFFF",
    margin:3,
    justifyContent:'center',alignItems:'center',bottom:0
  },
  buttonText:{
    // width: 230,
    height: 24,
    fontFamily: "CeraPro-Medium",
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.41,
    color: "#ffffff",
    textAlign:'center',
    marginLeft:35,
    marginTop:11,
    marginBottom:11
  },
  btnText:{
    fontSize:16,paddingLeft:15
},
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
       confirmText:{
        fontSize:22,fontWeight:'bold'
    },
  });

export default NotificationDetails

