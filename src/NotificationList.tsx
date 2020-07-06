
import React, {Component} from 'react';
import { StyleSheet,Text, View,ScrollView, Platform, TouchableOpacity, Alert, Modal,ToastAndroid, Dimensions, Linking} from 'react-native';
import {Item,Input,Toast, Title, Header, Left, Right, Body, Button, CheckBox} from 'native-base'
import { NavigationScreenProp } from 'react-navigation';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

interface  Props extends NavigationScreenProp <void>{
    navigation: NavigationScreenProp<any, any>;
  }
  
  interface State{
      menuModal:boolean,
      confirmationModal:boolean,
      tickToConfirm:boolean,
      modal:any,
      navigationParams:any,
  }

class NotificationList extends Component<Props, State> {
    constructor(props:any) {
        super(props);
        this.state={
         menuModal:false,
         confirmationModal:false,
         tickToConfirm:false,
         modal:null,
         navigationParams:null,
      }
    }

    componentWillMount(){
        // this.getNavigationParams();
      }
     
    getNavigationParams(){
        if(this.props.navigation.state.params != undefined){
          let initData = this.props.navigation.state.params.initData;
          this.setState({navigationParams:initData})
          console.log("details.........",initData)
        }
        else{
          this.state.navigationParams = null
        }
       }

