import { sendRequest } from "../../common/sendRequest"; // givin back an object
export default function Rendu(oid, token) {
    sendRequest(`/action/${oid}`, 'DELETE', { token: token }, () => { }, () => { }); //changing action's status
    sendRequest(`/objet/${oid}`, 'PATCH', { token: token }, () => { }, () => { }, { dispo: 0 });//changing object's disponibility 
}


