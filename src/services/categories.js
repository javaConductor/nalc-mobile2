import React from 'react';
import {AsyncStorage} from 'react-native';
import config from '../config';
import storage from '../services/storage';

const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;
const storeAdminsLocally = (admins) => {
    AsyncStorage.setItem()
};
const currentAccessToken = async () => {
    const authInfo = await storage.getAuthInfo();
    console.log(`categories: currentAccessToken(): ${authInfo}`);

    if (!authInfo) return Promise.reject("User Not Authenticated !!");
    if (!authInfo.accessToken) return Promise.reject("User Not Authenticated !!");
    return authInfo.accessToken;
};
export default {

    getCategories: () => {
        return fetch(`${backEndURL}/${config.BACKEND_CATEGORIES_PATH}`)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(`categories: getCategories: ${JSON.stringify(responseJson, null, 2)}`);
                const filtered = responseJson.filter((cat) => {return cat.name.toLowerCase() !== 'uncategorized'});
                console.log(`categories: getCategories filtered: ${JSON.stringify(filtered, null, 2)}`);
                return filtered;
            })
            .catch(( error ) => {
                //log and rethrow
                console.log(`categories: getCategories filtered: ${JSON.stringify(error, null, 2)}`);
                throw error;
            });
    },
    addCategory: (categoryData) => {
        currentAccessToken().then((accessToken) => {
            console.log(`categories.addCategory: ${JSON.stringify(categoryData)}`);
            return fetch(`${backEndURL}/${config.BACKEND_CATEGORIES_PATH}`, {
                method: 'POST',
                headers: {
                    'x-access-token': accessToken,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...categoryData, id: undefined}),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(`categories.addCategory: ${JSON.stringify(responseJson)}`);
                    return responseJson;
                })
                .catch((error) => {
                    console.error(`categories.addCategory: ERROR: ${JSON.stringify(error)}`);
                    throw error;
                });
        });
    },

    /**
     *
     * @param categoryData
     * @returns {Promise<any>}
     * TODO: Change the backend to return the new list so we don't have to refetch
     */
    updateCategory: (categoryData) => {
        return fetch(`${backEndURL}/${config.BACKEND_CATEGORIES_PATH}/${categoryData.id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...categoryData, id: undefined}),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    removeAdmin: (adminId) => {
        const getAdmins = this.getAdmins;
        console.log(`removeAdmin: ${adminId}`);

        return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}/${adminId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => {
                //console.log(JSON.stringify(resp));

                return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
            })
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(JSON.stringify(responseJson));
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    addAdminPhoto: (adminId, buffer) => {
    },
};