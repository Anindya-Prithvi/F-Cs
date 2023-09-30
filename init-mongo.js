db.createUser(
    {
      user: "admin",
      pwd: "admin",
      roles: [
        {
          role: "readWrite",
          db: "bob"
        },
        { role: "userAdminAnyDatabase", db: "admin" }, 
        "readWriteAnyDatabase"
      ]
    }
  );
  db.createCollection("test");
