import "./App.css";
import {Route, Routes, Navigate, useNavigate} from "react-router-dom";
import {AddContact, Contacts, EditContact, Navbar, ViewContact} from "./components";
import {useState, useEffect} from "react";
import {createContact, deleteContact, getAllContacts, getAllGroups} from "./services/contactService";

import {confirmAlert} from 'react-confirm-alert'
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";
import contact from "./components/Contacts/Contact";
import {ContactContext} from "./context/contactContext";

const App = () => {
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([])
    const [groups, setGroups] = useState([]);
    const [contact, setContact] = useState({})
    const [contactQuery, setContactQuery] = useState({text: ""});
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const {data: contactsData} = await getAllContacts();
                const {data: groupsData} = await getAllGroups();
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
            const {status, data} = await createContact(contact);//get new contact and copy to data
            setLoading(true);
            /*
            * NOTE (Show New Contact)
            *   1- Rerender -> forceRender , setForceRender
            *   2- setContact(data)  (OK)
            */
            debugger;
            if (status === 201) {
                const allContacts = [...contacts, data];//Clone contacts and copy contacts and data(new contact) to allContacts

                setContacts(allContacts);
                setFilteredContacts(allContacts);

                setContact({});
                setLoading((prevLoading) => !prevLoading);
                navigate("/contacts");
            }
        } catch (error) {
            console.log(error.message)
            setLoading((prevLoading) => !prevLoading);
        }
    }


    const onContactChange = (event) => {
        setContact({
            ...contact,
            [event.target.name]: event.target.value
        });
    }

    const confirmDelete = (contactId, contactFullname) => {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div dir='rtl' style={{
                        backgroundColor: CURRENTLINE,
                        border: `1px solid ${PURPLE}`,
                        borderRadius: "1em"
                    }}
                         className={"p-4"}>
                        <h1 style={{color: YELLOW}}>پاک کردن مخاطب</h1>
                        <p style={{color: FOREGROUND}}>
                            مطمئنی میخوای {contactFullname} رو پاک کنی
                        </p>
                        <button
                            onClick={() => {
                                removeContact(contactId);
                                onClose();
                            }}
                            className="btn mx-2"
                            style={{ backgroundColor: PURPLE }}
                        >
                            مطمئن هستم
                        </button>
                        <button
                            onClick={onClose}
                            className="btn"
                            style={{ backgroundColor: COMMENT }}
                        >
                            انصراف
                        </button>
                    </div>
                )
            }
        })
    }

    const removeContact = async (contactId) => {
        try {
            setLoading(true);
            const res = await deleteContact(contactId)
            if (res) {
                const {data: contactsData} = await getAllContacts()
                setContacts(contactsData)
                setLoading(false)
            }
        } catch (err) {
            console.log(err.message)
            setLoading(false)
        }
    }

    const contactSearch = (event) => {
        setContactQuery({...contactQuery, text: event.target.value})
        const allContacts = contacts.filter((contact) => {
            return contact.fullname.toLowerCase()
                .includes(event.target.value.toLowerCase());
        })
        setFilteredContacts(allContacts)
    }

    return (
        <ContactContext.Provider value={{
            loading,
            setLoading,
            contact,
            setContact,
            contactQuery,
            contacts,
            filteredContacts,
            groups,
            onContactChange,
            deleteContact: confirmDelete,
            createContact: createContactForm,
            contactSearch
        }}>
            <div className="App">
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Navigate to="/contacts"/>}/>
                    <Route
                        path="/contacts"
                        element={<Contacts/>}
                    />
                    <Route path="/contacts/add"
                           element={<AddContact/>}/>
                    <Route path="/contacts/:contactId" element={<ViewContact/>}/>
                    <Route path="/contacts/edit/:contactId"
                           element={<EditContact/>}/>
                </Routes>
            </div>
        </ContactContext.Provider>
    );
};

export default App;
