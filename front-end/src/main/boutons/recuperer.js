import { sendRequest } from "../../common/sendRequest";
export default function Recuperer(oid, token) {
    sendRequest(`/action/${oid}/take`, 'PATCH', { token: token }, () => { }, () => { }); //changing action's status
    sendRequest(`/objet/${oid}`, 'PATCH', { token: token }, () => { }, () => { }, { dispo: 3 });//changing object's disponibility 
}



