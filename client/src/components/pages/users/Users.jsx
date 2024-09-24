import { fetchUsers } from '../../../api/userApi'
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'


 const Users = () => {
  const [userList, setUserList] = useState([]);;

  const fetch = async () => {
    const fetchedUsers = await fetchUsers();
    setUserList(fetchedUsers);
  };

  useEffect(() => {
    fetch();
  }, []);

  // userList.usersからemailだけを取得
  const userAll = userList.users ? userList.users.map(user => user) : [];

  return (
    <div>
      <h1>ユーザーメールリスト</h1>
      {userAll.map((user) => (
        <div key={user.id}>
          <Link to={`/users/${user.id}/posts`}>{user.email}</Link>
        </div>
      ))}
    </div>
  );
}

export default Users;