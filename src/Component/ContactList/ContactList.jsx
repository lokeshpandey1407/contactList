import React from "react";
import DataTable from "react-data-table-component";
import styles from "./ContactList.module.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import AddEdit from "../AddEditForm/AddEdit";

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Username",
    selector: (row) => row.username,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
    sortable: true,
  },
];

const ContactList = ({ contactList, error, loading, setLoading }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [list, setList] = useState([]);
  const [clearRows, setClearRows] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  //Functon to show notification on successful contact creation, deletion and updatation
  const notify = (message, type) => {
    toast[type](message, {
      duration: 4000,
    });
  };

  //Function to toggle show and hide the add/edit contact form modal
  const toggleAddEditForm = () => {
    setShowAddForm(!showAddForm);
  };

  //Add button action for React data table component for Adding a contact
  const actions = (
    <button
      className={styles.btn}
      style={{
        padding: ".35rem .7rem",
        borderRadius: "50%",
        fontSize: "1.2rem",
        backgroundColor: "#9dd8ff",
      }}
      title="Add Contact"
      onClick={toggleAddEditForm}
    >
      +
    </button>
  );

  //Function to handle row selection for React data table component
  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  //Delete functiont to delete a contact record and doing the delete request to server
  const handleDelete = async () => {
    const id = selectedRows[0].id;
    setLoading(true);
    setClearRows(false);
    await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        const updatedList = list.filter((contact) => contact.id !== id);
        setList(updatedList);
        setSelectedRows([]);
        notify("Contact deleted successfully", "success");
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
        setClearRows(true);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowAddForm(true);
  };

  //Contect Action function to set context actions for React data table component for Edit and Delete
  const contextActions = (
    <div>
      <button
        className={styles.btn}
        style={{ backgroundColor: "#83e478" }}
        title="Edit"
        onClick={handleEdit}
      >
        EDIT
      </button>
      <button
        className={styles.btn}
        style={{ backgroundColor: "#df9898" }}
        title="Delete"
        onClick={handleDelete}
      >
        DELETE
      </button>
    </div>
  );

  return (
    <div className={styles.contactListContainer}>
      {/* React data table component and its attributes */}
      <DataTable
        title="Contact List"
        pagination
        columns={columns}
        data={[...contactList, ...list]}
        selectableRows
        selectableRowsSingle
        fixedHeader
        striped
        progressPending={loading}
        onSelectedRowsChange={handleRowSelected}
        contextActions={contextActions}
        actions={actions}
        selectableRowsNoSelectAll
        clearSelectedRows={clearRows}
      />
      {showAddForm && (
        <AddEdit
          setShowAddForm={setShowAddForm}
          selectedRows={selectedRows}
          isEditing={isEditing}
          setList={setList}
          notify={notify}
          setClearRows={setClearRows}
          setSelectedRows={setSelectedRows}
          list={list}
          setIsEditing={setIsEditing}
        />
      )}
      {showAddForm && <div id="backdrop" className={styles.backdrop}></div>}
      {/* Toast component for notification */}
      <Toaster />
    </div>
  );
};

export default ContactList;
