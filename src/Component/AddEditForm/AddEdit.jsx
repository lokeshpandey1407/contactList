import React, { useEffect, useState } from "react";
import styles from "./AddEdit.module.css";

//AddEdit component is used for both adding and editing the contact
const AddEdit = ({
  setShowAddForm,
  selectedRows,
  isEditing,
  setList,
  notify,
  setClearRows,
  setSelectedRows,
  list,
  setIsEditing,
}) => {
  const [newItem, setNewItem] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  //Validate function to validate the add contact input form
  const validate = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "name":
        if (!value.trim()) errorMsg = "Name is required.";
        break;
      case "username":
        if (!value.trim()) errorMsg = "Username is required.";
        break;
      case "email":
        if (!value.match(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i))
          errorMsg = "Enter a valid email address.";
        break;
      case "phone":
        if (!value.match(/^\d{10}$/))
          errorMsg = "Phone number should be 10 digits.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  //Handler function to handle input changes for add contact input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => {
      return { ...prev, [name]: value };
    });
    validate(name, value);
  };

  //Function to add/edit contact form, handling empty input errors and doing fetch call to server for POST and PATCH
  const handleAddEditContact = async () => {
    if (!newItem.name.trim()) {
      notify("Name cannot be empty", "error");
      return;
    }
    if (!newItem.username.trim()) {
      notify("Username cannot be empty", "error");
      return;
    }
    if (!newItem.email.trim()) {
      notify("Email cannot be empty", "error");
      return;
    }
    if (!newItem.phone.trim()) {
      notify("Phone cannot be empty", "error");
      return;
    }
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }
    setIsLoading(true);

    //condition if isEditing then it will PATCH
    if (isEditing) {
      setClearRows(false);
      let id = selectedRows[0].id;
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(newItem),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          const index = list.findIndex((item) => item.id === response.id);
          // list[index] = response;
          setList((prev) => {
            prev[index] = response;
            return prev;
          });
          notify("Contact Edited successfully", "success");
          setShowAddForm(false);
          setClearRows(true);
          setSelectedRows([]);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsLoading(false);
          setIsEditing(false);
        });
      //else condition, if isEditing is false then it will POST
    } else {
      await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          response.id += Math.random();
          setList((prev) => {
            return [...prev, response];
          });
          notify("Contact added successfully", "success");
          setShowAddForm(false);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  //UseEffect to set the values in the input if the contact is Editing
  useEffect(() => {
    if (isEditing) {
      setNewItem(selectedRows[0]);
    }
  }, []);

  return (
    <div className={styles.addEditForm}>
      <h3>{isEditing ? "Edit Contact" : "Add New Contact"}</h3>

      <div className={styles.formGroup}>
        <label htmlFor="name">Name*</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter Name"
          value={newItem?.name}
          onChange={handleInputChange}
          required
          className={styles.input}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="username">Username*</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Enter Username"
          value={newItem?.username}
          onChange={handleInputChange}
          required
          className={styles.input}
        />
        {errors.username && (
          <span className={styles.error}>{errors.username}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email*</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter Email"
          value={newItem?.email}
          onChange={handleInputChange}
          required
          className={styles.input}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone*</label>
        <input
          id="phone"
          type="text"
          name="phone"
          placeholder="Enter Phone"
          value={newItem?.phone}
          onChange={handleInputChange}
          required
          className={styles.input}
        />
        {errors.phone && <span className={styles.error}>{errors.phone}</span>}
      </div>
      {!isEditing ? (
        <button
          className={`${styles.btn} ${styles.saveBtn}`}
          onClick={handleAddEditContact}
          disabled={isLoading}
        >
          {isLoading ? "SAVING..." : "SAVE"}
        </button>
      ) : (
        <button
          className={`${styles.btn} ${styles.saveBtn}`}
          onClick={handleAddEditContact}
          disabled={isLoading}
        >
          {isLoading ? "EDITING..." : "EDIT"}
        </button>
      )}
      <button
        className={`${styles.btn} ${styles.cancelBtn}`}
        onClick={() => setShowAddForm(false)}
      >
        CANCEL
      </button>
      <button className={styles.closeBtn} onClick={() => setShowAddForm(false)}>
        X
      </button>
    </div>
  );
};

export default AddEdit;
