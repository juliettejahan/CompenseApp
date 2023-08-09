import { sendRequest } from "../../common/sendRequest";
export default function Refuser(oid, token) {
    sendRequest(`/action/${oid}`, 'DELETE', { token: token }, () => { }, () => { }); //changing action's status
    sendRequest(`/objet/${oid}`, 'PATCH', { token: token }, () => { }, () => { }, { dispo: 0 });//changing object's disponibility 
}



