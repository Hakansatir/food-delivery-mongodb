// Creates the users collection with $jsonSchema validation.
// Run: mongosh -u admin -p --file /schema/01_users.js  (Git Bash: //schema/...)
// WARNING: drops the existing collection (setup script, rebuilds from scratch).

db = db.getSiblingDB("food_delivery");

db.users.drop();

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "phone", "addresses", "createdAt"],
      properties: {
        name: { bsonType: "string", minLength: 1 },
        email: {
          bsonType: "string",
          pattern: "^.+@.+$"
        },
        phone: { bsonType: "string", minLength: 10 }, // simple length check: blocks empty/too short values
        createdAt: { bsonType: "date" },
        addresses: {
          bsonType: "array",
          maxItems: 5,  // addresses are bounded (see docs/data-model.md)
          items: {
            bsonType: "object",
            required: ["label", "street", "postalCode", "city", "location"],
            properties: {
              label: { bsonType: "string" },
              street: { bsonType: "string" },
              postalCode: {
                bsonType: "string",
                pattern: "^[0-9]{5}$"
              },
              city: { bsonType: "string" },
              location: {
                bsonType: "object",
                required: ["type", "coordinates"],
                properties: {
                  type: { enum: ["Point"] },
                  coordinates: { // GeoJSON order: [longitude, latitude]
                    bsonType: "array",
                    minItems: 2,
                    maxItems: 2,
                    items: { bsonType: "double", minimum: -180, maximum: 180 }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

print("users collection created with schema validation");