    navigateToNotificationDetails(){
        this.props.navigation.navigate('NotificationDetails')
    }
    openMenuModal(){
        this.setState({
            menuModal:true
        })
    }
    openConfirmationModal(modalData:any){
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
    showToast(){
        this.setState({
            confirmationModal:false,tickToConfirm:false
        })
        ToastAndroid.show('0: Messages Deleted',ToastAndroid.SHORT)
    }
    logout(){
        this.props.navigation.navigate('Login')
    }
    loginToSystem(){
        Linking.openURL("https://www.myethersec.com/SafeServe/ServerPhP/UI/FrontPages/MyEtherSecFrontPage.php")
    }

    render(){
        return(
            <ScrollView>
                    <Header style={styles.header}>
                        <Left style={styles.headerLeft}>
                            <Text style={{color:'#ffffff',fontSize:20,}}>Kashyap Gadhave</Text>
                            <Text style={{color:'#A9A9A9',fontSize:16,}}>231(230 unread)</Text>
                        </Left>
                        <Right style={styles.headerRight}>
                            <MaterialCommunityIcons name="home" style={styles.icons}> </MaterialCommunityIcons>
                            <MaterialCommunityIcons onPress={()=>this.openMenuModal()} name="dots-vertical" style={styles.icons}> </MaterialCommunityIcons>
                        </Right>
                    </Header>
                 {/* <View style={{backgroundColor:'#383838'}}> */}
            {/* <TouchableOpacity onPress={() => this.navigateToNotificationDetails(this.state.navigationParams)}>
                    <View style={{flexDirection:'row',height:60,backgroundColor:'#383838', borderBottomColor:'#ffffff',borderBottomWidth:0.4}}>
                        <Left style={{flex:1}}>
                             <MaterialCommunityIcons name="bell-alert" style={{fontSize:38 ,color:'#ffffff'}}> </MaterialCommunityIcons>
                        </Left>
                        <Body style={{flex:3,flexDirection:'column',flexWrap:'wrap'}}>  
                              <Text style={styles.text}>{this.state.navigationParams.systemId}</Text>
                            <Text style={styles.subText}>Camera:{this.state.navigationParams.cameraId}</Text>
                        </Body>
                        <Right style={{flex:1.5}}>
                             <Text style={{color:'#1E90FF',paddingRight:12,fontSize:16,fontWeight:'bold'}}>{this.state.navigationParams.epochTimeMs}</Text>
                        </Right>
                    </View>
             </TouchableOpacity> */}
             <TouchableOpacity onPress={() => this.navigateToNotificationDetails()}>
                    <View style={{flexDirection:'row',height:60,backgroundColor:'#E0E0E0',borderBottomColor:'#ffffff',borderBottomWidth:0.4}}>
                        <Left style={{flex:1}}>
                           <MaterialCommunityIcons name="bell-alert" style={{fontSize:38 ,color:'#000000'}}> </MaterialCommunityIcons>
                        </Left>
                        <Body style={{flex:3,flexDirection:'column',flexWrap:'wrap'}}>  
                            <Text style={styles.text1}>Dummy System</Text>
                            <Text style={styles.subText1}>Camera:TestCam_1</Text>
                        </Body>
                        <Right style={{flex:1.5}}>
                            <Text style={{color:'#000000',paddingRight:12,fontSize:16,fontWeight:'bold'}}>17:22</Text>
                        </Right>
                    </View>
             </TouchableOpacity>
                {/* </View> */}

                <Modal visible={this.state.menuModal} transparent={true} animationType={'none'}>
                    <View style={styles.menuModal}>
                        <Button transparent onPress={()=>this.loginToSystem()}>
                            <Text style={styles.buttonText}>Login to System</Text>
                        </Button>
                        <Button transparent onPress={()=>this.openConfirmationModal('deleteAll')}>
                            <Text style={styles.buttonText}>Delete All</Text>
                        </Button>
                        <Button transparent onPress={()=>this.openConfirmationModal('deleteAllRead')}>
                            <Text style={styles.buttonText}>Delete All Read</Text>
                        </Button>
                        <Button transparent onPress={()=>this.openConfirmationModal('logout')}>
                            <Text style={styles.buttonText}>Logout</Text>
                        </Button>
                    </View>
                </Modal>

                <Modal visible={this.state.confirmationModal} transparent={true} animationType={'none'}>
                    <View style={styles.confirmationModal}>
                        {this.state.modal == 'deleteAll' ? <Text style={styles.confirmText}>Are you sure you want to delete all messages?</Text> : null}
                        {this.state.modal == 'deleteAllRead' ? <Text style={styles.confirmText}>Are you sure you want to delete all read messages?</Text> : null}
                        {this.state.modal == 'logout' ?
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
                        </View> :
                        
                        <View>
                            <Button transparent onPress={()=>this.toggleCheckbox()}>
                            <View style={{flexDirection:"row"}}>
                                <Left>
                                    <Text style={{color:'#808080'}}>Tick to confirm</Text>
                                </Left>
                                <Right style={{paddingRight:12}}>
                                    <CheckBox checked={this.state.tickToConfirm} onPress={()=>this.toggleCheckbox()}></CheckBox>
                                </Right>
                            </View>
                            </Button> 
                            <View style={{flexDirection:'row'}}>
                                <Left>
                                    <Button transparent onPress={()=>this.closeConfirmationModal()}>
                                        <Text style={{color:'#009999',fontWeight:'bold'}}>CANCEL</Text>
                                    </Button>
                                </Left>
                                <Right>
                                    <Button transparent onPress={()=>this.showToast()} disabled={!this.state.tickToConfirm}>
                                        <Text style={{color:this.state.tickToConfirm ? '#009999' : '#C0C0C0',fontWeight:'bold'}}>YES</Text>
                                    </Button>
                                </Right>
                            </View>
                        </View>}
                        
                    </View>
                </Modal>

              </ScrollView>
             
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
        height:60,
        borderBottomColor:'#ffffff',borderBottomWidth:0.4
    },
    headerLeft: {
        flex: 2,
        flexDirection: 'column'
    },
    headerRight: {
        flex: 2,
        flexDirection: 'row'
    },
    text:{
        color:'#ffffff',fontSize:24,fontWeight:'bold'
    },
    subText:{color:'#ffffff',fontSize:19,fontWeight:'bold'},
    text1:{
        color:'#000000',fontSize:24,fontWeight:'bold',fontStyle:'italic'
    },
    subText1:{ color:'#000000',fontSize:19,fontWeight:'bold',fontStyle:'italic'},
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
    buttonText:{
        fontSize:16,paddingLeft:15
    },
    confirmText:{
        fontSize:16,fontWeight:'bold'
    },
  });

export default NotificationList

