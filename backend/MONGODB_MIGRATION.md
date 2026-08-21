# MongoDB migration note

The backend now uses Mongoose and MongoDB. `MONGODB_URI` is the only database connection variable.

The former Prisma schema, migrations, generated client, and MySQL client have been removed from the backend. Existing services retain their accessor-style calls through `db/client.js`; that compatibility layer executes Mongoose queries and population without Prisma.

The compatibility layer is deliberately temporary. Its permissive schemas support the current REST payloads during the cutover, but production should complete typed relation schemas, ObjectId request validation, and a tested MySQL-to-Mongo export before removing the legacy accessor call shapes.

If existing MySQL data must be preserved, export it into MongoDB with the legacy numeric identifiers retained as ordinary `userId` and relation fields. New Mongo documents also expose `id` as the string form of `_id`. A fresh MongoDB database can start empty.

Required environment variables:

- `MONGODB_URI` (for example, `mongodb+srv://user:password@cluster.mongodb.net/skillswap`)
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- Optional: `JWT_URL_SECRET`, `FRONTEND_URL`, `BACKEND_URL`, email, AWS, VAPID, and `ADMIN_USER_IDS` settings
