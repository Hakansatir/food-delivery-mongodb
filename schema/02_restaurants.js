// Creates the restaurants collection with $jsonSchema validation.
// Run: mongosh -u admin -p --file /schema/02_restaurants.js  (Git Bash: //schema/...)
// WARNING: drops the existing collection (setup script, rebuilds from scratch).

db = db.getSiblingDB("food_delivery");

db.restaurants.drop();

db.createCollection("restaurants", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "cuisine", "address", "location", "openingHours", "menu"],
      properties: {
        name: { bsonType: "string", minLength: 1 },
        cuisine: {
          enum: ["turkish", "german", "italian", "french", "japanese", "chinese"]
        },
        address: {
          bsonType: "object",
          required: ["street", "postalCode", "city"],
          properties: {
            street: { bsonType: "string", minLength: 1 },
            postalCode: { bsonType: "string", pattern: "^[0-9]{5}$" },
            city: { bsonType: "string", minLength: 1 }
          }
        },
        location: { // GeoJSON order: [longitude, latitude]; ready for a 2dsphere index
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            type: { enum: ["Point"] },
            coordinates: {
              bsonType: "array",
              minItems: 2,
              maxItems: 2,
              items: { bsonType: "double", minimum: -180, maximum: 180 }
            }
          }
        },
        openingHours: {
          bsonType: "array",
          maxItems: 7,
          items: {
            bsonType: "object",
            required: ["day", "open", "close"],
            properties: {
              day: { bsonType: "int", minimum: 1, maximum: 7 },
              open: { bsonType: "string", pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$"},
              close: { bsonType: "string", pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$"}
            }
          }
        },
        menu: {
          bsonType: "array",
          minItems: 1,
          maxItems: 200, 
          items: {
            bsonType: "object",
            required: ["name", "category", "price", "available"],
            properties: {
              name: { bsonType: "string", minLength: 1 },
              category: { enum: ["main", "side", "drink", "dessert"] },
              price: { bsonType: "decimal"},
              available: { bsonType: "bool" }
            }
          }
        }
      }
    }
  }
});

print("restaurants collection created with schema validation");
