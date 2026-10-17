// Creates the couriers collection with $jsonSchema validation.
// Run: mongosh -u admin -p --file /schema/03_couriers.js  (Git Bash: //schema/...)
// WARNING: drops the existing collection (setup script, rebuilds from scratch).

db = db.getSiblingDB("food_delivery");

db.couriers.drop();

db.createCollection("couriers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "phone", "vehicle", "status", "currentLocation", "locationUpdatedAt"],
      properties: {
        name: { bsonType: "string", minLength: 1 },
        phone: { bsonType: "string", minLength: 10 },
        vehicle: {
          enum: ["bike", "scooter", "car"]
        },
        status: {
          enum: ["offline", "available", "delivering"]
        },
        currentLocation: {  // last known location (also for offline couriers); see locationUpdatedAt
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
        locationUpdatedAt: {
          bsonType: "date"
        }
      }
    }
  }
});

print("couriers collection created with schema validation");