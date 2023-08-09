import { sendRequest } from "../../common/sendRequest";
export default function emprunt(oid, token) {
    sendRequest('/action', 'POST', { token: token }, () => { }, () => { }, { oid: oid, action_id: 1 }); //changing action's status
    sendRequest('/objet/' + oid.toString(), 'PATCH', { token: token }, () => { }, () => { }, { dispo: 1 }); //changing object's disponibility 
}



