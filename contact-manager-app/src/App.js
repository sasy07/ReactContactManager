import './App.css';
import {
    Contacts,
    Navbar,
    AddContact,
    Contact,
    EditContact,
    ViewContact,
    SearchContact,
    Spinner
} from "./components";
import {useState} from "react";

const App = () => {

    const [getContacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="App">
            <Navbar/>
            <Contacts contacts={getContacts} loading={loading}/>
        </div>
    );
}

export default App;
