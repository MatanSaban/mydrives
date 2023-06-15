import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  drives: {
    type: Object,
    default: {
      myDay: [],
      myWeek: [],
      myMonth: [],
      myAllTimes: [],
    },
  },
  cars: {
    type: Array,
    default: [],
  },
});

const Users = models.user || model("user", userSchema);
export default Users;
