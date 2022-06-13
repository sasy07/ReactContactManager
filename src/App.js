import "./App.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { AddContact, Contacts, EditContact, Navbar, ViewContact } from "./components";
import { useState, useEffect } from "react";
import {createContact, deleteContact, getAllContacts, getAllGroups} from "./services/contactService";

import {confirmAlert} from 'react-confirm-alert'
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";
import contact from "./components/Contacts/Contact";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const [getContacts, setContacts] = useState([]);
  const [getFilteredContacts , setFilteredContacts] =useState([])
  const [getGroups, setGroups] = useState([]);
  const [getContact, setContact] = useState({
    fullname: "",
    photo: "",
    mobile: "",
    email: "",
    job: "",
    group: ""
  })
  const [query , setQuery]=useState({text:""});
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: contactsData } = await getAllContacts();
        const { data: groupsData } = await getAllGroups();
        setContacts(contactsData);
        setFilteredContacts(contactsData);
        setGroups(groupsData);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const navigate = useNavigate();
  const createContactForm = async (event) => {
    event.preventDefault();
    try {
      const { status } = await createContact(getContact);
      if (status === 201) {
        setForceRender(!forceRender);
        setContact({});
        navigate("/contacts");
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: contactsData } = await getAllContacts();
        setContacts(contactsData);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [forceRender])

  const setContactInfo = (event) => {
    setContact({
      ...getContact,
      [event.target.name]
        : event.target.value
    });
  }

  const confirm=(contactId , contactFullname)=>{
    confirmAlert({
      customUI:({onClose})=>{
        return(
            <div dir = 'rtl' style={{
              backgroundColor:CURRENTLINE ,
              border :`1px solid ${PURPLE}`,
              borderRadius :"1em"
            }}
                 className={"p-4"}>
              <h1 style={{color:YELLOW}}>پاک کردن مخاطب</h1>
              <p style={{color:FOREGROUND}}>
                مطمئنی میخوای {contactFullname} رو پاک کنی
              </p>
              <button onClick={()=>{
                removeContact(contactId);
                onClose();
              }}
              className="btn mx-2" style={{backgroundColor:COMMENT}}>مطمئن  هستم</button>
              <button onClick={onClose} className={"btn"} >
                انصراف
              </button>
            </div>
        )
      }
    })
  }

  const removeContact = async (contactId)=>{
   try {
      setLoading(true);
      const res = await deleteContact(contactId)
      if(res){
        const {data : contactsData}=await getAllContacts()
        setContacts(contactsData)
        setLoading(false)
      }
    }catch (err){
      console.log(err.message)
      setLoading(false)
    }
  }

const contactSearch = (event) => {
  setQuery({...query , text: event.target.value})
  const allContacts=getContacts.filter((contact)=>{
    return contact.fullname.toLowerCase()
        .includes(event.target.value.toLowerCase());
  })
  setFilteredContacts(allContacts)
}

  return (
    <div className="App">
      <Navbar query={query} search={contactSearch}/>
      <Routes>
        <Route path="/" element={<Navigate to="/contacts" />} />
        <Route
          path="/contacts"
          element={<Contacts contacts={getFilteredContacts}
            confirmDelete={confirm}
            loading={loading} />}
        />
        <Route path="/contacts/add"
          element={<AddContact loading={loading}
            setContactInfo={setContactInfo}
            contact={getContact}
            createContactForm={createContactForm}
            groups={getGroups} />} />
        <Route path="/contacts/:contactId" element={<ViewContact />} />
        <Route path="/contacts/edit/:contactId"
               element={<EditContact
               forceRender={forceRender}
               setForceRender={setForceRender}/>} />
      </Routes>
    </div>
  );
};

export default App;
