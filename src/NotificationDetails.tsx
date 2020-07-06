
import React, {Component} from 'react';
import { StyleSheet,Text, View,ScrollView, Platform, TouchableOpacity, Dimensions, Modal, BackHandler, Linking} from 'react-native';
import {Item,Icon,Input,Button,Toast, Title, Left, Right,Header, Card, Footer, FooterTab, Container, CheckBox} from 'native-base'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface  Props extends NavigationScreenProp <void>{
    navigation: NavigationScreenProp<any, any>;
  }
  
  interface State{
    navigationParams:any,
    menuModal:boolean,
    tickToConfirm:boolean,
    confirmationModal:boolean,
  }

class NotificationDetails extends Component<Props, State> {
    constructor(props:any) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state={
            navigationParams:null,
            menuModal:false,
            tickToConfirm:false,
            confirmationModal:false,
    }
  }

    componentWillMount(){
      // this.getNavigationParams();
    }
    getNavigationParams(){
      // if(this.props.navigation.state.params != undefined){
        let initData = this.props.navigation.state.params.initData;
        this.setState({navigationParams:initData})
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
  logout(){
    this.props.navigation.navigate('Login')
  }
  openConfirmationModal(){
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
  Linking.openURL("https://www.myethersec.com/SafeServe/ServerPhP/UI/FrontPages/MyEtherSecFrontPage.php")
}

    render(){
        return(
            <Container>
                <NavigationEvents
                    onWillFocus={payload => {
                      BackHandler.addEventListener("hardwareBackPress",this.handleBackButtonClick); }}/>
                 <Header style={styles.header}>
                        <Left style={styles.headerLeft}>
                            <Text style={{color:'#ffffff',fontSize:20,}}>Soaker</Text>
                            <Text style={{color:'#A9A9A9',fontSize:16}}>17:22-Aug 13,2019</Text>
                        </Left>
                        <Right style={styles.headerRight}>
                            <MaterialCommunityIcons name="refresh" onPress={()=>this.refreshPage()} style={styles.icons}> </MaterialCommunityIcons>
                            <MaterialCommunityIcons name="delete" style={styles.icons}> </MaterialCommunityIcons>
                            <MaterialCommunityIcons name="dots-vertical" onPress={()=>this.openMenuModal()} style={styles.icons}> </MaterialCommunityIcons>
                        </Right>
                    </Header>

         <ScrollView>
                    <View style={styles.container}>

                    <View style={styles.imgView}>
                        {/* <Text style={{color:'lightblue'}}>Message:</Text>
                        <Text style={styles.text}>Detection ALert</Text> */}
                      </View>

                      <View style={styles.view}>
                        <Text style={styles.textTitle}>Message:</Text>
                        <Text style={styles.textDesc}>NetworkTest</Text>
                      </View>
                    
                      <View style={styles.view}>
                        <Text style={styles.textTitle}>From:</Text>
                        <View style={{flexDirection:'column'}}>
                        <View>
                          <Text style={styles.textDesc}>Dummy System</Text>
                          <Text style={styles.textDesc}>Camera: TestCam_1</Text>
                        </View>
                           {/* <Text style={styles.text}>Camera:4</Text> */}
                        </View>
                      </View>

                      <View style={styles.view}>
                        <Text style={styles.textTitle}>Alarm:</Text>
                          <Text style={styles.textDesc}>11:23 - Jul 05,2020</Text>
                      </View>

                      <View style={styles.view}>
                        <Text style={styles.textTitle}>Status:</Text>
                        <View style={{flexDirection:'column',paddingRight:11}}>
                           <Text style={styles.textDesc}>11:23 - Jul 05,2020(received)</Text>
                           <Text style={styles.textDesc}>11:30 - Jul 05,2020(read)</Text>
                        </View>
                      </View>

                  </View> 
            </ScrollView>

            <View style={{  backgroundColor:'#000000',}}>
               <TouchableOpacity  style={styles.button} onPress={()=>this.loginToSystem()}>
                     <Text style={[styles.buttonText]}>Login to System</Text>
                  </TouchableOpacity>
            </View>
                 
            <Modal visible={this.state.menuModal} transparent={true} animationType={'none'}>
                    <View style={styles.menuModal}>
                        <Button transparent onPress={()=>this.loginToSystem()}>
                            <Text style={styles.btnText}>Login to System</Text>
                        </Button>
                        <Button transparent onPress={()=>this.openConfirmationModal()}>
                            <Text style={styles.btnText}>Logout</Text>
                        </Button>
                    </View>
             </Modal>

             <Modal visible={this.state.confirmationModal} transparent={true} animationType={'none'}>
                    <View style={styles.confirmationModal}>
                        <View>
                            <Text style={styles.confirmText}>Are you sure you want to logout?</Text>
                            <Button transparent style={{paddingTop:25}} onPress={()=>this.toggleCheckbox()}>
                             <View style={{flexDirection:"row"}}>
                                <Left style={{flex:3}}>
                                    <Text style={{color:'#808080'}}>Tick to confirm you wish to logout and no longer receive alert messages.</Text>
                                </Left>
                                <Right style={{flex:0.5,paddingRight:12}}>
                                    <CheckBox checked={this.state.tickToConfirm} onPress={()=>this.toggleCheckbox()}></CheckBox>
                                </Right>
                            </View>
                           </Button> 
                           <View style={{flexDirection:'column',paddingTop:10}}>
                                <Button transparent style={{alignSelf:'flex-end'}} onPress={()=>this.logout()} disabled={!this.state.tickToConfirm}>
                                    <Text style={{color:this.state.tickToConfirm ? '#009999' : '#C0C0C0',fontWeight:'bold'}}>YES</Text>
                                </Button>
                                <Button transparent style={{alignSelf:'flex-end'}} onPress={()=>this.logout()} disabled={!this.state.tickToConfirm}>
                                    <Text style={{color:this.state.tickToConfirm ? '#009999' : '#C0C0C0',fontWeight:'bold'}}>YES AND DELETE EXISTING MESSAGES</Text>
                                </Button>
                                <Button transparent style={{alignSelf:'flex-end'}} onPress={()=>this.closeConfirmationModal()} >
                                    <Text style={{color:'#009999',fontWeight:'bold'}}>CANCEL</Text>
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
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    imgView:{height:350,backgroundColor:'#383838',margin:3,marginTop:6,padding:5,borderRadius:5},
    icons:{fontSize:25 ,color:'#ffffff',paddingLeft:10},
    header:{
      backgroundColor:'#181818',
      height:60,
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
    top:Dimensions.get('window').height/3
       },
       confirmText:{
        fontSize:16,fontWeight:'bold'
    },
  });

export default NotificationDetails

