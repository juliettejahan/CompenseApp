import { encode } from 'base-64';
import { baseUrl } from './const';

/**
 *
 * @param {URL} url
 * @param {string} method
 * @param {Headers} headers
 * @param {?string} body
 * @param {?(response:int, data:?string) => {}} callback Data may be null when the response is successful
 * @param {?(e:error) => {}} failureCallback
 */
function send(url, method, headers, body, callback, failureCallback) {
    console.log(`Requesting ${method} ${url.toString()}`)

    fetch(url, {
        method: method,
        headers: headers,
        body: body
    })
        .then((response) => {
            const isCorrect = response.status >= 200 && response.status < 300;
            if (!isCorrect) {
                alert(`Unexpected response code ${response.status} for query ${method} to url '${url.toString()}'`);
            }
            const shouldDeserialize = method == 'GET' && response.status == '200';
            if (!shouldDeserialize) {
                return callback(response.status, null);
            }
            return response.json().then(json => callback(response.status, json));
        })
        .catch(
            (e) => { 
                alert('Something went wrong ' + e.message);
                if (failureCallback != null) {
                    failureCallback(e);
                }
            }
        )
}

/**
 *
 * @param {string} route
 * @param {string} method GET|POST|DELETE|PATCH
 * @param {{token:string}|{login:string,password:string}|null} credentials Credentials can either be null,
 * a set of {login, password}, or a {token} which will be used for bearer token.
 * @param {?(response:int, data:?string) => {}} callback Callback function called when the call is finished.
 * The first parameter is the status code, the second one the data associated with the response.
 * @param {?(e:error) => {}} failureCallback called when the request fails. The parameter is the error object
 * @param {?Object.<string, string>} parameters Dictionaries of key / values to pass as parameters to the call.
 * POST body is JSON.
 */
export function sendRequest(route, method, credentials, callback, failureCallback, parameters) {
    //console.log("AAA" + Object.keys(credentials))
    const url = new URL(route, baseUrl)
    console.log(baseUrl);

    const headers = new Headers()
    if (credentials != null) {
        if (credentials.login != null && credentials.password != null) {
            headers.append('Authorization', 'Basic ' + encode(credentials.login + ':' + credentials.password));
        } else if (credentials.token != null) {
            console.log('youpi')
            headers.append('Authorization', `Bearer ${credentials.token}`)
        } else {
            console.log("BB" + Object.keys(credentials)+credentials.token);
            throw new Error(`Bad format for ${credentials}`);
        }
    }

    var body = null
    if (parameters != null) {
        if (method == 'GET') {
            url.search = new URLSearchParams(parameters);
        } else if (method == 'POST') {
            // POST request needs a body with a JSON
            headers.append('Content-Type', 'application/json')
            body = JSON.stringify(parameters)
        } else if (method == 'PATCH') {
            // POST request needs a body with a JSON
            headers.append('Content-Type', 'application/json')
            body = JSON.stringify(parameters)
        }
    }

    send(url, method, headers, body, callback, failureCallback)
}

export function sendRequestImage(route, method, credentials, callback, failureCallback, imageName, imageContent) {
    const url = new URL(route, baseUrl)
    console.log(baseUrl);

    const headers = new Headers()
    if (credentials != null) {
        if (credentials.login != null && credentials.password != null) {
            headers.append('Authorization', 'Basic ' + encode(credentials.login + ':' + credentials.password));
        } else if (credentials.token != null) {
            headers.append('Authorization', `Bearer ${credentials.token}`)
        } else {
            throw new Exception(`Bad format for ${credentials}`);
        }
    }

    var body = null
    console.log("callback:",callback)
    if (imageContent != null) {
        if (method == 'GET') {
            url.search = new URLSearchParams(parameters);
        } else if (method == 'POST') {
            // POST request needs a body with a JSON
            headers.append('Content-Type', 'application/json')
            //console.log('imageName>>>', encode(imageName).substring(0,50))
            
            body = {"fileName":imageName, "fileData":(imageContent)}
            console.log('imageContent>>>', encode(imageContent).substring(0,50))
            body = JSON.stringify(body) //JSON.stringify(parameters)
            //console.log("body:",body)
        }
    }

    send(url, method, headers, body, callback, failureCallback)
}