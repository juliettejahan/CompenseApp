import { sendRequest } from "../../common/sendRequest";
export default function Accepter(oid, token) {
    sendRequest(`/action/${oid}/accept`, 'PATCH', { token: token }, () => { }, () => { }); //changing action's status
    sendRequest(`/objet/${oid}`, 'PATCH', { token: token }, () => { }, () => { }, { dispo: 2 }); //changing object's disponibility 
}
;


