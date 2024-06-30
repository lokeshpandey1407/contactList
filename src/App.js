import { useEffect, useState } from "react";
import "./App.css";
import ContactList from "./Component/ContactList/ContactList";
import Navbar from "./Component/Navbar/Navbar";

function App() {
  const [contactList, setContactList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Function to fetch contacts from the API
  async function fetchContacts() {
    setLoading(true);
    await fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((response) => {
        setContactList(response);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  //UseEffect function to run the function when the component loads
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <ContactList
        contactList={contactList}
        error={error}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}

export default App;
