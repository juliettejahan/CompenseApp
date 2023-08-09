import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    //MainView
      cardContainer: {
        flexGrow:1,
        justifyContent:'center',
        marginBottom:8,
      },
      bottomButton: {
        flexShrink:0,
        flexBasis:100,
      },
    //MesActions
      sous_titre: {
        backgroundColor: '#668582',
        fontFamily: "sans-serif-medium",
        color:"beige",
        textAlign:'center',
        fontWeight:"bold",
        fontVariant:"small-caps",
        letterSpacing:1,
        alignContent:'center',
        textShadowColor:"red",
        textShadowOffset:{width: 1, height: 1},
        textShadowRadius:1,
        fontSize: 30,
      },
        
    //ProfileView
      nom: {
        backgroundColor: '#FFFFFF',
        color: '#20232a',
        textAlign: 'center',
        fontSize: 30,
      },
      tout_catalogue: {
        backgroundColor: '#FFFFFF',
        color: '#20232a',
        textAlign: 'center',
        fontSize: 15,
      },
      logo: {
        width: 95,
        height: 95,
        borderRadius:30,
        alignItems: 'flex-end',
      },
    //Notif View
    titleContainer: {
      paddingBottom: 16,
      backgroundColor: '#668582',
      alignItems: 'center',
      width: '100%',
    },
    title: {
      fontSize: 24,
      fontFamily: "sans-serif-medium",
      color:"beige",
      textAlign: 'center',
      fontWeight:"bold",
      bottom:5,
      top:5,
      fontVariant:"small-caps",
      letterSpacing:1,
      textShadowColor:"red",
      textShadowOffset:{width: 1, height: 1},
      textShadowRadius:1,
    },
    //NotifViewItem
    profilePictureNV: {
        width: 70,
        height: 70,
        borderRadius: 30,
    },
    item: {
        backgroundColor: '#7ba39f',
        padding: 10,
        marginVertical: 7,
        marginHorizontal: 20,
      },
    //search.react
      objectRow: {
        flexDirection: 'row',
      },
      incorrectWarning: {
        backgroundColor: '#FF8A80',
        padding: 4,
        borderRadius: 4,
        marginBottom: 4,
      },
      //SearchItemReact
    item_content: {
        fontFamily:'sans-serif-light',
        fontSize:15,
        textTransform: 'capitalize',
    },
    //InfoPersonnel
    profilePicture: {
        width: 24,
        height: 24,
        borderRadius:30,
    },
    ButtonEmprunt: {
        width: 24,
    },
    expertise: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: "sans-serif-medium",
        color:"beige",
        fontWeight:"bold",
        fontVariant:"small-caps",
        letterSpacing:1,
        textShadowColor:"red",
        textShadowOffset:{width: 1, height: 1},
        textShadowRadius:1,
      },  
    perso_data: {
          fontSize: 15,
          fontFamily: "sans-serif",
          color:"beige",
          fontVariant:"old-nums",
          letterSpacing:1,
          fontWeight:"800",
          textShadowColor:"#20232a",
          textShadowOffset:{width: 1, height: 1},
          textShadowRadius:1,
    },
    //ChangeAccount
    titleCA: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: "sans-serif-medium",
        color:"beige",
        fontWeight:"bold",
        fontVariant:"small-caps",
        letterSpacing:1,
        textShadowColor:"red",
        textShadowOffset:{width: 1, height: 1},
        textShadowRadius:1,
        width:'100%',
    },
    inputTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: "sans-serif",
        color:"#2f4a48",
        fontWeight:"normal",
        fontVariant:"small-caps",
    },
    logoCA: {
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius:30,
    },
      inputLabel:{
        textAlign: 'left',
        backgroundColor: '#ff937a',
        fontSize: 20,
        fontFamily: "sans-serif",
        color:"#2f4a48",
        fontWeight:"normal",
        fontVariant:"oldstyle-nums",
        textShadowColor:"beige",
        textShadowOffset:{width: 0.5, height: 0.5},
        textShadowRadius:0.5,
      },
    //CatalogueItem
    default: {  
    color: '#2f4a48',
    textTransform:'capitalize',
    fontSize: 20,
    },
    //AppelExpert
    item_AE: {
        backgroundColor: '#444444',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      buttonRow: {
        flexDirection: 'row',
        flex:1
      },
      button: {
        flex:1,
        padding: 2
      }, 
    //AllUsers
    userRow: {
        flexDirection: 'row',
        backgroundColor: '#828282',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    //AllObjects
    item_AO: {
        backgroundColor: '#ff937a',
        padding: 10,
        marginVertical: 7,
        marginHorizontal: 20,
  },
  //AddObject
  mainContainer: {
    flexGrow:1,
  },
  });
  export default styles;