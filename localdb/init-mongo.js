db.createUser({
    user: 'admin',
    pwd: 'securepassword',
    roles: [
        {
            role: 'root',
            db: 'admin'
        }
    ]
});
