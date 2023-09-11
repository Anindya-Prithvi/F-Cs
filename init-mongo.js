db.createUser(
    {
      user: "admin",
      pwd: "admin",
      roles: [
        {
          role: "readWrite",
          db: "bob"
        }
      ]
    }
  );
  db.createCollection("test");