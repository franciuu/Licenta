import Layout from "./Layout";
const AddUser = () => {
  return (
    <Layout>
      <h1>Add user</h1>
      <form action="">
        <div className="inputDiv">
          <label htmlFor="name">Name: </label>
          <div className="input">
            <input type="text" id="name" placeholder="Name" />
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="email">Email: </label>
          <div className="input">
            <input type="email" id="email" placeholder="Email" />
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="password">Password: </label>
          <div className="input">
            <input type="password" id="password" placeholder="Password" />
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="confirmPassword">Confirm password: </label>
          <div className="input">
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
            />
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="role">Role: </label>
          <div className="input">
            <select id="role">
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn">
          Save
        </button>
      </form>
    </Layout>
  );
};

export default AddUser;
