// not needed as long as admin created
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