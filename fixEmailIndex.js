// fixEmailIndex.js

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://hellytheappideas_db_user:E2EULhlhMH7E6tGl@cluster0.nxbn5gs.mongodb.net') // apna DB URL yaha add karo
  .then(async () => {

    console.log('✅ MongoDB Connected');

    try {

      const db = mongoose.connection.db;

      // Show old indexes
      const indexesBefore = await db.collection('users').indexes();
      console.log('\n📌 OLD INDEXES:\n', indexesBefore);

      // Drop old email index if exists
      try {
        await db.collection('users').dropIndex('email_1');
        console.log('\n✅ Old email_1 index dropped');
      } catch (err) {
        console.log('\n⚠️ email_1 index not found or already removed');
      }

      // Create new sparse unique index
      await db.collection('users').createIndex(
        { email: 1 },
        {
          unique: true,
          sparse: true,
          name: 'email_1'
        }
      );

      console.log('\n✅ New sparse unique email index created');

      // Show updated indexes
      const indexesAfter = await db.collection('users').indexes();
      console.log('\n📌 UPDATED INDEXES:\n', indexesAfter);

      console.log('\n🎉 Email duplicate null issue fixed successfully');

      process.exit();

    } catch (error) {
      console.log('❌ ERROR =>', error);
      process.exit(1);
    }

  })
  .catch(err => {
    console.log('❌ Mongo Connection Error =>', err);
  });