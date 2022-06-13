import {CURRENTLINE, ORANGE, PINK} from "../../helpers/colors";
import Contact from "./Contact";
import Spinner from "../Spinner";
import {Link} from "react-router-dom";


const Contacts = ({contacts, loading, confirmDelete}) => {
    return (
        <>
            <section className="container">
                <div className="grid">
                    <div className="row pt-2">
                        <div className="col">
                            <p className="h3 float-end">
                                <Link to="/contacts/add"
                                      style={{backgroundColor: PINK}}
                                      className="btn mx-2">
                                    ساخت مخاطب جدید
                                    <i className="fa fa-plus-circle mx-2"/>
                                </Link>

                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {loading ? <Spinner/> : (
                <section className="container">
                    <div className="row">
                        {
                            contacts.length > 0 ? contacts.map(c => (
                                    <Contact key={c.id}
                                             confirmDelete={() => confirmDelete(c.id, c.fullname)}
                                             contact={c}/>
                                )) :
                                (
                                    <div className="text-center py-5" style={{backgroundColor: CURRENTLINE}}>
                                        <p className="h3" style={{color: ORANGE}}>
                                            مخاطب یافت نشد !
                                        </p>
                                        <img src={require("../../assets/no-found.gif")} alt="پیدا نشد"
                                             className="w-25"/>
                                    </div>
                                )
                        }
                    </div>
                </section>
            )}
        </>
    )
}

export default Contacts;