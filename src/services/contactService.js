import axios from "axios";
const SERVER_URL = "http://localhost:9000";

// @desc Get All Contacts
// @route Get http://localhost:9000/contacts
export const getAllContacts = ()=>{
    const url = `${SERVER_URL}/contacts`
    return axios.get(url);
}

// @desc Get Contact with ID
// @route Get http://localhost:9000/contacts/:contactId
export const getContact =(contactId)=>{
    const url = `${SERVER_URL}/contacts/${contactId}`
    return axios.get(url);
}

// @desc Get All Groups
// @route Get http://localhost:9000/groups
export const getAllGroups= ()=>{
    const url = `${SERVER_URL}/groups`
    return axios.get(url);
}

// @desc Get Group with ID
// @route Get http://localhost:9000/groups/:groupId
export const getGroup =(groupsId)=>{
    const url = `${SERVER_URL}/groups/${groupsId}`
    return axios.get(url);
}

// @desc Add New Contact
// @route Post http://localhost:9000/contacts
export const createContact =(contact)=>{
    const url = `${SERVER_URL}/contacts`
    return axios.post(url,contact);
}

// @desc Edit Contact
// @route Put http://localhost:9000/contacts/:contactId
export const updateContact =(contact,contactId)=>{
    const url = `${SERVER_URL}/contacts/${contactId}`
    return axios.put(url,contact);
}

// @desc Delete Contact
// @route Delete http://localhost:9000/contacts/:contactId
export const deleteContact =(contactId)=>{
    const url = `${SERVER_URL}/contacts/${contactId}`
    return axios.delete(url);
}