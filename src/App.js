import "./App.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { AddContact, Contacts, EditContact, Navbar, ViewContact } from "./components";
import { useState, useEffect } from "react";
import { createContact, getAllContacts, getAllGroups } from "./services/contactService";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const [getContacts, setContacts] = useState([]);
  const [getGroups, setGroups] = useState([]);
  const [getContact, setContact] = useState({
    fullname: "",
    photo: "",
    mobile: "",
    email: "",
    job: "",
    group: ""
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: contactsData } = await getAllContacts();
        const { data: groupsData } = await getAllGroups();
        setContacts(contactsData);
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

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/contacts" />} />
        <Route
          path="/contacts"
          element={<Contacts contacts={getContacts}
            loading={loading} />}
        />
        <Route path="/contacts/add"
          element={<AddContact loading={loading}
            setContactInfo={setContactInfo}
            contact={getContact}
            createContactForm={createContactForm}
            groups={getGroups} />} />
        <Route path="/contacts/:contactId" element={<ViewContact />} />
        <Route path="/contacts/edit/:contactId" element={<EditContact />} />
      </Routes>
    </div>
  );
};

export default App;
